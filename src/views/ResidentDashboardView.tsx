import React, { useState } from 'react';
import {
    Home, Wifi, Droplets, CreditCard, Wrench, Shield, CheckCircle2,
    AlertCircle, Copy, Check, ExternalLink, Calendar, Clock, Users,
    ArrowRight, MessageCircle, AlertTriangle, Coffee, Sparkles,
    BookOpen, FileText, Send, X, Plus, PhoneCall, Shirt, Eye
} from 'lucide-react';
import {
    Resident, Room, Payment, MaintenanceRequest, LaundrySchedule,
    Notice, PaymentStatus, MaintenanceStatus, RoomType
} from '../types';
import { createMaintenanceRequest } from '../lib/database';

interface ResidentDashboardViewProps {
    currentUser: Resident;
    payments: Payment[];
    maintenance: MaintenanceRequest[];
    laundrySchedules: LaundrySchedule[];
    rooms: Room[];
    notices: Notice[];
    setActiveTab: (tab: string) => void;
    onRefresh?: () => void;
    onOpenRules?: () => void;
}

export function ResidentDashboardView({
    currentUser,
    payments,
    maintenance,
    laundrySchedules,
    rooms,
    notices,
    setActiveTab,
    onRefresh,
    onOpenRules
}: ResidentDashboardViewProps) {
    const pixKeyFormatted = '(21) 983245000';
    const pixRaw = '21983245000';
    const pixBeneficiary = 'Sergio Oswaldo de Castro';

    const [copiedPix, setCopiedPix] = useState(false);

    // Modais internos de ação rápida
    const [isRepairModalOpen, setIsRepairModalOpen] = useState(false);
    const [repairTitle, setRepairTitle] = useState('');
    const [repairDesc, setRepairDesc] = useState('');
    const [repairRoomId, setRepairRoomId] = useState(currentUser.room_id || '');
    const [isSubmittingRepair, setIsSubmittingRepair] = useState(false);
    const [repairSuccessMsg, setRepairSuccessMsg] = useState('');

    const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
    const [visitorName, setVisitorName] = useState('');
    const [visitorDoc, setVisitorDoc] = useState('');
    const [visitorPhone, setVisitorPhone] = useState('');
    const [visitorRelationship, setVisitorRelationship] = useState('Familiar');
    const [visitorOvernight, setVisitorOvernight] = useState(false);
    const [visitorProtocol, setVisitorProtocol] = useState('');
    const [visitorSuccess, setVisitorSuccess] = useState(false);

    // 1. Quarto do morador
    const myRoom = rooms.find(r => r.id === currentUser.room_id);

    // 2. Pagamento do morador (mês corrente ou mais recente)
    const myPayments = payments.filter(p => p.resident_id === currentUser.id);
    const pendingPayment = myPayments.find(p => p.status === PaymentStatus.PENDING || p.status === PaymentStatus.OVERDUE);
    const lastPaidPayment = myPayments.find(p => p.status === PaymentStatus.PAID);

    // Valor padrão do aluguel
    const monthlyTotal = (currentUser.rent_value || 900) + (currentUser.cleaning_fee || 60);

    // 3. Manutenções do morador (do seu quarto ou solicitadas por ele)
    const myMaintenance = maintenance.filter(m =>
        (currentUser.room_id && m.room_id === currentUser.room_id) ||
        m.requested_by === currentUser.id
    );
    const openRepairs = myMaintenance.filter(m => m.status !== MaintenanceStatus.RESOLVED);

    // 4. Lavanderia do morador
    const mySchedules = laundrySchedules.filter(l => l.resident_id === currentUser.id);
    const today = new Date().toISOString().split('T')[0];
    const nextLaundry = mySchedules
        .filter(l => l.date >= today && l.status !== 'Cancelado')
        .sort((a, b) => a.date.localeCompare(b.date))[0];

    // 5. Avisos recentes da casa
    const recentNotices = notices.slice(0, 3);

    const handleCopyPix = () => {
        navigator.clipboard.writeText(pixRaw);
        setCopiedPix(true);
        setTimeout(() => setCopiedPix(false), 3000);
    };

    const handleWhatsAppPayment = () => {
        const text = encodeURIComponent(
            `Olá, Sérgio! Segue meu comprovante de pagamento do aluguel da MoronaVila.%0A%0A*Morador(a):* ${currentUser.name}%0A*Quarto:* ${myRoom?.name || 'Não informado'}%0A*Valor:* R$ ${monthlyTotal.toFixed(2)}`
        );
        window.open(`https://wa.me/5521983245000?text=${text}`, '_blank');
    };

    const handleCreateRepair = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!repairTitle.trim() || !repairDesc.trim()) return;

        setIsSubmittingRepair(true);
        try {
            await createMaintenanceRequest({
                title: repairTitle.trim(),
                description: repairDesc.trim(),
                room_id: repairRoomId || currentUser.room_id || rooms[0]?.id || '',
                requested_by: currentUser.id,
                status: MaintenanceStatus.OPEN
            });

            setRepairSuccessMsg('Solicitação de reparo enviada para a administração!');
            setRepairTitle('');
            setRepairDesc('');
            if (onRefresh) onRefresh();
            setTimeout(() => {
                setRepairSuccessMsg('');
                setIsRepairModalOpen(false);
            }, 2500);
        } catch (err: any) {
            alert(`Erro ao solicitar reparo: ${err.message}`);
        } finally {
            setIsSubmittingRepair(false);
        }
    };

    const handleVisitorSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!visitorName.trim() || !visitorDoc.trim() || !visitorPhone.trim()) {
            alert('Preencha os campos obrigatórios do visitante.');
            return;
        }

        const protocol = `VPR-VIS-${Math.floor(1000 + Math.random() * 9000)}`;
        setVisitorProtocol(protocol);
        setVisitorSuccess(true);
    };

    const handleSendVisitorWhatsApp = () => {
        const text = encodeURIComponent(
            `*AUTORIZAÇÃO DE VISITA - MORONAVILA*%0A` +
            `*Protocolo:* ${visitorProtocol}%0A` +
            `*Morador:* ${currentUser.name} (${myRoom?.name || 'Quarto'} - Ramal ${currentUser.softphone_extension || 'S/N'})%0A` +
            `*Visitante:* ${visitorName}%0A` +
            `*Documento:* ${visitorDoc}%0A` +
            `*WhatsApp:* ${visitorPhone}%0A` +
            `*Parentesco/Relação:* ${visitorRelationship}%0A` +
            `*Pernoite:* ${visitorOvernight ? 'Sim (máx. 2 noites)' : 'Não'}%0A%0A` +
            `_Declaro que o visitante entrará via interfone sob minha responsabilidade e cumprirá as 12 regras da casa (silêncio, sem fumo/álcool, sem crianças/pets)._`
        );
        window.open(`https://wa.me/5521983245000?text=${text}`, '_blank');
    };

    const formatDateBR = (dateStr?: string) => {
        if (!dateStr) return '';
        try {
            const parts = dateStr.split('-');
            if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
            return new Date(dateStr).toLocaleDateString('pt-BR');
        } catch {
            return dateStr;
        }
    };

    const firstName = currentUser.name.split(' ')[0] || 'Morador';

    return (
        <div className="space-y-8 animate-in fade-in duration-300 pb-12">
            {/* 1. HEADER DO MORADOR: BOAS-VINDAS & STATUS PESSOAL */}
            <div className="relative rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8 border border-slate-800 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start sm:items-center gap-4 sm:gap-5">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center font-black text-2xl sm:text-3xl shrink-0 shadow-lg shadow-rose-950/40 border-2 border-white/10">
                            {currentUser.photo_url ? (
                                <img src={currentUser.photo_url} alt={currentUser.name} className="w-full h-full object-cover" />
                            ) : (
                                firstName.charAt(0)
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/30">
                                    Painel do Residente
                                </span>
                                {currentUser.habilitado !== false ? (
                                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                        <CheckCircle2 size={11} /> Acesso Liberado
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                                        <AlertTriangle size={11} /> Acesso Bloqueado
                                    </span>
                                )}
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                Olá, <span className="text-rose-500">{firstName}</span>!
                            </h1>

                            <p className="text-xs text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                                <span>Acomodação: <strong className="text-slate-200">{myRoom ? myRoom.name : 'Quarto a Definir'}</strong></span>
                                {currentUser.bed_identifier && (
                                    <span>• Cama: <strong className="text-slate-200">{currentUser.bed_identifier}</strong></span>
                                )}
                                <span>• Ramal: <strong className="text-amber-400">{currentUser.softphone_extension || 'Em configuração'}</strong></span>
                            </p>
                        </div>
                    </div>

                    {/* Botão de contato rápido com o Administrador */}
                    <div className="flex items-center gap-3 self-start md:self-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-800">
                        <a
                            href="https://wa.me/5521983245000?text=Ol%C3%A1%2C%20S%C3%A9rgio!%20Sou%20residente%20da%20MoronaVila."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-emerald-600 text-slate-200 hover:text-white border border-slate-700 hover:border-emerald-500 text-xs font-bold transition-all shadow-md group cursor-pointer"
                        >
                            <MessageCircle size={16} className="text-emerald-400 group-hover:text-white transition-colors" />
                            <span>Falar com Administração</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* 2. CARD PRINCIPAL FINANCEIRO: MEU ALUGUEL DO MÊS */}
            <div className={`p-6 sm:p-8 rounded-[2.5rem] border relative overflow-hidden shadow-2xl transition-all ${pendingPayment
                ? 'bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 border-rose-500/40'
                : 'bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-900 border-emerald-500/40'
                }`}>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${pendingPayment ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                <CreditCard size={18} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                                Mensalidade & Aluguel
                            </span>
                            {pendingPayment ? (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                    Aguardando Pagamento
                                </span>
                            ) : (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                    Em Dia
                                </span>
                            )}
                        </div>

                        <div>
                            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                                R$ {pendingPayment ? pendingPayment.amount.toFixed(2) : monthlyTotal.toFixed(2)}
                            </div>
                            <p className="text-xs text-slate-300 mt-1">
                                {pendingPayment
                                    ? `Vencimento antecipado até o 5º dia útil (${formatDateBR(pendingPayment.due_date) || 'Vencimento próximo'})`
                                    : lastPaidPayment
                                        ? `Último pagamento confirmado em ${formatDateBR(lastPaidPayment.payment_date || lastPaidPayment.due_date)}. Muito obrigado!`
                                        : 'Seu aluguel cobre do 1º ao último dia do mês e é pago antecipado até o 5º dia útil.'}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-1">
                            <span>Chave PIX: <strong className="text-white">{pixKeyFormatted}</strong></span>
                            <span>• Favorecido: <strong className="text-slate-300">{pixBeneficiary}</strong></span>
                        </div>
                    </div>

                    {/* Ações do Aluguel */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                        <button
                            onClick={handleCopyPix}
                            className="px-5 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 cursor-pointer"
                        >
                            {copiedPix ? <Check size={16} /> : <Copy size={16} />}
                            <span>{copiedPix ? 'Chave Copiada!' : 'Copiar Chave PIX'}</span>
                        </button>

                        <button
                            onClick={handleWhatsAppPayment}
                            className="px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 cursor-pointer"
                        >
                            <Send size={15} />
                            <span>Enviar Comprovante</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('payments')}
                            className="px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
                            title="Histórico Completo de Pagamentos"
                        >
                            <Eye size={15} />
                            <span>Ver Histórico</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. ATALHOS RÁPIDOS DE CONVIVÊNCIA (GRID DE 4 PILARES) */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-rose-500">
                            Ações Cotidianas
                        </span>
                        <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight mt-0.5">
                            Serviços & Convivência
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Card 1: Lavanderia */}
                    <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 group">
                        <div className="space-y-2">
                            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                                <Shirt size={20} />
                            </div>
                            <h3 className="font-bold text-white text-base">Lavanderia</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                {nextLaundry
                                    ? `Agendado p/ ${formatDateBR(nextLaundry.date)} às ${nextLaundry.start_time}`
                                    : 'Limitado a 1 vez por semana, sem exceder o peso da máquina.'}
                            </p>
                        </div>
                        <button
                            onClick={() => setActiveTab('laundry')}
                            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                            <Calendar size={14} />
                            <span>{nextLaundry ? 'Ver Meu Horário' : 'Agendar Horário'}</span>
                        </button>
                    </div>

                    {/* Card 2: Cadastro de Visitas */}
                    <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 group">
                        <div className="space-y-2">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                                <Users size={20} />
                            </div>
                            <h3 className="font-bold text-white text-base">Visitas Autorizadas</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Máx. 2 dias por semana (familiares ou cadastrados). Entrada pelo interfone.
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setVisitorSuccess(false);
                                setIsVisitorModalOpen(true);
                            }}
                            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                            <Plus size={14} />
                            <span>Autorizar Visitante</span>
                        </button>
                    </div>

                    {/* Card 3: Solicitar Reparo / Ajuda */}
                    <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 group">
                        <div className="space-y-2">
                            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                                <Wrench size={20} />
                            </div>
                            <h3 className="font-bold text-white text-base">Reparos & Suporte</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                {openRepairs.length > 0
                                    ? `${openRepairs.length} solicitação em andamento no seu quarto`
                                    : 'Lâmpada, chuveiro, fechadura ou melhorias na residência.'}
                            </p>
                        </div>
                        <button
                            onClick={() => setIsRepairModalOpen(true)}
                            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-amber-600 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                            <Plus size={14} />
                            <span>Solicitar Reparo</span>
                        </button>
                    </div>

                    {/* Card 4: As 12 Regras & Tabela de Multas */}
                    <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 group">
                        <div className="space-y-2">
                            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                                <BookOpen size={20} />
                            </div>
                            <h3 className="font-bold text-white text-base">Regras & Multas</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Silêncio 24h, cozinha limpa, proibição de fumo/álcool e zelo geral.
                            </p>
                        </div>
                        <button
                            onClick={onOpenRules ? onOpenRules : () => { window.location.hash = '#regras'; }}
                            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                            <FileText size={14} />
                            <span>Consultar 12 Regras</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 4. MEU ESPAÇO & INFRAESTRUTURA PESSOAL */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Minha Conexão Wi-Fi */}
                <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                                <Wifi size={16} />
                            </div>
                            <h4 className="font-bold text-white text-sm">Internet Wi-Fi da Casa</h4>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${currentUser.internet_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                            {currentUser.internet_active ? 'Conectado' : 'Aguardando MAC'}
                        </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                        Internet de alta velocidade liberada para seus dispositivos cadastrados.
                    </p>

                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs space-y-1 text-slate-300">
                        <div>MAC Celular: <strong className="text-white">{currentUser.mac_address || 'Não cadastrado'}</strong></div>
                        {currentUser.mac_address_pc && (
                            <div>MAC Notebook: <strong className="text-white">{currentUser.mac_address_pc}</strong></div>
                        )}
                    </div>
                </div>

                {/* Interfone da Unidade */}
                <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                                <PhoneCall size={16} />
                            </div>
                            <h4 className="font-bold text-white text-sm">Interfone & Entregas</h4>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-500/10 text-purple-400">
                            Ramal {currentUser.softphone_extension || '—'}
                        </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                        Coloque o número da sua unidade nas compras online. O interfone toca no celular para receber entregadores no portão.
                    </p>

                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
                        Status: <strong className="text-emerald-400">Habilitado para atender no celular</strong>
                    </div>
                </div>

                {/* Cozinha & Armário Individual */}
                <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                                <Coffee size={16} />
                            </div>
                            <h4 className="font-bold text-white text-sm">Cozinha Compartilhada</h4>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-cyan-500/10 text-cyan-400">
                            Armário Individual
                        </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                        Guarde seus pertences no seu armário individual. Louças deixadas fora são recolhidas (multa de R$ 10,00). Limpe tudo imediatamente após o uso.
                    </p>

                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
                        Câmeras 24h ativas para segurança de todos os residentes.
                    </div>
                </div>
            </div>

            {/* 5. MURAL DE AVISOS DA CASA */}
            <div className="p-6 sm:p-8 rounded-[2.5rem] bg-slate-900/60 border border-slate-800 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-rose-500">
                            Comunidade MoronaVila
                        </span>
                        <h3 className="text-xl font-black uppercase text-white tracking-tight mt-0.5">
                            Mural de Avisos da Casa
                        </h3>
                    </div>
                    <button
                        onClick={() => setActiveTab('notices')}
                        className="text-xs text-rose-400 hover:text-rose-300 font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                    >
                        <span>Ver Todos</span>
                        <ArrowRight size={14} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recentNotices.length > 0 ? (
                        recentNotices.map(notice => (
                            <div
                                key={notice.id}
                                className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2.5 flex flex-col justify-between"
                            >
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${notice.category === 'Importante'
                                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                            : notice.category === 'Regra'
                                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                : 'bg-slate-800 text-slate-400'
                                            }`}>
                                            {notice.category}
                                        </span>
                                        <span className="text-[10px] text-slate-500">{formatDateBR(notice.created_at)}</span>
                                    </div>
                                    <h4 className="font-bold text-white text-sm line-clamp-1">{notice.title}</h4>
                                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{notice.content}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 py-8 text-center text-slate-500 text-xs">
                            Nenhum aviso no momento. Tudo tranquilo na residência!
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL 1: SOLICITAÇÃO RÁPIDA DE REPARO */}
            {isRepairModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsRepairModalOpen(false)}
                            className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                            <X size={18} />
                        </button>

                        <div className="space-y-1">
                            <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                                Manutenção & Suporte
                            </span>
                            <h3 className="text-xl font-black text-white">Solicitar Reparo</h3>
                            <p className="text-xs text-slate-400">
                                Conte-nos o que precisa de conserto e a administração providenciará o reparo.
                            </p>
                        </div>

                        {repairSuccessMsg ? (
                            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                                <CheckCircle2 size={18} />
                                <span>{repairSuccessMsg}</span>
                            </div>
                        ) : (
                            <form onSubmit={handleCreateRepair} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                        O que precisa de reparo? *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={repairTitle}
                                        onChange={e => setRepairTitle(e.target.value)}
                                        placeholder="Ex: Lâmpada queimada, chuveiro pingando, maçaneta"
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                        Local do Reparo
                                    </label>
                                    <select
                                        value={repairRoomId}
                                        onChange={e => setRepairRoomId(e.target.value)}
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:outline-none text-sm text-white cursor-pointer"
                                    >
                                        {myRoom && <option value={myRoom.id}>Meu Quarto ({myRoom.name})</option>}
                                        {rooms
                                            .filter(r => r.type !== RoomType.SUITE && r.type !== RoomType.STUDIO && r.type !== RoomType.APARTMENT)
                                            .map(r => (
                                                <option key={r.id} value={r.id}>{r.name} (Área Comum)</option>
                                            ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                        Detalhes do Problema *
                                    </label>
                                    <textarea
                                        rows={3}
                                        required
                                        value={repairDesc}
                                        onChange={e => setRepairDesc(e.target.value)}
                                        placeholder="Descreva quando começou e o que está ocorrendo..."
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:outline-none text-sm text-white placeholder-slate-600 resize-none"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsRepairModalOpen(false)}
                                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmittingRepair}
                                        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
                                    >
                                        {isSubmittingRepair ? 'Enviando...' : 'Enviar Solicitação'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* MODAL 2: CADASTRO RÁPIDO DE VISITA */}
            {isVisitorModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsVisitorModalOpen(false)}
                            className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                            <X size={18} />
                        </button>

                        <div className="space-y-1">
                            <span className="text-xs font-black uppercase tracking-wider text-indigo-400">
                                Portaria & Interfone
                            </span>
                            <h3 className="text-xl font-black text-white">Autorizar Visita</h3>
                            <p className="text-xs text-slate-400">
                                Por segurança, visitas apenas para familiares ou cadastrados (máx. 2 dias/semana; sem crianças ou pets).
                            </p>
                        </div>

                        {visitorSuccess ? (
                            <div className="space-y-4 text-center py-3">
                                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                                    <CheckCircle2 size={32} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-white">Visita Pré-Autorizada!</h4>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Protocolo gerado: <strong className="text-amber-400 font-mono">{visitorProtocol}</strong>
                                    </p>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs text-slate-300 space-y-1">
                                    <div>Visitante: <strong className="text-white">{visitorName}</strong> ({visitorRelationship})</div>
                                    <div>Telefone: {visitorPhone} • Doc: {visitorDoc}</div>
                                    <div>Pernoite: {visitorOvernight ? 'Sim (máx. 2 noites)' : 'Não'}</div>
                                </div>
                                <button
                                    onClick={handleSendVisitorWhatsApp}
                                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                                >
                                    <Send size={15} />
                                    <span>Enviar Autorização no WhatsApp do Sérgio</span>
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleVisitorSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                        Nome do Visitante *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={visitorName}
                                        onChange={e => setVisitorName(e.target.value)}
                                        placeholder="Nome completo do visitante"
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            CPF ou RG *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={visitorDoc}
                                            onChange={e => setVisitorDoc(e.target.value)}
                                            placeholder="000.000.000-00"
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            WhatsApp do Visitante *
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={visitorPhone}
                                            onChange={e => setVisitorPhone(e.target.value)}
                                            placeholder="(21) 99999-9999"
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            Grau de Relação *
                                        </label>
                                        <select
                                            value={visitorRelationship}
                                            onChange={e => setVisitorRelationship(e.target.value)}
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none text-sm text-white cursor-pointer"
                                        >
                                            <option value="Familiar">Familiar (Pais, Irmãos, Cônjuge)</option>
                                            <option value="Amigo(a)">Amigo(a) Próximo</option>
                                            <option value="Colega de Trabalho/Estudo">Colega de Trabalho/Estudo</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1.5 flex flex-col justify-end">
                                        <label className="flex items-center gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={visitorOvernight}
                                                onChange={e => setVisitorOvernight(e.target.checked)}
                                                className="w-4 h-4 rounded accent-indigo-600"
                                            />
                                            <span className="text-xs text-slate-300 font-medium">Haverá Pernoite (máx. 2 noites)</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsVisitorModalOpen(false)}
                                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                                    >
                                        Gerar Autorização
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
