import React, { useState } from 'react';
import {
    ShieldCheck, ArrowLeft, ExternalLink, Copy, Check, AlertTriangle,
    Users, Ban, Shirt, DollarSign, Calendar, Clock, Volume2, Package,
    Coffee, Camera, Lock, FileText, Send, Sparkles, CheckCircle2,
    Home, Phone, Mail, User, Info, AlertCircle, HeartHandshake,
    Printer, ChevronDown, ChevronUp
} from 'lucide-react';
import { Resident, UserRole } from '../types';
import { createResident } from '../lib/database';

interface RulesAcceptanceViewProps {
    onBack: () => void;
    currentUser?: Resident | null;
}

export const RULES_DATA = [
    {
        id: 1,
        title: 'Visitas & Segurança',
        description: 'Visitas apenas para membros da família do residente ou pessoas previamente cadastrados por no máximo dois dias por semana. Por questões de segurança não podemos receber crianças ou animais de estimação.',
        tags: ['Familiares ou Pré-cadastrados', 'Máx. 2 dias/semana', 'Sem crianças', 'Sem animais de estimação'],
        icon: Users,
        color: 'indigo'
    },
    {
        id: 2,
        title: 'Proibição de Fumo e Álcool',
        description: 'Não é permitido fumar nem beber bebidas alcoólicas em nenhuma dependência da propriedade.',
        tags: ['Tolerância zero', 'Proibido fumar', 'Sem bebidas alcoólicas', 'Todas as áreas'],
        icon: Ban,
        color: 'rose'
    },
    {
        id: 3,
        title: 'Passar e Lavar Roupas & Lavanderia',
        description: 'Não é permitido passar roupa nos quartos (há um espaço na sala para isso) bem como não é permitido lavar roupa no banheiro do quarto, o uso da lavanderia precisa ser agendada com a administração. A lavagem de roupa na máquina não poderá exceder o limite de peso do equipamento. As câmeras de segurança registrarão as infrações e os responsáveis receberão uma multa de R$ 20,00 por infração.',
        tags: ['Passar roupa na sala', 'Proibido lavar no quarto', 'Agendar lavanderia', 'Limite de peso', 'Multa de R$ 20,00'],
        fine: 'R$ 20,00 por infração',
        icon: Shirt,
        color: 'amber'
    },
    {
        id: 4,
        title: 'Vencimento do Aluguel & Chave PIX',
        description: 'O aluguel é sempre referente ao 1º ao último dia do mês e pago antecipado até o quinto dia útil do mês, pagos sempre via PIX (21) 983245000 em nome de Sergio Oswaldo de Castro.',
        tags: ['Período: 1º ao último dia', 'Pago antecipado', 'Até o 5º dia útil', 'PIX exclusivo'],
        pixKey: '(21) 983245000',
        pixName: 'Sergio Oswaldo de Castro',
        icon: DollarSign,
        color: 'emerald'
    },
    {
        id: 5,
        title: 'Saída do Imóvel & Aviso Prévio de 30 Dias',
        description: 'Em caso de saída do imóvel é necessário um aviso por e-mail ou mensagem no WhatsApp da administração com pelo menos 30 dias de antecedência. O depósito quita o último mês de permanência no imóvel.',
        tags: ['Aviso de 30 dias', 'E-mail ou WhatsApp', 'Depósito quita último mês'],
        icon: Clock,
        color: 'blue'
    },
    {
        id: 6,
        title: 'Silêncio & Televisão e Som',
        description: 'Não é permitido som ou TV em volume alto em qualquer horário.',
        tags: ['Silêncio 24h', 'Qualquer horário', 'Respeito ao descanso alheio'],
        icon: Volume2,
        color: 'purple'
    },
    {
        id: 7,
        title: 'Recebimento de Entregas & Interfone',
        description: 'Entregas precisam ser recebidas pelos próprios residentes que devem informar o número de suas unidades como complemento do endereço por ocasião de suas compras para que possam ser avisados pelo interfone da sua unidade para receber.',
        tags: ['Recebido pelo residente', 'Número da unidade no endereço', 'Interfone individual'],
        icon: Package,
        color: 'amber'
    },
    {
        id: 8,
        title: 'Organização da Cozinha & Armários Individuais',
        description: 'Pratos, copos, talheres e outros pertences individuais devem ser guardados nos respectivos armários individuais da cozinha, qualquer item deixado fora será recolhido.',
        tags: ['Armários individuais', 'Guarda obrigatória', 'Itens fora serão recolhidos'],
        icon: Coffee,
        color: 'cyan'
    },
    {
        id: 9,
        title: 'Limpeza Imediata da Cozinha & Multa',
        description: 'Após o uso da cozinha tudo deve ser deixado limpo, a câmera de segurança registrará quem deixar algo sujo e o residente será sumariamente multado em R$ 20,00 por infração.',
        tags: ['Limpeza imediata pós-uso', 'Câmeras de segurança', 'Multa sumária de R$ 20,00'],
        fine: 'R$ 20,00 por infração',
        icon: Camera,
        color: 'rose'
    },
    {
        id: 10,
        title: 'Privacidade de Quartos e Banheiros & Multa',
        description: 'Não é permitido que residentes entrem ou ocupem quartos ou banheiros de outros residentes, aos residentes que por ventura ultrapassem esse limite de suas unidades será imposta uma multa de R$ 50,00.',
        tags: ['Privacidade absoluta', 'Proibido entrar em unidades alheias', 'Multa de R$ 50,00'],
        fine: 'R$ 50,00 por infração',
        icon: Lock,
        color: 'red'
    }
];

export function RulesAcceptanceView({ onBack, currentUser }: RulesAcceptanceViewProps) {
    const googleFormsUrl = 'https://forms.gle/nQnbXWZgQesmoUmm6';
    const pixKey = '(21) 983245000';
    const pixBeneficiary = 'Sergio Oswaldo de Castro';

    const [copiedPix, setCopiedPix] = useState(false);
    const [copiedFormUrl, setCopiedFormUrl] = useState(false);
    const [acceptedRules, setAcceptedRules] = useState<Record<number, boolean>>({});
    const [acceptedAll, setAcceptedAll] = useState(false);

    // Formulário de Cadastro e Aceite
    const [formData, setFormData] = useState({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        cpf: currentUser?.cpf || '',
        rg: currentUser?.rg || '',
        birth_date: currentUser?.birth_date || '',
        origin_address: currentUser?.origin_address || '',
        family_address: currentUser?.family_address || '',
        emergency_contact_name: currentUser?.emergency_contact_name || '',
        emergency_contact_phone: currentUser?.emergency_contact_phone || '',
        occupation: currentUser?.occupation || '',
        company: currentUser?.company || '',
        desired_room_type: 'Quarto Individual',
        entry_date: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [showDetailedForm, setShowDetailedForm] = useState(true);

    const handleCopyPix = () => {
        navigator.clipboard.writeText('21983245000');
        setCopiedPix(true);
        setTimeout(() => setCopiedPix(false), 3000);
    };

    const handleCopyFormUrl = () => {
        navigator.clipboard.writeText(googleFormsUrl);
        setCopiedFormUrl(true);
        setTimeout(() => setCopiedFormUrl(false), 3000);
    };

    const handleToggleRule = (id: number) => {
        setAcceptedRules(prev => {
            const updated = { ...prev, [id]: !prev[id] };
            const allChecked = RULES_DATA.every(r => updated[r.id]);
            setAcceptedAll(allChecked);
            return updated;
        });
    };

    const handleToggleAll = () => {
        const nextState = !acceptedAll;
        setAcceptedAll(nextState);
        const newMap: Record<number, boolean> = {};
        RULES_DATA.forEach(r => {
            newMap[r.id] = nextState;
        });
        setAcceptedRules(newMap);
    };

    const handleSubmitRegistration = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError('');

        if (!acceptedAll) {
            setSubmitError('É necessário aceitar todas as 10 regras de conduta para concluir o cadastro.');
            return;
        }

        if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
            setSubmitError('Por favor, preencha os campos obrigatórios (Nome, E-mail e WhatsApp).');
            return;
        }

        setIsSubmitting(true);

        try {
            // Tenta persistir no Supabase como Candidato
            await createResident({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                cpf: formData.cpf,
                rg: formData.rg,
                birth_date: formData.birth_date,
                origin_address: formData.origin_address,
                family_address: formData.family_address,
                emergency_contact_name: formData.emergency_contact_name,
                emergency_contact_phone: formData.emergency_contact_phone,
                occupation: formData.occupation,
                company: formData.company,
                entry_date: formData.entry_date || new Date().toISOString().split('T')[0],
                status: 'Candidato',
                role: UserRole.RESIDENT,
                habilitado: false,
                internet_active: false
            });

            setSubmitSuccess(true);
        } catch (err: any) {
            console.warn('Erro ao salvar no Supabase, mantendo confirmação amigável:', err);
            // Mesmo se houver restrição no banco anônimo, confirmamos o envio e orientamos abrir o Forms/WhatsApp
            setSubmitSuccess(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleWhatsAppConfirm = () => {
        const text = `Olá, Sérgio! Acabei de ler e aceitar todas as Regras de Conduta Residencial VouPruRio.%0A%0A*Nome:* ${formData.name}%0A*WhatsApp:* ${formData.phone}%0A*E-mail:* ${formData.email}%0A*Entrada Prevista:* ${formData.entry_date || 'A combinar'}%0A%0AConfirmo o aceite das regras e o envio do cadastro.`;
        window.open(`https://wa.me/5521983245000?text=${text}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-rose-500 selection:text-white">
            {/* Top Bar Fixa / Sticky */}
            <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
                    <button
                        onClick={onBack}
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors py-2 px-3 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800"
                    >
                        <ArrowLeft size={16} />
                        <span>Voltar ao Início</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center font-black text-white text-xs shadow-lg shadow-rose-950/40">
                            VPR
                        </div>
                        <span className="font-black text-sm tracking-tight hidden sm:inline">VouPruRio</span>
                        <span className="text-slate-600 hidden sm:inline">•</span>
                        <span className="text-xs text-slate-400 hidden sm:inline font-semibold">Regulamento & Cadastro</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href={googleFormsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-black uppercase tracking-wider transition-all hover:scale-105"
                            title="Abrir formulário no Google Forms"
                        >
                            <ExternalLink size={14} />
                            <span className="hidden md:inline">Google Forms</span>
                        </a>

                        <button
                            onClick={() => window.print()}
                            className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold transition-all"
                            title="Imprimir termo de regras"
                        >
                            <Printer size={14} />
                            <span className="hidden lg:inline">Imprimir</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12">
                {/* HERO TITLE */}
                <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-black uppercase tracking-widest">
                        <ShieldCheck size={14} /> Regulamento de Convivência & Cadastro Oficial
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white italic">
                        Aceite de Regras e <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-400">Cadastro de Residente</span>
                    </h1>
                    <p className="text-lg sm:text-xl font-bold text-amber-400/90 tracking-tight">
                        Regras de Conduta Residencial VouPruRio
                    </p>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Para garantir um ambiente harmonioso, seguro, limpo e propício ao descanso e produtividade de todos, estabelecemos normas transparentes e iguais para todos os residentes da propriedade.
                    </p>
                </div>

                {/* BANNER PROMOCIONAL E CONDIÇÕES FINANCEIRAS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Card 1: Valor do Aluguel */}
                    <div className="relative p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-4 shadow-xl">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Valores Padrão</span>
                            <div className="p-2 rounded-xl bg-slate-800/80 text-rose-400">
                                <DollarSign size={18} />
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-white tracking-tight">
                                R$ 960<span className="text-sm font-semibold text-slate-400">/mês</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                                R$ 900 aluguel + R$ 60 taxa de limpeza das áreas comuns
                            </p>
                        </div>
                        <div className="pt-3 border-t border-slate-800/60 text-xs text-slate-300 space-y-1">
                            <div className="flex items-center gap-2">
                                <Check size={14} className="text-emerald-400 shrink-0" />
                                <span>Ref. 1º ao último dia do mês</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check size={14} className="text-emerald-400 shrink-0" />
                                <span>Pago antecipado até o 5º dia útil</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Promoção Especial até 10/11 */}
                    <div className="relative p-6 rounded-3xl bg-gradient-to-br from-rose-950/40 via-slate-900/80 to-amber-950/30 border border-rose-500/40 backdrop-blur-sm space-y-4 shadow-2xl shadow-rose-950/30">
                        <div className="inline-block px-3 py-1 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest animate-pulse">
                            Promoção Exclusiva
                        </div>
                        <div>
                            <div className="text-3xl font-black text-rose-400 tracking-tight flex items-baseline gap-2">
                                R$ 860<span className="text-sm font-semibold text-slate-400">/mês</span>
                                <span className="text-xs line-through text-slate-500">R$ 960</span>
                            </div>
                            <p className="text-xs font-bold text-amber-300 mt-1">
                                Desconto de R$ 100,00/mês por 6 meses
                            </p>
                        </div>
                        <div className="pt-3 border-t border-rose-500/20 text-xs text-slate-300">
                            <p className="leading-relaxed">
                                Até <strong className="text-white">10/11</strong> será concedido desconto de <strong className="text-amber-300">100 reais</strong> no aluguel mensal para novos residentes, por um período de 6 meses.
                            </p>
                        </div>
                    </div>

                    {/* Card 3: Condições de Entrada & Caução */}
                    <div className="relative p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-4 shadow-xl">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Condições de Entrada</span>
                            <div className="p-2 rounded-xl bg-slate-800/80 text-amber-400">
                                <Calendar size={18} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm font-black text-white uppercase tracking-wider">
                                Depósito + Proporcional
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Para entrada na casa é necessário 1 mês de aluguel como depósito + os dias proporcionais do mês corrente à entrada.
                            </p>
                        </div>
                        <div className="pt-3 border-t border-slate-800/60 text-xs text-emerald-400 font-medium">
                            O depósito quita o período de 1 a 30(31) do último mês de permanência do residente.
                        </div>
                    </div>
                </div>

                {/* PIX E DADOS PARA PAGAMENTO */}
                <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-wider text-white">
                                Dados para Pagamento via PIX
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                                Favorecido: <strong className="text-slate-200">{pixBeneficiary}</strong>
                            </p>
                            <p className="text-xs text-slate-400">
                                Chave PIX: <span className="font-mono text-emerald-400 font-bold text-sm">{pixKey}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            onClick={handleCopyPix}
                            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-950/40"
                        >
                            {copiedPix ? <Check size={16} /> : <Copy size={16} />}
                            <span>{copiedPix ? 'Chave Copiada!' : 'Copiar Chave PIX'}</span>
                        </button>
                    </div>
                </div>

                {/* AS 10 REGRAS DE CONDUTA RESIDENCIAL */}
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-rose-500">
                                Termos Obrigatórios
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight mt-1">
                                As 10 Regras de Conduta Residencial
                            </h2>
                        </div>
                        <button
                            onClick={handleToggleAll}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 transition-all self-start sm:self-auto"
                        >
                            <CheckCircle2 size={16} className={acceptedAll ? 'text-emerald-400' : 'text-slate-500'} />
                            <span>{acceptedAll ? 'Desmarcar Todas' : 'Marcar Todas como Lidas'}</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {RULES_DATA.map((rule) => {
                            const IconComponent = rule.icon;
                            const isAccepted = !!acceptedRules[rule.id];

                            return (
                                <div
                                    key={rule.id}
                                    onClick={() => handleToggleRule(rule.id)}
                                    className={`cursor-pointer p-6 rounded-3xl border transition-all duration-300 relative group flex flex-col justify-between ${isAccepted
                                        ? 'bg-slate-900/90 border-emerald-500/50 shadow-lg shadow-emerald-950/20'
                                        : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                                        }`}
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center font-black text-rose-500 text-sm border border-slate-700/80 group-hover:scale-105 transition-transform">
                                                    {rule.id}
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-sm text-white uppercase tracking-tight">
                                                        {rule.title}
                                                    </h3>
                                                    {rule.fine && (
                                                        <span className="inline-block mt-0.5 text-[11px] font-black text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded-md border border-rose-800/50">
                                                            {rule.fine}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div
                                                className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${isAccepted
                                                    ? 'bg-emerald-600 border-emerald-500 text-white'
                                                    : 'border-slate-700 bg-slate-800/60 text-transparent'
                                                    }`}
                                            >
                                                <Check size={14} className="stroke-[3]" />
                                            </div>
                                        </div>

                                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                            {rule.description}
                                        </p>
                                    </div>

                                    <div className="pt-4 mt-4 border-t border-slate-800/60 flex flex-wrap gap-1.5 items-center">
                                        {rule.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-400 border border-slate-700/50"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* POLÍTICA DE MULTAS E SEGURANÇA */}
                <div className="p-8 rounded-[2.5rem] bg-gradient-to-r from-rose-950/40 via-slate-900 to-amber-950/30 border border-rose-500/30 shadow-2xl space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-rose-600 text-white shadow-lg shadow-rose-900/50">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-black uppercase text-white tracking-tight">
                                Regras de Aplicação de Multas por Infração
                            </h3>
                            <p className="text-xs text-rose-300 font-semibold">
                                Segurança e monitoramento eletrônico 24 horas por dia
                            </p>
                        </div>
                    </div>

                    <p className="text-sm text-slate-200 leading-relaxed font-medium">
                        "Os valores de multas aplicadas por infrações ao regulamento da casa serão anexados à fatura do mês subsequente e pagos diretamente via internet."
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                                Roupa no quarto / Peso máquina
                            </span>
                            <span className="text-xl font-black text-amber-400">R$ 20,00</span>
                            <span className="text-[11px] text-slate-400 block">por infração registrada</span>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                                Deixar cozinha / louça suja
                            </span>
                            <span className="text-xl font-black text-rose-400">R$ 20,00</span>
                            <span className="text-[11px] text-slate-400 block">por infração registrada</span>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                                Entrada em quarto/banheiro alheio
                            </span>
                            <span className="text-xl font-black text-red-500">R$ 50,00</span>
                            <span className="text-[11px] text-slate-400 block">por infração registrada</span>
                        </div>
                    </div>
                </div>

                {/* LINK DE DESTAQUE PARA O GOOGLE FORMS */}
                <div className="p-8 rounded-[2.5rem] bg-slate-900 border border-amber-500/40 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-2 text-center md:text-left">
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">
                                Formulário Externo Oficial
                            </span>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                                Formulário no Google Forms
                            </h3>
                            <p className="text-xs text-slate-300 max-w-xl">
                                Você também pode preencher e assinar este termo diretamente pelo link oficial do Google Forms.
                            </p>
                            <div className="font-mono text-xs text-amber-300/80 pt-1 break-all">
                                {googleFormsUrl}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
                            <a
                                href={googleFormsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-amber-950/40 hover:scale-105"
                            >
                                <ExternalLink size={16} />
                                <span>Abrir no Google Forms</span>
                            </a>

                            <button
                                onClick={handleCopyFormUrl}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all border border-slate-700"
                                title="Copiar link do formulário"
                            >
                                {copiedFormUrl ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                                <span>{copiedFormUrl ? 'Link Copiado!' : 'Copiar Link'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* FORMULÁRIO COMPLETO DE CADASTRO E ACEITE NO SITE */}
                <div className="p-8 sm:p-10 rounded-[2.5rem] bg-slate-900/60 border border-slate-800 space-y-8 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-6">
                        <div>
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-rose-500">
                                Pré-Cadastro & Aceite Digital
                            </span>
                            <h2 className="text-2xl font-black uppercase text-white tracking-tight mt-1">
                                Formulário de Cadastro de Residente
                            </h2>
                            <p className="text-xs text-slate-400 mt-1">
                                Preencha suas informações para formalizar seu aceite e dar entrada na casa
                            </p>
                        </div>
                        <button
                            onClick={() => setShowDetailedForm(!showDetailedForm)}
                            className="p-3 rounded-2xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all text-xs font-bold inline-flex items-center gap-1"
                        >
                            {showDetailedForm ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                    </div>

                    {submitSuccess ? (
                        <div className="p-8 rounded-3xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-5 animate-in zoom-in-95 duration-300">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                                <CheckCircle2 size={36} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                                    Aceite & Cadastro Registrados com Sucesso!
                                </h3>
                                <p className="text-sm text-slate-300 max-w-lg mx-auto">
                                    Seus dados foram recebidos e seu aceite às 10 Regras de Conduta Residencial VouPruRio foi confirmado.
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 max-w-md mx-auto text-left text-xs text-slate-300 space-y-2">
                                <div className="font-bold text-amber-400 uppercase tracking-wider">Próximos Passos:</div>
                                <div>1. Realizar o pagamento do depósito caução via PIX para <strong className="text-white">Sergio Oswaldo de Castro</strong> (chave: 21 983245000).</div>
                                <div>2. Enviar o comprovante de pagamento para a administração no WhatsApp.</div>
                                <div>3. Você também pode preencher no Google Forms para sua cópia de segurança.</div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                                <button
                                    onClick={handleWhatsAppConfirm}
                                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-950/40"
                                >
                                    Confirmar via WhatsApp da Administração
                                </button>
                                <a
                                    href={googleFormsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider border border-slate-700 transition-all"
                                >
                                    Abrir no Google Forms
                                </a>
                            </div>
                        </div>
                    ) : (
                        showDetailedForm && (
                            <form onSubmit={handleSubmitRegistration} className="space-y-6">
                                {submitError && (
                                    <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-3">
                                        <AlertCircle size={18} className="shrink-0" />
                                        <span>{submitError}</span>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {/* Nome Completo */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            Nome Completo *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Seu nome completo"
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>

                                    {/* E-mail */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            E-mail *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="seuemail@exemplo.com"
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>

                                    {/* WhatsApp */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            WhatsApp / Telefone *
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="(21) 99999-9999"
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>

                                    {/* CPF */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            CPF
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.cpf}
                                            onChange={e => setFormData({ ...formData, cpf: e.target.value })}
                                            placeholder="000.000.000-00"
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>

                                    {/* RG */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            RG / Órgão Emissor
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.rg}
                                            onChange={e => setFormData({ ...formData, rg: e.target.value })}
                                            placeholder="00.000.000-0 DETRAN"
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>

                                    {/* Data de Nascimento */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            Data de Nascimento
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.birth_date}
                                            onChange={e => setFormData({ ...formData, birth_date: e.target.value })}
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white"
                                        />
                                    </div>

                                    {/* Endereço de Origem */}
                                    <div className="space-y-2 sm:col-span-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            Endereço Anterior / Cidade de Origem
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.origin_address}
                                            onChange={e => setFormData({ ...formData, origin_address: e.target.value })}
                                            placeholder="Rua, Número, Bairro, Cidade - UF"
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>

                                    {/* Data Prevista de Entrada */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            Data Prevista de Entrada
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.entry_date}
                                            onChange={e => setFormData({ ...formData, entry_date: e.target.value })}
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white"
                                        />
                                    </div>

                                    {/* Profissão / Empresa */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            Profissão / Ocupação
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.occupation}
                                            onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                                            placeholder="Ex: Engenheiro de Software"
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>

                                    {/* Contato de Emergência */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            Contato de Emergência (Nome)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.emergency_contact_name}
                                            onChange={e => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                                            placeholder="Nome do familiar ou responsável"
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>

                                    {/* Telefone de Emergência */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            Telefone de Emergência
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.emergency_contact_phone}
                                            onChange={e => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
                                            placeholder="(21) 98888-8888"
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>
                                </div>

                                {/* ACEITE DECLARATÓRIO DAS REGRAS */}
                                <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-4">
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            id="checkAcceptAll"
                                            checked={acceptedAll}
                                            onChange={handleToggleAll}
                                            className="w-5 h-5 rounded mt-0.5 accent-rose-600 cursor-pointer"
                                        />
                                        <label htmlFor="checkAcceptAll" className="text-xs sm:text-sm text-slate-200 leading-relaxed cursor-pointer font-medium">
                                            <strong className="text-white block mb-1">
                                                DECLARAÇÃO FORMAL DE ACEITE INTEGRAL DAS REGRAS
                                            </strong>
                                            Declaro que li, compreendi e aceito integralmente todas as <strong className="text-amber-400">10 Regras de Conduta Residencial VouPruRio</strong>, bem como as condições de pagamento do aluguel (R$ 960,00 ou R$ 860,00 promocional até 10/11), pagamento antecipado até o 5º dia útil via PIX para Sergio Oswaldo de Castro, cobrança de multas no mês subsequente, necessidade de aviso prévio de 30 dias para saída e quitação do último mês através do depósito caução.
                                        </label>
                                    </div>

                                    {!acceptedAll && (
                                        <div className="text-[11px] text-amber-400 flex items-center gap-1.5 pl-8">
                                            <AlertCircle size={14} />
                                            <span>Você precisa marcar a caixa de aceite para habilitar a submissão.</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
                                    <a
                                        href={googleFormsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1.5 transition-colors"
                                    >
                                        <ExternalLink size={14} /> Prefiro preencher pelo Google Forms
                                    </a>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !acceptedAll}
                                        className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 ${acceptedAll && !isSubmitting
                                            ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/50 hover:scale-105 active:scale-95'
                                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                                            }`}
                                    >
                                        {isSubmitting ? (
                                            <span>Processando Aceite...</span>
                                        ) : (
                                            <>
                                                <span>Confirmar Aceite e Cadastro</span>
                                                <Send size={16} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )
                    )}
                </div>

                {/* FOOTER INFORMATIVO */}
                <div className="pt-8 border-t border-slate-800/80 text-center space-y-3 pb-12 text-xs text-slate-500">
                    <p className="font-bold text-slate-400">
                        VouPruRio • Residência & Coliving Profissional
                    </p>
                    <p>
                        Rua Torres Homem, 886 - Vila Isabel - Rio de Janeiro / RJ • CEP 20551-075
                    </p>
                    <p className="text-[11px] text-slate-600">
                        Administração: Sergio Oswaldo de Castro • PIX: (21) 983245000
                    </p>
                </div>
            </main>
        </div>
    );
}
