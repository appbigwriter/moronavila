import React, { useState } from 'react';
import { Home, LogIn, UserPlus, Mail, Lock, User, Phone, ArrowRight, Heart, Sparkles, CheckCircle2, AlertCircle, HelpCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { signIn, signUpResident, resetPassword } from '../lib/database';
import { supabase } from '../lib/supabase';

export function Login({
    onLogin,
    onBack,
    onNavigateToRules,
    externalMessage
}: {
    onLogin: (authId: string, session?: any) => Promise<void> | void,
    onBack?: () => void,
    onNavigateToRules?: () => void,
    externalMessage?: string
}) {
    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // --- GUIA NOVO RESIDENTE ---
    const [isNewResidentGuide, setIsNewResidentGuide] = useState(false);
    const [guideStep, setGuideStep] = useState<1 | 2>(1);
    const [registeredChoice, setRegisteredChoice] = useState<'yes' | 'no' | null>(null);
    const [receivedEmailChoice, setReceivedEmailChoice] = useState<'yes' | 'no' | null>(null);
    const [lookupEmail, setLookupEmail] = useState('');
    const [lookupLoading, setLookupLoading] = useState(false);
    const [lookupResult, setLookupResult] = useState<{
        success: boolean;
        found: boolean;
        approved?: boolean;
        status?: string;
        message: string;
    } | null>(null);

    const handleGoToRules = () => {
        if (onNavigateToRules) {
            onNavigateToRules();
        } else {
            window.location.hash = '#regras';
            if (onBack) onBack();
        }
    };

    const handleLookupAndResend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!lookupEmail || !lookupEmail.trim()) return;
        setLookupLoading(true);
        setLookupResult(null);
        const cleanEmail = lookupEmail.trim().toLowerCase();

        try {
            const res = await fetch('/api/resend-access-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: cleanEmail })
            });
            const data = await res.json();

            if (res.ok && data.found !== undefined) {
                setLookupResult({
                    ...data,
                    message: data.message || data.error || 'Consulta concluída.'
                });
                return;
            }
            throw new Error(data?.error || data?.message || 'Erro no backend ao consultar cadastro.');
        } catch (backendErr: any) {
            console.warn('Backend lookup falhou, usando busca direta Supabase no navegador:', backendErr?.message);
            try {
                // Fallback direto pelo navegador (garante localização no Supabase mesmo se o backend falhar)
                const { data: exactMatches, error: sbErr } = await supabase
                    .from('residents')
                    .select('id, name, email, status, habilitado')
                    .ilike('email', cleanEmail)
                    .limit(1);

                if (sbErr) throw sbErr;

                let resident = exactMatches?.[0] || null;
                if (!resident) {
                    const { data: fuzzyMatches } = await supabase
                        .from('residents')
                        .select('id, name, email, status, habilitado')
                        .ilike('email', `%${cleanEmail}%`)
                        .limit(5);
                    resident = (fuzzyMatches || []).find(
                        (r: any) => String(r?.email || '').trim().toLowerCase() === cleanEmail
                    ) || null;
                }

                if (!resident) {
                    setLookupResult({
                        success: false,
                        found: false,
                        message: 'Nenhum cadastro encontrado com este e-mail. Por favor, verifique se digitou corretamente ou realize seu cadastro inicial.'
                    });
                    return;
                }

                const isApproved = resident.status === 'Ativo' && resident.habilitado !== false;

                // Dispara envio de e-mail via endpoint leve SMTP que não depende do Supabase no servidor
                let emailSent = false;
                let emailError = '';
                try {
                    const emailRes = await fetch('/api/send-notification-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            type: isApproved ? 'approval' : 'confirmation',
                            email: resident.email,
                            name: resident.name
                        })
                    });
                    const emailData = await emailRes.json();
                    emailSent = !!emailData.success;
                    emailError = emailData.error || '';
                } catch (mailErr: any) {
                    emailError = mailErr?.message || 'Falha de comunicação SMTP';
                }

                if (isApproved) {
                    setLookupResult({
                        success: true,
                        found: true,
                        approved: true,
                        status: resident.status,
                        message: emailSent
                            ? 'Seu cadastro foi localizado e já está aprovado! Reenviamos suas orientações e link de acesso para o seu e-mail.'
                            : `Seu cadastro foi localizado e já está aprovado! Você já pode acessar seu Dashboard na tela de login. (Aviso envio SMTP: ${emailError || 'indisponível'})`
                    });
                } else {
                    setLookupResult({
                        success: true,
                        found: true,
                        approved: false,
                        status: resident.status || 'Candidato',
                        message: emailSent
                            ? 'Seu cadastro foi localizado! Ele está em fase de análise e aprovação pela administração. Reenviamos o e-mail de confirmação para você.'
                            : `Seu cadastro foi localizado e está em análise pela administração. (Aviso envio SMTP: ${emailError || 'indisponível'})`
                    });
                }
            } catch (fallbackErr: any) {
                setLookupResult({
                    success: false,
                    found: false,
                    message: fallbackErr?.message || backendErr?.message || 'Erro ao localizar cadastro. Tente novamente mais tarde.'
                });
            }
        } finally {
            setLookupLoading(false);
        }
    };

    const resetGuide = () => {
        setIsNewResidentGuide(false);
        setGuideStep(1);
        setRegisteredChoice(null);
        setReceivedEmailChoice(null);
        setLookupEmail('');
        setLookupResult(null);
        setError('');
        setSuccessMessage('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');
        try {
            if (isForgotPassword) {
                await resetPassword(email);
                setSuccessMessage('Instruções de recuperação de senha foram enviadas!');
                setIsForgotPassword(false);
            } else if (isLogin) {
                const data = await signIn(email, password);
                if (data?.user) {
                    await onLogin(data.user.id, data.session);
                }
            } else {
                const { user } = await signUpResident(email, password, name, phone);
                if (user) {
                    let emailNotice = '';
                    try {
                        const mailRes = await fetch('/api/send-notification-email', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                type: 'confirmation',
                                email: email.trim().toLowerCase(),
                                name: name.trim()
                            })
                        });
                        const mailData = await mailRes.json();
                        if (mailData?.emailSent) {
                            emailNotice = ' Enviamos um e-mail de confirmação para você.';
                        }
                    } catch {
                        // mantém fluxo mesmo se notificação de e-mail falhar
                    }
                    setSuccessMessage(`Cadastro recebido!${emailNotice} Aguarde a liberação da administração antes do primeiro acesso.`);
                    setIsLogin(true);
                    setPassword('');
                }
            }
        } catch (err: any) {
            setError(err.message || 'Algo deu errado. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-110 blur-[2px]"
                style={{ backgroundImage: 'url("https://images.pexels.com/photos/5935228/pexels-photo-5935228.jpeg")' }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/90 to-rose-950/40"></div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-600/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]"></div>

            <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-0 relative z-10 bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-700">

                {/* Visual Side (Hidden on mobile) */}
                <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-b from-white/5 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="bg-rose-600 p-3 rounded-2xl text-white shadow-xl shadow-rose-900/20">
                            <Home size={28} />
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Morona<span className="text-rose-600">Vila</span></h1>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-5xl font-black text-white leading-tight tracking-tighter uppercase italic">
                            Viver feliz <br />
                            <span className="text-rose-600">perto de tudo</span>
                        </h2>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[280px]">
                            A gestão inteligente que você precisava para sua moradia compartilhada, com a harmonia que você merece.
                        </p>

                        {onBack && (
                            <div className="pt-4">
                                <button
                                    onClick={onBack}
                                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest transition-all border border-white/10 cursor-pointer"
                                >
                                    <ArrowRight className="rotate-180" size={16} /> Voltar para o Site
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4 text-white/40">
                        <Heart size={16} className="text-rose-600 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Feito com carinho para você</span>
                    </div>
                </div>

                {/* Form / Wizard Side */}
                <div className="p-8 lg:p-12 bg-slate-950/50">
                    {/* Header for mobile */}
                    <div className="lg:hidden flex flex-col items-center mb-10 relative">
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="absolute left-0 top-0 p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <ArrowRight className="rotate-180" size={20} />
                            </button>
                        )}
                        <div className="bg-rose-600 p-2.5 rounded-xl text-white mb-4 shadow-lg shadow-rose-900/30">
                            <Home size={24} />
                        </div>
                        <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">Morona<span className="text-rose-600">Vila</span></h1>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Viver feliz perto de tudo</p>
                    </div>

                    {/* BOTÃO PROEMINENTE: NOVO RESIDENTE, CLIQUE AQUI */}
                    {!isNewResidentGuide && (
                        <div className="mb-6">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsNewResidentGuide(true);
                                    setGuideStep(1);
                                    setRegisteredChoice(null);
                                    setReceivedEmailChoice(null);
                                    setLookupResult(null);
                                }}
                                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600/20 via-indigo-600/20 to-rose-600/20 hover:from-rose-600/30 hover:to-indigo-600/30 border border-rose-500/40 hover:border-rose-400 text-white font-black text-xs uppercase tracking-wider flex items-center justify-between transition-all shadow-lg shadow-rose-950/30 group cursor-pointer"
                            >
                                <div className="flex items-center gap-2.5">
                                    <Sparkles size={16} className="text-amber-400 group-hover:rotate-12 transition-transform shrink-0" />
                                    <span className="text-left font-black tracking-wide">Novo residente, clique aqui</span>
                                </div>
                                <ArrowRight size={15} className="text-rose-400 group-hover:translate-x-1 transition-transform shrink-0" />
                            </button>
                        </div>
                    )}

                    {/* CONTEÚDO DO GUIA DO NOVO RESIDENTE */}
                    {isNewResidentGuide ? (
                        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                                <div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight italic">
                                        Guia do Novo Residente
                                    </h3>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                        Orientação de Acesso ao Dashboard
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={resetGuide}
                                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
                                    title="Voltar ao login"
                                >
                                    <ArrowLeft size={16} />
                                </button>
                            </div>

                            {/* PERGUNTA 1: JÁ FEZ CADASTRO? */}
                            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-full bg-rose-600/20 border border-rose-500/40 text-rose-400 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                                        1
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-white uppercase tracking-wide">
                                            Já fez o seu cadastro?
                                        </h4>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            Preencheu o formulário com dados pessoais e fotos dos documentos?
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setRegisteredChoice('yes');
                                            setGuideStep(2);
                                        }}
                                        className={`py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider border transition-all cursor-pointer ${
                                            registeredChoice === 'yes'
                                                ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-950/40'
                                                : 'bg-slate-950/60 hover:bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                                        }`}
                                    >
                                        ✓ Sim
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setRegisteredChoice('no');
                                            setGuideStep(1);
                                        }}
                                        className={`py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider border transition-all cursor-pointer ${
                                            registeredChoice === 'no'
                                                ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-950/40'
                                                : 'bg-slate-950/60 hover:bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                                        }`}
                                    >
                                        ✕ Não
                                    </button>
                                </div>

                                {registeredChoice === 'no' && (
                                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-slate-200 text-xs space-y-3 animate-in fade-in duration-300">
                                        <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                                            <AlertCircle size={15} /> Cadastro Necessário
                                        </div>
                                        <p className="leading-relaxed">
                                            Para ingressar no Residencial Moronavila, você precisa aceitar as 12 Regras de Conduta e enviar sua ficha cadastral.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={handleGoToRules}
                                            className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                                        >
                                            <span>Ir para o Aceite de Regras e Cadastro</span>
                                            <ArrowRight size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* PERGUNTA 2: RECEBEU EMAIL DE CONFIRMAÇÃO DO CADASTRO? */}
                            {registeredChoice === 'yes' && (
                                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 animate-in fade-in duration-300">
                                    <div className="flex items-start gap-3">
                                        <div className="w-7 h-7 rounded-full bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                                            2
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-white uppercase tracking-wide">
                                                Recebeu e-mail de confirmação do cadastro?
                                            </h4>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                Verifique sua caixa de entrada e pasta de spam.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 pt-1">
                                        <button
                                            type="button"
                                            onClick={() => setReceivedEmailChoice('yes')}
                                            className={`py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider border transition-all cursor-pointer ${
                                                receivedEmailChoice === 'yes'
                                                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-950/40'
                                                    : 'bg-slate-950/60 hover:bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                                            }`}
                                        >
                                            ✓ Sim
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setReceivedEmailChoice('no')}
                                            className={`py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider border transition-all cursor-pointer ${
                                                receivedEmailChoice === 'no'
                                                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-950/40'
                                                    : 'bg-slate-950/60 hover:bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                                            }`}
                                        >
                                            ✕ Não
                                        </button>
                                    </div>

                                    {/* CASO SIM: Use o e-mail cadastrado e a senha que recebeu/criou */}
                                    {receivedEmailChoice === 'yes' && (
                                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-slate-200 text-xs space-y-3 animate-in fade-in duration-300">
                                            <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                                                <CheckCircle2 size={16} /> Pronto para Entrar
                                            </div>
                                            <p className="leading-relaxed">
                                                Use o <strong>e-mail cadastrado</strong> e a <strong>senha de acesso</strong> que você definiu na confirmação do cadastro para entrar no seu Dashboard.
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsNewResidentGuide(false);
                                                    setIsLogin(true);
                                                    setIsForgotPassword(false);
                                                }}
                                                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                                            >
                                                <span>Ir para a Tela de Login</span>
                                                <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    )}

                                    {/* CASO NÃO: Informe o e-mail para localizar e reenviar */}
                                    {receivedEmailChoice === 'no' && (
                                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs space-y-3 animate-in fade-in duration-300">
                                            <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-wider text-[11px]">
                                                <HelpCircle size={15} /> Não recebeu o e-mail?
                                            </div>
                                            <p className="text-slate-400 leading-relaxed">
                                                Informe o e-mail que você cadastrou. O sistema localizará seu registro, verificará se foi aprovado e reenviará a senha e orientações de acesso ao sistema de residentes.
                                            </p>

                                            <form onSubmit={handleLookupAndResend} className="space-y-3 pt-1">
                                                <div className="relative group">
                                                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-rose-500 transition-colors" />
                                                    <input
                                                        type="email"
                                                        required
                                                        value={lookupEmail}
                                                        onChange={(e) => setLookupEmail(e.target.value)}
                                                        placeholder="Digite o e-mail cadastrado"
                                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-rose-500 placeholder:text-slate-600"
                                                    />
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={lookupLoading}
                                                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                                                >
                                                    {lookupLoading ? (
                                                        <RefreshCw size={14} className="animate-spin" />
                                                    ) : (
                                                        <>
                                                            <span>Localizar e Reenviar Acesso</span>
                                                            <ArrowRight size={14} />
                                                        </>
                                                    )}
                                                </button>
                                            </form>

                                            {lookupResult && (
                                                <div className={`p-4 rounded-xl border mt-3 space-y-2 animate-in fade-in duration-300 ${
                                                    lookupResult.found && lookupResult.approved
                                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                                                        : lookupResult.found && !lookupResult.approved
                                                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                                                        : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                                                }`}>
                                                    <p className="font-bold text-xs leading-relaxed">
                                                        {lookupResult.message}
                                                    </p>
                                                    {lookupResult.found && lookupResult.approved && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setEmail(lookupEmail);
                                                                setIsNewResidentGuide(false);
                                                                setIsLogin(true);
                                                            }}
                                                            className="mt-2 text-[11px] font-black underline uppercase tracking-wider text-emerald-400 hover:text-white cursor-pointer"
                                                        >
                                                            → Ir para Login com este e-mail
                                                        </button>
                                                    )}
                                                    {!lookupResult.found && (
                                                        <button
                                                            type="button"
                                                            onClick={handleGoToRules}
                                                            className="mt-2 text-[11px] font-black underline uppercase tracking-wider text-rose-400 hover:text-white cursor-pointer"
                                                        >
                                                            → Fazer Cadastro Inicial Agora
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="pt-2 text-center">
                                <button
                                    type="button"
                                    onClick={resetGuide}
                                    className="text-[11px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors cursor-pointer"
                                >
                                    ← Voltar para a tela de Login
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* FORMULÁRIO PADRÃO DE LOGIN / CADASTRO */
                        <>
                            <div className="mb-8">
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight italic">
                                    {isForgotPassword ? 'Recuperar Acesso' : (isLogin ? 'Bem-vindo de volta' : 'Comece sua jornada')}
                                </h3>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                                    {isForgotPassword
                                        ? 'Enviaremos um link de reset para o seu e-mail'
                                        : (isLogin ? 'Acesse sua conta para continuar' : 'Preencha seus dados para cadastrar')}
                                </p>
                            </div>

                            {(error || successMessage || externalMessage) && (
                                <div className={`p-4 rounded-2xl mb-8 flex items-center gap-3 animate-in slide-in-from-top-2 
                                    ${error || externalMessage ? 'bg-rose-500/10 border border-rose-500/20 text-rose-500' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500'}`}>
                                    <span className="text-xs font-black uppercase tracking-widest italic">{error || externalMessage || successMessage}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {!isLogin && !isForgotPassword && (
                                    <div className="grid grid-cols-1 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome Completo</label>
                                            <div className="relative group">
                                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-rose-500 transition-colors" />
                                                <input
                                                    type="text" required
                                                    value={name} onChange={(e) => setName(e.target.value)}
                                                    className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500/50 transition-all placeholder:text-slate-700"
                                                    placeholder="Ex: João Silva"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">WhatsApp</label>
                                            <div className="relative group">
                                                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-rose-500 transition-colors" />
                                                <input
                                                    type="tel" required
                                                    value={phone} onChange={(e) => setPhone(e.target.value)}
                                                    className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500/50 transition-all placeholder:text-slate-700"
                                                    placeholder="(11) 99999-9999"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {!isLogin && !isForgotPassword && (
                                    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-amber-200">
                                        Cadastros públicos entram como pendentes e dependem de liberação da administração.
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">E-mail</label>
                                    <div className="relative group">
                                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-rose-500 transition-colors" />
                                        <input
                                            type="email" required
                                            autoComplete="email"
                                            value={email} onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500/50 transition-all placeholder:text-slate-700"
                                            placeholder="seu@email.com"
                                        />
                                    </div>
                                </div>

                                {!isForgotPassword && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Senha</label>
                                        <div className="relative group">
                                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-rose-500 transition-colors" />
                                            <input
                                                type="password" required minLength={6}
                                                autoComplete={isLogin ? "current-password" : "new-password"}
                                                value={password} onChange={(e) => setPassword(e.target.value)}
                                                className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500/50 transition-all placeholder:text-slate-700"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        {isLogin && (
                                            <div className="flex justify-end pr-2">
                                                <button
                                                    type="button"
                                                    onClick={() => { setIsForgotPassword(true); setError(''); setSuccessMessage(''); }}
                                                    className="text-[10px] font-black text-slate-500 hover:text-rose-600 uppercase tracking-widest transition-colors cursor-pointer"
                                                >
                                                    Recuperar Senha?
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <button
                                    type="submit" disabled={loading}
                                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl py-4 flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-rose-950/20 disabled:opacity-50 mt-8 cursor-pointer"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            {isForgotPassword ? null : (isLogin ? <LogIn size={18} /> : <UserPlus size={18} />)}
                                            {isForgotPassword ? 'Redefinir Senha' : (isLogin ? 'Entrar no Sistema' : 'Criar minha Conta')}
                                        </>
                                    )}
                                </button>

                                <div className="pt-6 text-center">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsForgotPassword(false);
                                            setIsLogin(!isLogin);
                                            setError('');
                                            setSuccessMessage('');
                                        }}
                                        className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto group cursor-pointer"
                                    >
                                        {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça Login'}
                                        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
