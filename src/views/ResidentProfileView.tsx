import React, { useState } from 'react';
import {
    ArrowLeft, User, Phone, Mail, Calendar, MapPin, Building,
    Briefcase, GraduationCap, Shield, ShieldCheck, ShieldAlert,
    Instagram, Facebook, FileText, Download, ExternalLink,
    Maximize2, X, CheckCircle2, Clock, Ban, Check, Bed,
    Wifi, Printer, AlertCircle, Copy, AlertTriangle
} from 'lucide-react';
import { Resident, Room, UserRole } from '../types';
import { updateResident } from '../lib/database';

interface ResidentProfileViewProps {
    resident: Resident;
    onBack: () => void;
    onRefresh?: () => void;
    isAdmin?: boolean;
    rooms?: Room[];
}

export function ResidentProfileView({
    resident,
    onBack,
    onRefresh,
    isAdmin = false,
    rooms = []
}: ResidentProfileViewProps) {
    const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [actionMsg, setActionMsg] = useState('');
    const [copiedPhone, setCopiedPhone] = useState(false);

    // Documentos anexados
    const frontDocUrl = resident.document_front_url || resident.document_urls?.[0];
    const backDocUrl = resident.document_back_url || resident.document_urls?.[1];

    const currentRoom = rooms.find(r => r.id === resident.room_id);

    const handleCopyPhone = () => {
        const cleanDigits = resident.phone.replace(/\D/g, '');
        navigator.clipboard.writeText(cleanDigits);
        setCopiedPhone(true);
        setTimeout(() => setCopiedPhone(false), 2500);
    };

    const handleWhatsAppClick = () => {
        const cleanDigits = resident.phone.replace(/\D/g, '');
        const text = encodeURIComponent(`Olá, ${resident.name}! Aqui é da administração da MoronaVila.`);
        window.open(`https://wa.me/55${cleanDigits}?text=${text}`, '_blank');
    };

    const handleEmergencyWhatsAppClick = () => {
        if (!resident.emergency_contact_phone) return;
        const cleanDigits = resident.emergency_contact_phone.replace(/\D/g, '');
        const text = encodeURIComponent(`Olá, ${resident.emergency_contact_name}! Aqui é da administração da MoronaVila a respeito do(a) residente ${resident.name}.`);
        window.open(`https://wa.me/55${cleanDigits}?text=${text}`, '_blank');
    };

    const handleApproveCandidate = async () => {
        if (!confirm(`Deseja aprovar ${resident.name} como Morador ativo da residência?`)) return;
        setIsUpdating(true);
        try {
            await updateResident(resident.id, {
                status: 'Ativo',
                habilitado: true
            });
            setActionMsg('Candidato aprovado com sucesso!');
            if (onRefresh) onRefresh();
            setTimeout(() => setActionMsg(''), 4000);
        } catch (err: any) {
            alert(`Erro ao aprovar candidato: ${err.message}`);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleToggleHabilitado = async () => {
        const newStatus = resident.habilitado === false ? true : false;
        const actionLabel = newStatus ? 'habilitar o acesso de' : 'bloquear o acesso de';
        if (!confirm(`Tem certeza que deseja ${actionLabel} ${resident.name}?`)) return;

        setIsUpdating(true);
        try {
            await updateResident(resident.id, {
                habilitado: newStatus,
                motivo_bloqueio: newStatus ? '' : 'Bloqueio administrativo temporário'
            });
            setActionMsg(`Acesso ${newStatus ? 'habilitado' : 'bloqueado'} com sucesso!`);
            if (onRefresh) onRefresh();
            setTimeout(() => setActionMsg(''), 4000);
        } catch (err: any) {
            alert(`Erro ao atualizar: ${err.message}`);
        } finally {
            setIsUpdating(false);
        }
    };

    // Formatação de data
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'Não informado';
        try {
            const parts = dateStr.split('-');
            if (parts.length === 3) {
                return `${parts[2]}/${parts[1]}/${parts[0]}`;
            }
            return new Date(dateStr).toLocaleDateString('pt-BR');
        } catch {
            return dateStr;
        }
    };

    // Calcular idade
    const getAge = (birthDate?: string) => {
        if (!birthDate) return null;
        try {
            const birth = new Date(birthDate);
            const now = new Date();
            let age = now.getFullYear() - birth.getFullYear();
            const m = now.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
            return age > 0 && age < 120 ? `${age} anos` : null;
        } catch {
            return null;
        }
    };

    const isCandidate = resident.status === 'Candidato';

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 selection:bg-rose-500 selection:text-white">
            {/* Lightbox / Zoom Modal de Documentos */}
            {lightboxImage && (
                <div
                    className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
                    onClick={() => setLightboxImage(null)}
                >
                    <div className="w-full max-w-4xl flex items-center justify-between pb-3 text-white">
                        <span className="font-bold text-sm uppercase tracking-wider text-rose-400">
                            {lightboxImage.title} — {resident.name}
                        </span>
                        <div className="flex items-center gap-2">
                            <a
                                href={lightboxImage.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                onClick={(e) => e.stopPropagation()}
                                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                                title="Abrir em tamanho original"
                            >
                                <ExternalLink size={18} />
                            </a>
                            <button
                                onClick={() => setLightboxImage(null)}
                                className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                                title="Fechar visualização"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    <div
                        className="relative max-w-4xl max-h-[85vh] overflow-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl flex items-center justify-center p-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={lightboxImage.url}
                            alt={lightboxImage.title}
                            className="max-w-full max-h-[80vh] object-contain rounded-xl"
                        />
                    </div>
                </div>
            )}

            {/* Top Bar de Navegação e Ações */}
            <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800 print:hidden">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
                    <button
                        onClick={onBack}
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors py-2.5 px-3.5 rounded-xl hover:bg-slate-900 border border-slate-800 cursor-pointer"
                    >
                        <ArrowLeft size={16} />
                        <span>Voltar aos Moradores</span>
                    </button>

                    <div className="flex items-center gap-2.5">
                        <button
                            onClick={() => window.print()}
                            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 transition-colors cursor-pointer"
                        >
                            <Printer size={15} />
                            <span>Imprimir Ficha</span>
                        </button>

                        <button
                            onClick={handleWhatsAppClick}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
                        >
                            <Phone size={15} />
                            <span>Conversar no WhatsApp</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
                {/* Alerta de Feedback de Ações */}
                {actionMsg && (
                    <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-3 animate-in fade-in duration-300">
                        <CheckCircle2 size={18} className="shrink-0" />
                        <span>{actionMsg}</span>
                    </div>
                )}

                {/* Card Principal de Identificação do Morador */}
                <div className="p-6 sm:p-8 rounded-[2.5rem] bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-800 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-start sm:items-center gap-5">
                            {/* Avatar com Foto ou Iniciais */}
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center font-black text-2xl sm:text-3xl shrink-0 shadow-xl shadow-rose-950/50 border-2 border-white/10">
                                {resident.photo_url ? (
                                    <img src={resident.photo_url} alt={resident.name} className="w-full h-full object-cover" />
                                ) : (
                                    resident.name?.charAt(0).toUpperCase() || 'M'
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${isCandidate
                                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                        : resident.status === 'Ativo'
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                            : 'bg-slate-800 text-slate-400 border-slate-700'
                                        }`}>
                                        {resident.status || 'Ativo'}
                                    </span>

                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${resident.role === UserRole.ADMIN
                                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                                        : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                        }`}>
                                        {resident.role === UserRole.ADMIN ? 'Administrador' : 'Morador'}
                                    </span>

                                    {resident.habilitado === false ? (
                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                                            <Ban size={10} /> Acesso Bloqueado
                                        </span>
                                    ) : (
                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                            <Check size={10} /> Habilitado
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                    {resident.name}
                                </h1>

                                <p className="text-xs text-slate-400 flex flex-wrap items-center gap-3">
                                    <span>Cadastrado em: <strong className="text-slate-300">{formatDate(resident.entry_date)}</strong></span>
                                    {currentRoom && (
                                        <span>• Quarto: <strong className="text-amber-400">{currentRoom.name}</strong></span>
                                    )}
                                    {resident.desired_room_type && !currentRoom && (
                                        <span>• Interesse: <strong className="text-rose-400">{resident.desired_room_type}</strong></span>
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Ações Administrativas do Card */}
                        {isAdmin && (
                            <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-800">
                                {isCandidate && (
                                    <button
                                        onClick={handleApproveCandidate}
                                        disabled={isUpdating}
                                        className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-rose-950/40 cursor-pointer disabled:opacity-50"
                                    >
                                        Aprovar como Morador
                                    </button>
                                )}

                                <button
                                    onClick={handleToggleHabilitado}
                                    disabled={isUpdating}
                                    className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border transition-all cursor-pointer disabled:opacity-50 ${resident.habilitado === false
                                        ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                        : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30'
                                        }`}
                                >
                                    {resident.habilitado === false ? 'Desbloquear Acesso' : 'Bloquear Acesso'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* SEÇÃO 1: DOCUMENTOS DE IDENTIDADE ANEXADOS (EM DESTAQUE) */}
                <div className="p-6 sm:p-8 rounded-[2.5rem] bg-slate-900/70 border border-slate-800 space-y-6 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                        <div>
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-rose-500">
                                Verificação Documental
                            </span>
                            <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight mt-0.5">
                                Documentos Anexados pelo Residente
                            </h2>
                        </div>
                        <span className="text-xs text-slate-400 font-medium">
                            RG ou CNH oficial com foto (Frente e Verso)
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Imagem da Frente */}
                        <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                                    <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                                        Frente do Documento (com foto)
                                    </span>
                                </div>
                                {frontDocUrl && (
                                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                                        Anexado
                                    </span>
                                )}
                            </div>

                            {frontDocUrl ? (
                                <div className="space-y-3">
                                    <div
                                        onClick={() => setLightboxImage({ url: frontDocUrl, title: 'Frente do Documento' })}
                                        className="relative group rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 h-64 flex items-center justify-center cursor-pointer"
                                    >
                                        <img
                                            src={frontDocUrl}
                                            alt="Frente do Documento"
                                            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-lg">
                                                <Maximize2 size={14} /> Ampliar Imagem
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs">
                                        <button
                                            onClick={() => setLightboxImage({ url: frontDocUrl, title: 'Frente do Documento' })}
                                            className="text-rose-400 hover:text-rose-300 font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                                        >
                                            <Maximize2 size={13} /> Visualizar em Tela Cheia
                                        </button>
                                        <a
                                            href={frontDocUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download
                                            className="text-slate-400 hover:text-white font-bold inline-flex items-center gap-1 transition-colors"
                                        >
                                            <Download size={13} /> Baixar Original
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-64 rounded-2xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-500 text-center p-6 space-y-2">
                                    <AlertTriangle size={32} className="text-amber-500/60" />
                                    <span className="text-xs font-bold text-slate-400">Frente não anexada</span>
                                    <span className="text-[11px] text-slate-600 max-w-xs">
                                        O morador não enviou a foto da frente pelo formulário.
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Imagem do Verso */}
                        <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                    <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                                        Verso do Documento (ou CNH completa)
                                    </span>
                                </div>
                                {backDocUrl && (
                                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                                        Anexado
                                    </span>
                                )}
                            </div>

                            {backDocUrl ? (
                                <div className="space-y-3">
                                    <div
                                        onClick={() => setLightboxImage({ url: backDocUrl, title: 'Verso do Documento' })}
                                        className="relative group rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 h-64 flex items-center justify-center cursor-pointer"
                                    >
                                        <img
                                            src={backDocUrl}
                                            alt="Verso do Documento"
                                            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-lg">
                                                <Maximize2 size={14} /> Ampliar Imagem
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs">
                                        <button
                                            onClick={() => setLightboxImage({ url: backDocUrl, title: 'Verso do Documento' })}
                                            className="text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                                        >
                                            <Maximize2 size={13} /> Visualizar em Tela Cheia
                                        </button>
                                        <a
                                            href={backDocUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download
                                            className="text-slate-400 hover:text-white font-bold inline-flex items-center gap-1 transition-colors"
                                        >
                                            <Download size={13} /> Baixar Original
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-64 rounded-2xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-500 text-center p-6 space-y-2">
                                    <AlertTriangle size={32} className="text-amber-500/60" />
                                    <span className="text-xs font-bold text-slate-400">Verso não anexado</span>
                                    <span className="text-[11px] text-slate-600 max-w-xs">
                                        O morador não enviou a foto do verso pelo formulário.
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* SEÇÃO 2: GRID DE INFORMAÇÕES DETALHADAS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Bloco 1: Dados Pessoais & Documentação */}
                    <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
                        <div className="flex items-center gap-2.5 text-rose-400 border-b border-slate-800 pb-3">
                            <User size={18} />
                            <h3 className="text-sm font-black uppercase tracking-wider text-white">
                                Identificação Pessoal
                            </h3>
                        </div>

                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div>
                                <dt className="text-slate-500 uppercase tracking-wider font-bold text-[10px]">Nome Completo</dt>
                                <dd className="font-bold text-slate-200 mt-0.5 text-sm">{resident.name}</dd>
                            </div>

                            <div>
                                <dt className="text-slate-500 uppercase tracking-wider font-bold text-[10px]">E-mail</dt>
                                <dd className="font-medium text-slate-200 mt-0.5 break-all">
                                    <a href={`mailto:${resident.email}`} className="hover:text-rose-400 transition-colors">
                                        {resident.email || 'Não informado'}
                                    </a>
                                </dd>
                            </div>

                            <div>
                                <dt className="text-slate-500 uppercase tracking-wider font-bold text-[10px]">WhatsApp / Telefone</dt>
                                <dd className="font-bold text-slate-200 mt-0.5 flex items-center gap-2">
                                    <span>{resident.phone || 'Não informado'}</span>
                                    {resident.phone && (
                                        <button
                                            onClick={handleCopyPhone}
                                            className="text-slate-400 hover:text-white p-1 transition-colors cursor-pointer"
                                            title="Copiar telefone"
                                        >
                                            {copiedPhone ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                        </button>
                                    )}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-slate-500 uppercase tracking-wider font-bold text-[10px]">CPF</dt>
                                <dd className="font-bold text-slate-200 mt-0.5">{resident.cpf || 'Não informado'}</dd>
                            </div>

                            <div>
                                <dt className="text-slate-500 uppercase tracking-wider font-bold text-[10px]">RG / Órgão</dt>
                                <dd className="font-bold text-slate-200 mt-0.5">{resident.rg || 'Não informado'}</dd>
                            </div>

                            <div>
                                <dt className="text-slate-500 uppercase tracking-wider font-bold text-[10px]">Nascimento / Idade</dt>
                                <dd className="font-bold text-slate-200 mt-0.5">
                                    {formatDate(resident.birth_date)} {getAge(resident.birth_date) ? `(${getAge(resident.birth_date)})` : ''}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {/* Bloco 2: Redes Sociais */}
                    <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
                        <div className="flex items-center gap-2.5 text-blue-400 border-b border-slate-800 pb-3">
                            <Instagram size={18} />
                            <h3 className="text-sm font-black uppercase tracking-wider text-white">
                                Redes Sociais & Contato Digital
                            </h3>
                        </div>

                        <div className="space-y-4 text-xs">
                            {/* Instagram */}
                            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
                                        <Instagram size={18} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Instagram</span>
                                        <span className="font-bold text-white text-sm">
                                            {resident.instagram ? (resident.instagram.startsWith('@') ? resident.instagram : `@${resident.instagram}`) : 'Não informado'}
                                        </span>
                                    </div>
                                </div>

                                {resident.instagram && (
                                    <a
                                        href={resident.instagram.startsWith('http')
                                            ? resident.instagram
                                            : `https://instagram.com/${resident.instagram.replace('@', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-white transition-colors"
                                        title="Abrir Instagram"
                                    >
                                        <ExternalLink size={14} />
                                    </a>
                                )}
                            </div>

                            {/* Facebook */}
                            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                                        <Facebook size={18} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Facebook</span>
                                        <span className="font-bold text-white text-sm">
                                            {resident.facebook || 'Não informado'}
                                        </span>
                                    </div>
                                </div>

                                {resident.facebook && (
                                    <a
                                        href={resident.facebook.startsWith('http')
                                            ? resident.facebook
                                            : `https://facebook.com/${encodeURIComponent(resident.facebook)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-xl bg-slate-800 hover:bg-blue-600 text-white transition-colors"
                                        title="Abrir Facebook"
                                    >
                                        <ExternalLink size={14} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bloco 3: Endereços e Origem */}
                    <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
                        <div className="flex items-center gap-2.5 text-amber-400 border-b border-slate-800 pb-3">
                            <MapPin size={18} />
                            <h3 className="text-sm font-black uppercase tracking-wider text-white">
                                Localização & Origem
                            </h3>
                        </div>

                        <dl className="space-y-3.5 text-xs">
                            <div>
                                <dt className="text-slate-500 uppercase tracking-wider font-bold text-[10px]">Endereço Anterior / Cidade de Origem</dt>
                                <dd className="font-bold text-slate-200 mt-1 leading-relaxed">
                                    {resident.origin_address || 'Não informado'}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-slate-500 uppercase tracking-wider font-bold text-[10px]">Endereço da Família / Responsáveis</dt>
                                <dd className="font-bold text-slate-200 mt-1 leading-relaxed">
                                    {resident.family_address || 'Não informado'}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {/* Bloco 4: Contato de Emergência */}
                    <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/60 border border-rose-500/20 space-y-4">
                        <div className="flex items-center gap-2.5 text-rose-400 border-b border-slate-800 pb-3">
                            <ShieldAlert size={18} />
                            <h3 className="text-sm font-black uppercase tracking-wider text-white">
                                Contato de Emergência
                            </h3>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div>
                                <span className="text-slate-500 uppercase tracking-wider font-bold text-[10px] block">Nome do Responsável</span>
                                <span className="font-bold text-white text-base block mt-0.5">
                                    {resident.emergency_contact_name || 'Não informado'}
                                </span>
                            </div>

                            <div>
                                <span className="text-slate-500 uppercase tracking-wider font-bold text-[10px] block">WhatsApp / Telefone</span>
                                <div className="flex items-center justify-between gap-3 mt-1 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                                    <span className="font-bold text-slate-200 text-sm">
                                        {resident.emergency_contact_phone || 'Não informado'}
                                    </span>
                                    {resident.emergency_contact_phone && (
                                        <button
                                            onClick={handleEmergencyWhatsAppClick}
                                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                                        >
                                            <Phone size={12} /> Chamar
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bloco 5: Ocupação & Formação */}
                    <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
                        <div className="flex items-center gap-2.5 text-emerald-400 border-b border-slate-800 pb-3">
                            <Briefcase size={18} />
                            <h3 className="text-sm font-black uppercase tracking-wider text-white">
                                Profissão & Formação
                            </h3>
                        </div>

                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div>
                                <dt className="text-slate-500 uppercase tracking-wider font-bold text-[10px]">Profissão / Ocupação</dt>
                                <dd className="font-bold text-slate-200 mt-0.5">{resident.occupation || 'Não informada'}</dd>
                            </div>

                            <div>
                                <dt className="text-slate-500 uppercase tracking-wider font-bold text-[10px]">Empresa / Local de Trabalho</dt>
                                <dd className="font-bold text-slate-200 mt-0.5">{resident.company || 'Não informada'}</dd>
                            </div>

                            <div>
                                <dt className="text-slate-500 uppercase tracking-wider font-bold text-[10px]">Faculdade / Universidade</dt>
                                <dd className="font-medium text-slate-300 mt-0.5">{resident.university || 'Não informado'}</dd>
                            </div>

                            <div>
                                <dt className="text-slate-500 uppercase tracking-wider font-bold text-[10px]">Curso / Formação</dt>
                                <dd className="font-medium text-slate-300 mt-0.5">{resident.course || 'Não informado'}</dd>
                            </div>
                        </dl>
                    </div>

                    {/* Bloco 6: Convivência, Contrato & Quarto */}
                    <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
                        <div className="flex items-center gap-2.5 text-indigo-400 border-b border-slate-800 pb-3">
                            <Bed size={18} />
                            <h3 className="text-sm font-black uppercase tracking-wider text-white">
                                Acomodação & Infraestrutura
                            </h3>
                        </div>

                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div>
                                <dt className="text-slate-500 uppercase tracking-wider font-bold text-[10px]">Acomodação Desejada</dt>
                                <dd className="font-black text-rose-400 mt-0.5">{resident.desired_room_type || 'Quarto Individual'}</dd>
                            </div>

                            <div>
                                <dt className="text-slate-500 uppercase tracking-wider font-bold text-[10px]">Quarto Atual Atribuído</dt>
                                <dd className="font-bold text-slate-200 mt-0.5">
                                    {currentRoom ? currentRoom.name : 'Aguardando atribuição'}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-slate-500 uppercase tracking-wider font-bold text-[10px]">Aluguel Base</dt>
                                <dd className="font-bold text-emerald-400 mt-0.5">
                                    R$ {(resident.rent_value || 900).toFixed(2)} + R$ {(resident.cleaning_fee || 60).toFixed(2)} (Taxa)
                                </dd>
                            </div>

                            <div>
                                <dt className="text-slate-500 uppercase tracking-wider font-bold text-[10px]">Data Prevista / Entrada</dt>
                                <dd className="font-bold text-slate-200 mt-0.5">{formatDate(resident.entry_date)}</dd>
                            </div>

                            <div>
                                <dt className="text-slate-500 uppercase tracking-wider font-bold text-[10px]">Ramal Softphone</dt>
                                <dd className="font-bold text-slate-200 mt-0.5">{resident.softphone_extension || 'Sem ramal'}</dd>
                            </div>

                            <div>
                                <dt className="text-slate-500 uppercase tracking-wider font-bold text-[10px]">Internet & MAC</dt>
                                <dd className="font-bold text-slate-200 mt-0.5">
                                    {resident.internet_active ? 'Ativa' : 'Inativa'} {resident.mac_address ? `• ${resident.mac_address}` : ''}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </main>
        </div>
    );
}

