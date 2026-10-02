import React, { useEffect, useState } from 'react';
import {
    Home, MapPin, Sparkles, Shield, ChevronRight, Play,
    ArrowRight, MessageCircle, Send, X, Sofa, Check, Info,
    Calendar, CreditCard, CheckCircle2, XCircle, HelpCircle,
    Phone, Mail, User, Clock, Star, Users, ExternalLink
} from 'lucide-react';
import { fetchPublicPropertyDescription, fetchPublicRooms, fetchRentalConditions, signUpResident } from '../lib/database';
import { getLocalApiBase } from '../lib/localApi';
import { PropertyDescription, Room, RentalConditions, Resident } from '../types';
import { InteractiveMap } from '../components/InteractiveMap';
import { AmenitiesShowcase } from '../components/AmenitiesShowcase';

interface LandingPageProps {
    onLoginClick: () => void;
    isLoggedIn?: boolean;
    currentUser?: Resident | null;
    onGoToDashboard?: () => void;
}

const DEFAULT_PROPERTY_DESC: PropertyDescription = {
    id: 'default',
    main_text: "Viver com conforto, foco e praticidade no coração da Vila Isabel\nQuartos mobiliados e climatizados, cozinha equipada, sala de estudos e tudo incluso na Rua Torres Homem, a poucos minutos de faculdades e shoppings.",
    main_media: ['/fotos/vprimage11_entrada.jpg'],
    gallery_media: [
        '/fotos/vprimage1.jpg',
        '/fotos/vprimage2.jpg',
        '/fotos/vprimage3_saladeestudos.jpg',
        '/fotos/vprimage4.jpg',
        '/fotos/vprimage5.jpg',
        '/fotos/vprimage6.jpg',
        '/fotos/vprimage7.jpg',
        '/fotos/vprimage8.jpg',
        '/fotos/vprimage9_areaexterna.jpg',
        '/fotos/vprimage10_cozinha.jpg',
        '/fotos/vprimage11_entrada.jpg'
    ],
    rooms_text: "Quartos individuais mobiliados, silenciosos e prontos para morar com todas as contas inclusas.",
    location_text: "Rua Torres Homem, 886 - Vila Isabel, Rio de Janeiro. A 300m do Shopping Boulevard e fácil acesso ao Maracanã, UERJ e Centro.",
    location_media: ['/fotos/vprimage11_entrada.jpg'],
    amenities_text: "Wi-Fi alta velocidade, ar condicionado, cozinha completa, lavanderia e área de estudos.",
    amenities_media: [],
    rules_text: "Prezamos pelo respeito mútuo, colaboração e silêncio a partir das 22h para que todos tenham um ambiente propício para estudos e descanso."
};

const DEFAULT_RENTAL_CONDITIONS: RentalConditions = {
    id: 'default',
    deposit_months: 1,
    cleaning_fee_fixed: 150,
    pro_rata_enabled: true,
    rules_summary: "O pagamento é mensal e antecipado. A reserva é confirmada mediante o pagamento do caução simples.",
    calculation_instructions: "Informe a data prevista de entrada para simular os valores do seu primeiro mês com total transparência."
};

const DEFAULT_SAMPLE_ROOMS: Room[] = [
    {
        id: 'sample-1',
        name: 'Suíte Individual Master',
        type: 'Suíte' as any,
        capacity: 1,
        rent_value: 1390,
        cleaning_fee: 150,
        extras_value: 0,
        is_common_area: false,
        is_blocked_for_repairs: false,
        availability_status: 'Disponível',
        description: 'Suíte privativa silenciosa com excelente ventilação, cama confortável, bancada de estudos ampla e armário planejado.',
        furniture: [
            { id: 'f1', name: 'Cama Box Solteiro', condition: 'Novo' },
            { id: 'f2', name: 'Guarda-Roupa Planejado', condition: 'Novo' },
            { id: 'f3', name: 'Mesa de Estudos e Cadeira Ergonômica', condition: 'Novo' },
            { id: 'f4', name: 'Ar-Condicionado Split', condition: 'Novo' }
        ],
        media: [
            { id: 'm1', url: '/fotos/98905_0gMXlxxyf06MJQMP.jpg', type: 'image' },
            { id: 'm2', url: '/fotos/98905_CYCX7spXgRfrsz7H.jpg', type: 'image' },
            { id: 'm3', url: '/fotos/98905_JRni84qYdUydS9eF.jpg', type: 'image' }
        ]
    },
    {
        id: 'sample-2',
        name: 'Quarto Individual Standard',
        type: 'Quarto' as any,
        capacity: 1,
        rent_value: 1200,
        cleaning_fee: 150,
        extras_value: 0,
        is_common_area: false,
        is_blocked_for_repairs: false,
        availability_status: 'Disponível',
        description: 'Quarto privativo aconchegante, ideal para foco em estudos e trabalho home-office, com armário, escrivaninha e colchão de alta qualidade.',
        furniture: [
            { id: 'f5', name: 'Cama Box Solteiro', condition: 'Novo' },
            { id: 'f6', name: 'Armário Planejado', condition: 'Bom' },
            { id: 'f7', name: 'Escrivaninha com Tomadas', condition: 'Novo' }
        ],
        media: [
            { id: 'm4', url: '/fotos/98905_r9U1krISShnTliUA (1).jpg', type: 'image' },
            { id: 'm5', url: '/fotos/98905_Z6otj5s5Fg0NeCYF.jpg', type: 'image' }
        ]
    },
    {
        id: 'sample-3',
        name: 'Suíte Premium Conforto',
        type: 'Suíte' as any,
        capacity: 1,
        rent_value: 1490,
        cleaning_fee: 150,
        extras_value: 0,
        is_common_area: false,
        is_blocked_for_repairs: false,
        availability_status: 'Disponível',
        description: 'Acomodação premium, arejada e iluminada, perfeita para quem busca privacidade total e ambiente propício para alta produtividade.',
        furniture: [
            { id: 'f8', name: 'Cama Box', condition: 'Novo' },
            { id: 'f9', name: 'Guarda-Roupa Grande', condition: 'Novo' },
            { id: 'f10', name: 'Mesa de Estudos e Cadeira', condition: 'Novo' },
            { id: 'f11', name: 'Ar-Condicionado', condition: 'Novo' }
        ],
        media: [
            { id: 'm6', url: '/fotos/98905_0gMXlxxyf06MJQMP.jpg', type: 'image' },
            { id: 'm7', url: '/fotos/98905_CYCX7spXgRfrsz7H.jpg', type: 'image' },
            { id: 'm8', url: '/fotos/98905_Z6otj5s5Fg0NeCYF.jpg', type: 'image' }
        ]
    }
];

export function LandingPage({ onLoginClick, isLoggedIn, currentUser, onGoToDashboard }: LandingPageProps) {
    const [propertyDesc, setPropertyDesc] = useState<PropertyDescription>(DEFAULT_PROPERTY_DESC);
    const [rentalConditions, setRentalConditions] = useState<RentalConditions>(DEFAULT_RENTAL_CONDITIONS);
    const [rooms, setRooms] = useState<Room[]>(DEFAULT_SAMPLE_ROOMS);
    const [loading, setLoading] = useState(false);
    const [leadForm, setLeadForm] = useState({ name: '', phone: '', email: '' });
    const [leadSubmitted, setLeadSubmitted] = useState(false);

    // Estados para o novo fluxo
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [registrationStep, setRegistrationStep] = useState<'simulator' | 'form' | 'success'>('simulator');
    const [entryDate, setEntryDate] = useState('');
    const [calculation, setCalculation] = useState<{ proRata: number; deposit: number; cleaning: number; total: number } | null>(null);

    const [regForm, setRegForm] = useState({
        name: '',
        cpf: '',
        rg: '',
        phone: '',
        email: '',
        origin_address: '',
        family_address: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        occupation: '',
        company: '',
        university: '',
        course: '',
        instagram: '',
        room_id: '',
        entry_date: ''
    });

    // Chat state
    const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [registrationRoom, setRegistrationRoom] = useState<Room | null>(null);
    const [faqOpen, setFaqOpen] = useState<number | null>(null);

    useEffect(() => {
        if (entryDate && rentalConditions && (selectedRoom || registrationRoom)) {
            const room = selectedRoom || registrationRoom;
            if (!room) return;

            const date = new Date(entryDate);
            const day = date.getDate();
            const year = date.getFullYear();
            const month = date.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            let proRata = room.rent_value;
            if (rentalConditions.pro_rata_enabled) {
                const daysRemaining = daysInMonth - day + 1;
                proRata = (room.rent_value / daysInMonth) * daysRemaining;
            }

            const deposit = (rentalConditions.deposit_months || 0) * room.rent_value;
            const cleaning = rentalConditions.cleaning_fee_fixed || 0;

            setCalculation({
                proRata: Math.round(proRata),
                deposit: Math.round(deposit),
                cleaning: Math.round(cleaning),
                total: Math.round(proRata + deposit + cleaning)
            });
        }
    }, [entryDate, rentalConditions, selectedRoom, registrationRoom]);

    useEffect(() => {
        const loadPublicData = async () => {
            try {
                const [desc, publicRooms, conditions] = await Promise.all([
                    fetchPublicPropertyDescription().catch(() => null),
                    fetchPublicRooms().catch(() => []),
                    fetchRentalConditions().catch(() => null)
                ]);
                if (desc) setPropertyDesc(desc);
                if (publicRooms && publicRooms.length > 0) setRooms(publicRooms);
                if (conditions) setRentalConditions(conditions);
            } catch (error) {
                console.error('Failed to load public data:', error);
            }
        };
        loadPublicData();
    }, []);

    const {
        main_text, main_media,
        rules_text
    } = propertyDesc;

    // Foto do Hero com fallback para a fachada real
    const heroMedia = main_media?.[0] || '/fotos/vprimage11_entrada.jpg';

    const textLines = main_text ? main_text.split('\n').filter(line => line.trim() !== '') : [];
    const heroTitle = textLines[0] || "Viver com conforto, foco e praticidade no coração da Vila Isabel";
    const heroSubtitle = textLines.slice(1).join('\n') || "Quartos mobiliados e climatizados, cozinha equipada, sala de estudos e tudo incluso na Rua Torres Homem, a poucos minutos de faculdades e shoppings.";

    const handleLeadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLeadSubmitted(true);
        const welcomeMessage = `Olá ${leadForm.name}! Sou o Agente Virtual da MoronaVila. Como posso te ajudar hoje? Além de tirar dúvidas comigo, você pode clicar no botão verde abaixo para falar direto com um consultor no nosso WhatsApp e agendar sua visita!`;
        setChatMessages([{ role: 'assistant', content: welcomeMessage }]);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentMessage.trim()) return;

        const newUserMessage = { role: 'user' as const, content: currentMessage };
        setChatMessages(prev => [...prev, newUserMessage]);
        setCurrentMessage('');
        setIsTyping(true);

        try {
            const response = await fetch(`${getLocalApiBase()}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: currentMessage,
                    name: leadForm.name,
                    phone: leadForm.phone,
                    history: chatMessages
                })
            });

            const data = await response.json();
            if (data.response) {
                setChatMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
            } else {
                setChatMessages(prev => [...prev, { role: 'assistant', content: 'Desculpe, tive um probleminha para processar sua mensagem. Pode repetir?' }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setChatMessages(prev => [...prev, { role: 'assistant', content: 'Estou com dificuldades de conexão agora. Que tal nos chamar no WhatsApp?' }]);
        } finally {
            setIsTyping(false);
        }
    };

    const FAQS = [
        {
            q: 'Como funciona o valor mensal? Realmente não há contas extras?',
            a: 'Exatamente! O valor do aluguel já inclui todas as despesas essenciais: energia elétrica, água, esgoto, internet Wi-Fi de alta velocidade e a limpeza periódica das áreas comuns. Sem IPTU, taxa de condomínio ou rateios surpresa.'
        },
        {
            q: 'Preciso de fiador ou seguro fiança para alugar?',
            a: 'Não! Nosso processo é 100% desburocratizado. Não exigimos fiador nem comprovação complexa de imobiliária. A reserva e entrada são viabilizadas através de caução simples e pré-cadastro.'
        },
        {
            q: 'Os quartos já vêm mobiliados?',
            a: 'Sim, todos os quartos contam com cama, colchão confortável, armário/guarda-roupa e escrivaninha de estudos/trabalho. Basta trazer suas malas e roupas pessoais.'
        },
        {
            q: 'Como funciona a convivência e o silêncio?',
            a: 'A MoronaVila é pensada para quem estuda e trabalha. Temos regras claras de boa convivência, com horário de silêncio rigoroso a partir das 22h, garantindo que todos tenham uma noite tranquila de sono e foco nos estudos.'
        },
        {
            q: 'Posso agendar uma visita para conhecer a casa antes de fechar?',
            a: 'Com certeza! Você pode agendar uma visita presencial ou até mesmo um tour por vídeo diretamente pelo nosso WhatsApp com um dos nossos gestores.'
        }
    ];

    const RoomDetailsModal = ({ room, onClose }: { room: Room, onClose: () => void }) => {
        const [activeMediaIndex, setActiveMediaIndex] = useState(0);
        const roomImages = room.media && room.media.length > 0
            ? room.media
            : [{ type: 'image' as const, url: '/fotos/vprimage1.jpg' }, { type: 'image' as const, url: '/fotos/vprimage6.jpg' }];

        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6">
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={onClose} />
                <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 z-10 p-3 bg-slate-950/50 hover:bg-rose-600 text-white rounded-2xl transition-all border border-white/10"
                    >
                        <X size={24} />
                    </button>

                    <div className="flex flex-col lg:flex-row h-full overflow-y-auto lg:overflow-hidden">
                        {/* Galeria de Mídia */}
                        <div className="lg:w-3/5 relative bg-black aspect-video lg:aspect-auto flex flex-col">
                            <div className="flex-1 relative overflow-hidden flex items-center justify-center">
                                {roomImages[activeMediaIndex] ? (
                                    roomImages[activeMediaIndex].type === 'video' ? (
                                        <video
                                            src={roomImages[activeMediaIndex].url}
                                            className="w-full h-full object-contain"
                                            controls
                                            autoPlay
                                        />
                                    ) : (
                                        <img
                                            src={roomImages[activeMediaIndex].url}
                                            alt={room.name}
                                            className="w-full h-full object-contain"
                                        />
                                    )
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-800">
                                        <Home size={64} className="text-slate-600" />
                                    </div>
                                )}
                            </div>

                            {/* Miniaturas */}
                            {roomImages.length > 1 && (
                                <div className="p-4 bg-slate-950/50 backdrop-blur-md flex gap-2 overflow-x-auto no-scrollbar justify-center">
                                    {roomImages.map((media, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveMediaIndex(idx)}
                                            className={`relative w-16 md:w-20 aspect-video rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                                                activeMediaIndex === idx ? 'border-rose-500 scale-105' : 'border-transparent opacity-50 hover:opacity-100'
                                            }`}
                                        >
                                            <img src={media.url} className="w-full h-full object-cover" alt="" />
                                            {media.type === 'video' && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                    <Play size={16} className="text-white" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Detalhes */}
                        <div className="lg:w-2/5 p-8 md:p-12 flex flex-col h-full bg-slate-900 overflow-y-auto">
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-rose-500/20">
                                        {room.type}
                                    </span>
                                    <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Acomodação Pronta</span>
                                </div>
                                <h3 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter mb-4">{room.name}</h3>
                                <div className="text-3xl font-black text-rose-500 mb-6">
                                    R$ {room.rent_value} <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">/ mês com tudo incluso</span>
                                </div>
                                <div className="h-px w-20 bg-gradient-to-r from-rose-600 to-transparent mb-8" />
                                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-medium">
                                    {room.description || "Ambiente confortável, arejado e silencioso, ideal para quem busca praticidade e um bom lugar para descansar e estudar com tranquilidade."}
                                </p>
                            </div>

                            {/* Mobiliário */}
                            {room.furniture && room.furniture.length > 0 && (
                                <div className="mb-10">
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Mobiliário Incluso</h4>
                                    <div className="grid grid-cols-1 gap-2.5">
                                        {room.furniture.map(item => (
                                            <div key={item.id} className="flex items-center gap-4 p-3 bg-slate-950/40 border border-slate-800/60 rounded-xl group">
                                                <div className="p-2 bg-slate-800 rounded-lg text-rose-400">
                                                    <Sofa size={16} />
                                                </div>
                                                <div>
                                                    <div className="text-slate-200 text-xs font-bold uppercase">{item.name}</div>
                                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.condition}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-auto pt-8 flex flex-col gap-3">
                                <a
                                    href={`https://wa.me/5521983245000?text=${encodeURIComponent(`Olá! Tenho interesse na vaga do ${room.name} na MoronaVila. Gostaria de agendar uma visita ou tirar dúvidas!`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2.5 border border-rose-500/40 hover:bg-rose-500/10 text-rose-400 px-6 py-4 rounded-full font-black text-[11px] uppercase tracking-[0.2em] transition-all"
                                >
                                    <MessageCircle size={16} /> Agendar Visita no WhatsApp
                                </a>
                                <button
                                    onClick={() => {
                                        setRegistrationRoom(room);
                                        setShowRegisterForm(true);
                                        setRegistrationStep('simulator');
                                        setSelectedRoom(null);
                                    }}
                                    className="w-full flex items-center justify-center gap-3 bg-rose-600 hover:bg-rose-700 text-white px-6 py-4 rounded-full font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-rose-900/40 hover:scale-[1.02] active:scale-98"
                                >
                                    Simular Entrada & Reserva <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const RegistrationModal = () => {
        if (!registrationRoom || !rentalConditions) return null;

        const handleSignUp = async (e: React.FormEvent) => {
            e.preventDefault();
            try {
                const tempPassword = regForm.cpf.replace(/\D/g, '').slice(0, 6) || 'morona123';
                const { user } = await signUpResident(
                    regForm.email,
                    tempPassword,
                    regForm.name,
                    regForm.phone
                );

                if (user) {
                    const { updateResident } = await import('../lib/database');
                    await updateResident(user.id, {
                        ...regForm,
                        status: 'Candidato',
                        room_id: registrationRoom.id,
                        entry_date: entryDate
                    });
                }

                setRegistrationStep('success');
            } catch (err) {
                console.error(err);
                alert('Erro ao realizar cadastro. Tente novamente.');
            }
        };

        return (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-6">
                <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl" onClick={() => setShowRegisterForm(false)} />
                <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 max-h-[95vh] flex flex-col">
                    <button
                        onClick={() => setShowRegisterForm(false)}
                        className="absolute top-6 right-6 z-10 p-3 bg-slate-950/50 hover:bg-rose-600 text-white rounded-2xl transition-all border border-white/10"
                    >
                        <X size={24} />
                    </button>

                    <div className="p-8 md:p-12 overflow-y-auto">
                        {registrationStep === 'simulator' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                <div className="text-center space-y-3">
                                    <div className="inline-flex items-center justify-center p-4 bg-rose-500/10 text-rose-500 rounded-2xl">
                                        <CreditCard size={32} />
                                    </div>
                                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Condições para Alugar</h3>
                                    <p className="text-slate-400 text-sm max-w-lg mx-auto">
                                        {rentalConditions.calculation_instructions || "Informe a data prevista de entrada para simular os valores do seu primeiro mês com total transparência."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Data Prevista de Entrada</label>
                                            <div className="relative">
                                                <Calendar size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
                                                <input
                                                    type="date"
                                                    value={entryDate}
                                                    onChange={(e) => {
                                                        setEntryDate(e.target.value);
                                                        setRegForm({ ...regForm, entry_date: e.target.value });
                                                    }}
                                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-full py-5 pl-16 pr-8 text-white focus:ring-2 focus:ring-rose-500/50 outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="p-6 bg-slate-950/50 border border-slate-800 rounded-3xl space-y-4">
                                            <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                                <Info size={14} /> Regras Gerais
                                            </h4>
                                            <p className="text-xs text-slate-400 leading-relaxed italic">
                                                {rentalConditions.rules_summary || "O pagamento é mensal e antecipado. A reserva é confirmada mediante o pagamento do caução."}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-950/80 border border-slate-800 rounded-[2rem] p-8 space-y-6 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl" />

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Primeiro Aluguel {rentalConditions.pro_rata_enabled && '(Pró-Rata)'}</span>
                                                <span className="text-white font-black">R$ {calculation?.proRata || 0}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Depósito Caução</span>
                                                <span className="text-white font-black">R$ {calculation?.deposit || 0}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Taxa de Limpeza Entrada</span>
                                                <span className="text-white font-black">R$ {calculation?.cleaning || 0}</span>
                                            </div>
                                            <div className="h-px bg-slate-800 my-2" />
                                            <div className="flex justify-between items-center">
                                                <span className="text-rose-500 font-black uppercase tracking-widest text-xs">Total para Entrada</span>
                                                <span className="text-3xl font-black text-white tracking-tighter">R$ {calculation?.total || 0}</span>
                                            </div>
                                        </div>

                                        <button
                                            disabled={!entryDate}
                                            onClick={() => setRegistrationStep('form')}
                                            className="w-full flex items-center justify-center gap-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white px-8 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-rose-900/40"
                                        >
                                            Estou de Acordo <Check size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {registrationStep === 'form' && (
                            <form onSubmit={handleSignUp} className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
                                <div className="text-center space-y-4">
                                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Pré-Cadastro de Residente</h3>
                                    <p className="text-slate-400 text-sm">Preencha seus dados para solicitar reserva no <span className="text-rose-500 font-bold underline">{registrationRoom.name}</span>.</p>
                                </div>

                                <div className="space-y-8">
                                    {/* 1. Dados Pessoais */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] border-b border-rose-500/20 pb-2">1. Dados Pessoais</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <input required placeholder="Nome Completo *" value={regForm.name} onChange={e => setRegForm({...regForm, name: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-rose-500" />
                                            <input required placeholder="CPF *" value={regForm.cpf} onChange={e => setRegForm({...regForm, cpf: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-rose-500" />
                                            <input required placeholder="Identidade (RG) *" value={regForm.rg} onChange={e => setRegForm({...regForm, rg: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-rose-500" />
                                            <input required placeholder="Telefone (WhatsApp) *" value={regForm.phone} onChange={e => setRegForm({...regForm, phone: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-rose-500" />
                                            <input required type="email" placeholder="Seu melhor e-mail *" value={regForm.email} onChange={e => setRegForm({...regForm, email: e.target.value})} className="w-full md:col-span-2 bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-rose-500" />
                                        </div>
                                    </div>

                                    {/* 2. Endereço */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] border-b border-rose-500/20 pb-2">2. Localização de Origem</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <input required placeholder="Endereço Anterior (Completo) *" value={regForm.origin_address} onChange={e => setRegForm({...regForm, origin_address: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-rose-500" />
                                            <input required placeholder="Endereço Familiar *" value={regForm.family_address} onChange={e => setRegForm({...regForm, family_address: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-rose-500" />
                                        </div>
                                    </div>

                                    {/* 3. Emergência */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] border-b border-rose-500/20 pb-2">3. Contato de Emergência</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <input required placeholder="Nome do Contato de Emergência *" value={regForm.emergency_contact_name} onChange={e => setRegForm({...regForm, emergency_contact_name: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-rose-500" />
                                            <input required placeholder="Telefone do Contato *" value={regForm.emergency_contact_phone} onChange={e => setRegForm({...regForm, emergency_contact_phone: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-rose-500" />
                                        </div>
                                    </div>

                                    {/* 4. Ocupação */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] border-b border-rose-500/20 pb-2">4. Perfil Acadêmico / Profissional</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <input required placeholder="Ocupação Atual (Estudante, Profissional...) *" value={regForm.occupation} onChange={e => setRegForm({...regForm, occupation: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-rose-500" />
                                            <input placeholder="Empresa ou Instituição" value={regForm.company} onChange={e => setRegForm({...regForm, company: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-rose-500" />
                                            <input placeholder="Universidade (se aplicável)" value={regForm.university} onChange={e => setRegForm({...regForm, university: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-rose-500" />
                                            <input placeholder="Curso" value={regForm.course} onChange={e => setRegForm({...regForm, course: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-rose-500" />
                                            <input required placeholder="Perfil no Instagram (URL ou @) *" value={regForm.instagram} onChange={e => setRegForm({...regForm, instagram: e.target.value})} className="w-full md:col-span-2 bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-rose-500" />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-3 bg-rose-600 hover:bg-rose-700 text-white px-8 py-6 rounded-full font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl shadow-rose-900/40 hover:scale-[1.02] active:scale-95"
                                >
                                    Enviar Solicitação de Reserva <ArrowRight size={20} />
                                </button>
                            </form>
                        )}

                        {registrationStep === 'success' && (
                            <div className="text-center py-16 space-y-8 animate-in zoom-in-95">
                                <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 shadow-lg shadow-emerald-900/10">
                                    <Check size={48} />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Reserva Solicitada!</h3>
                                    <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
                                        Seu pré-cadastro foi enviado com sucesso. Analisaremos seu perfil e entraremos em contato no seu WhatsApp em breve!
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowRegisterForm(false)}
                                    className="px-12 py-5 bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest rounded-full border border-white/10 transition-all"
                                >
                                    Voltar ao Início
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-rose-500/30">
            {/* Topbar Fixa com Design Glassmorphism */}
            <header className="fixed top-0 inset-x-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-tr from-rose-600 to-rose-500 rounded-xl text-white shadow-lg shadow-rose-900/40">
                            <Home size={22} />
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase italic leading-none">
                                MORONA<span className="text-rose-600">VILA</span>
                            </h1>
                            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">Coliving • Vila Isabel</span>
                        </div>
                    </div>

                    <nav className="hidden lg:flex items-center gap-8">
                        <a href="#comodidades" className="text-xs font-bold text-slate-300 hover:text-white uppercase tracking-wider transition-colors">Comodidades</a>
                        <a href="#localizacao" className="text-xs font-bold text-slate-300 hover:text-white uppercase tracking-wider transition-colors">Mapa da Região</a>
                        <a href="#vagas" className="text-xs font-bold text-slate-300 hover:text-white uppercase tracking-wider transition-colors">Acomodações</a>
                        <a href="#comparativo" className="text-xs font-bold text-slate-300 hover:text-white uppercase tracking-wider transition-colors">Custo-Benefício</a>
                        <a href="#contato" className="text-xs font-bold text-rose-500 hover:text-rose-400 uppercase tracking-wider transition-colors">Agendar Visita</a>
                    </nav>

                    <div className="flex items-center gap-3">
                        <a
                            href="https://wa.me/5521983245000?text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20as%20vagas%20na%20MoronaVila"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                            <MessageCircle size={14} /> WhatsApp
                        </a>

                        {isLoggedIn && currentUser ? (
                            <button
                                onClick={onGoToDashboard || onLoginClick}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-rose-900/40 hover:scale-105"
                            >
                                <User size={14} />
                                <span>Meu Painel</span>
                                <ChevronRight size={14} />
                            </button>
                        ) : (
                            <button
                                onClick={onLoginClick}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest transition-all border border-white/20 hover:border-rose-500 shadow-md hover:shadow-rose-900/30"
                            >
                                <User size={14} className="text-rose-400" />
                                <span>Login de Residentes</span>
                                <ChevronRight size={14} />
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* HERO SECTION DE ALTO IMPACTO */}
            <section className="relative min-h-[95vh] flex items-center pt-24 pb-16 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src={heroMedia} alt="Fachada Moronavila" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-950/70" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
                    <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        {/* Badges de Destaque */}
                        <div className="flex flex-wrap items-center gap-2.5">
                            <span className="px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 backdrop-blur-md">
                                <MapPin size={13} /> Rua Torres Homem, 886 • Vila Isabel
                            </span>
                            <span className="px-3 py-1.5 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/10">
                                100% Mobiliado
                            </span>
                            <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-emerald-500/30">
                                Contas Inclusas
                            </span>
                        </div>

                        {/* Título Principal */}
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight uppercase italic drop-shadow-2xl">
                            {heroTitle}
                        </h2>

                        {/* Subtítulo */}
                        <p className="text-base md:text-xl text-slate-300 leading-relaxed font-medium drop-shadow max-w-2xl">
                            {heroSubtitle}
                        </p>

                        {/* Botões de Ação */}
                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            <a
                                href="#vagas"
                                className="inline-flex items-center gap-3 bg-rose-600 hover:bg-rose-700 text-white px-8 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl shadow-rose-900/50 hover:scale-105 active:scale-95"
                            >
                                Ver Vagas Disponíveis <ArrowRight size={18} />
                            </a>
                            <a
                                href="#localizacao"
                                className="inline-flex items-center gap-3 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white px-8 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all border border-slate-700 hover:border-slate-500 backdrop-blur-md"
                            >
                                <MapPin size={18} className="text-rose-500" /> Mapa da Região
                            </a>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
                            <div>
                                <div className="text-2xl font-black text-white">300m</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Shopping Boulevard</div>
                            </div>
                            <div>
                                <div className="text-2xl font-black text-rose-400">100m</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Praça Sete & Parmê</div>
                            </div>
                            <div>
                                <div className="text-2xl font-black text-amber-400">150m</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Vila Isabel & Extra</div>
                            </div>
                            <div>
                                <div className="text-2xl font-black text-emerald-400">Zero</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Fiador ou Burocracia</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEÇÃO 1: COMODIDADES & ÁREAS COMUNS (COM FOTOS REAIS) */}
            <section id="comodidades" className="py-28 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <AmenitiesShowcase onSelectRoom={() => {
                        const el = document.getElementById('vagas');
                        el?.scrollIntoView({ behavior: 'smooth' });
                    }} />
                </div>
            </section>

            {/* SEÇÃO 2: MAPA INTERATIVO E RADAR DE VILA ISABEL */}
            <section id="localizacao" className="py-28 bg-slate-900/30 border-y border-white/5 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-full max-h-96 bg-rose-600/5 rounded-full blur-[140px] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <InteractiveMap />
                </div>
            </section>

            {/* SEÇÃO 3: ACOMODAÇÕES & QUARTOS DISPONÍVEIS */}
            <section id="vagas" className="py-28 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-16 max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-black uppercase tracking-[0.2em] mb-4">
                            <Home size={14} /> Espaços Privativos
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase italic mb-4">
                            Escolha sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-400">Acomodação Ideal</span>
                        </h2>
                        <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                            Quartos individuais e suítes prontas para morar, com conforto térmico, internet cabeada/Wi-Fi e mobiliário completo.
                        </p>
                    </div>

                    {rooms.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {rooms.filter(room => !room.is_common_area && room.availability_status === 'Disponível' && !room.is_blocked_for_repairs).map(room => {
                                const roomThumb = room.media && room.media[0] ? room.media[0].url : '/fotos/vprimage1.jpg';
                                return (
                                    <div key={room.id} className="group bg-slate-900/60 border border-slate-800 rounded-[2.5rem] overflow-hidden hover:border-rose-500/40 transition-all duration-500 hover:shadow-2xl hover:shadow-rose-900/20 flex flex-col">
                                        <div className="relative aspect-[16/11] overflow-hidden bg-slate-950">
                                            <img
                                                src={roomThumb}
                                                alt={room.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                                            <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-rose-400">
                                                {room.type}
                                            </div>

                                            <div className="absolute top-4 right-4 bg-slate-950/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                                                <span className="text-white font-black text-lg">R$ {room.rent_value}</span>
                                                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest ml-1">/mês</span>
                                            </div>
                                        </div>

                                        <div className="p-8 flex-1 flex flex-col justify-between">
                                            <div>
                                                <h4 className="text-2xl font-black text-white uppercase italic tracking-tight mb-2">{room.name}</h4>
                                                <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed mb-6 font-medium">
                                                    {room.description || "Acomodação mobiliada com cama, armário, escrivaninha e excelente ventilação natural."}
                                                </p>
                                            </div>

                                            <div className="space-y-3 pt-2 border-t border-slate-800/80">
                                                <button
                                                    onClick={() => setSelectedRoom(room)}
                                                    className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-rose-900/30 flex items-center justify-center gap-2"
                                                >
                                                    Ver Detalhes & Fotos <ArrowRight size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-12 text-center bg-slate-900/40 rounded-[2.5rem] border border-slate-800 max-w-xl mx-auto">
                            <Home size={40} className="text-rose-500 mx-auto mb-4" />
                            <h3 className="text-xl font-black text-white uppercase mb-2">Consulte Próximas Vagas</h3>
                            <p className="text-slate-400 text-sm mb-6">Estamos com alta procura para o período. Fale conosco no WhatsApp para entrar na lista de espera prioritária.</p>
                            <a
                                href="https://wa.me/5521983245000?text=Gostaria%20de%20saber%20sobre%20as%20pr%C3%B3ximas%20vagas%20dispon%C3%ADveis%20na%20MoronaVila"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-widest transition-all"
                            >
                                <MessageCircle size={16} /> Entrar na Lista de Espera
                            </a>
                        </div>
                    )}
                </div>
            </section>

            {/* SEÇÃO 4: COMPARATIVO DE CUSTO-BENEFÍCIO */}
            <section id="comparativo" className="py-28 bg-slate-900/30 border-y border-white/5 relative">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-rose-500 text-xs font-black uppercase tracking-[0.25em]">Transparência Financeira</span>
                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tight mt-2 mb-4">
                            Morar Sozinho vs. Viver na Moronavila
                        </h2>
                        <p className="text-slate-400 text-base max-w-2xl mx-auto">
                            Veja como a MoronaVila elimina custos ocultos, burocracias e o estresse de montar uma casa do zero.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Cartão Tradicional */}
                        <div className="bg-slate-950/60 border border-slate-800/80 rounded-[2.5rem] p-8 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-red-500/10 text-red-400 rounded-2xl">
                                    <XCircle size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white uppercase">Aluguel Tradicional</h3>
                                    <span className="text-xs text-slate-500">Apê / Kitnet Convencional</span>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm text-slate-400 border-t border-slate-800 pt-6">
                                <div className="flex justify-between py-1"><span>Aluguel + IPTU</span><span className="text-slate-300 font-bold">R$ 1.200 - 1.800</span></div>
                                <div className="flex justify-between py-1"><span>Condomínio</span><span className="text-slate-300 font-bold">R$ 400 - 800</span></div>
                                <div className="flex justify-between py-1"><span>Energia Elétrica</span><span className="text-slate-300 font-bold">R$ 150 - 300</span></div>
                                <div className="flex justify-between py-1"><span>Água e Gás</span><span className="text-slate-300 font-bold">R$ 100 - 180</span></div>
                                <div className="flex justify-between py-1"><span>Internet Fibra</span><span className="text-slate-300 font-bold">R$ 120 - 180</span></div>
                                <div className="flex justify-between py-1"><span>Compra de Móveis & Eletros</span><span className="text-red-400 font-bold">R$ 5.000 a 10.000+</span></div>
                                <div className="flex justify-between py-1"><span>Exigência de Fiador</span><span className="text-red-400 font-bold">Obrigatório / Difícil</span></div>
                            </div>

                            <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 italic">
                                *Contratos longos de 30 meses, multas rescisórias pesadas e despesas variáveis imprevisíveis.
                            </div>
                        </div>

                        {/* Cartão MoronaVila */}
                        <div className="bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 border-2 border-rose-500/50 rounded-[2.5rem] p-8 space-y-6 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl" />

                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-rose-600 text-white rounded-2xl shadow-lg shadow-rose-900/50">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white uppercase">Na MoronaVila</h3>
                                    <span className="text-xs text-rose-400 font-bold">Tudo em Uma Parcela Única</span>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm text-slate-300 border-t border-rose-500/20 pt-6">
                                <div className="flex items-center justify-between py-1">
                                    <span className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Aluguel do Quarto Mobiliado</span>
                                    <span className="text-white font-black">Incluso</span>
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <span className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Luz, Água, Gás & IPTU</span>
                                    <span className="text-white font-black">Incluso</span>
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <span className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Wi-Fi Alta Velocidade</span>
                                    <span className="text-white font-black">Incluso</span>
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <span className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Cozinha Equipada & Coworking</span>
                                    <span className="text-white font-black">Incluso</span>
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <span className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Limpeza de Áreas Comuns</span>
                                    <span className="text-white font-black">Incluso</span>
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <span className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Interfone Digital no Celular</span>
                                    <span className="text-white font-black">Incluso</span>
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <span className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Sem Fiador / Caução Simples</span>
                                    <span className="text-emerald-400 font-black">100% Flexível</span>
                                </div>
                            </div>

                            <a
                                href="#vagas"
                                className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-rose-900/40"
                            >
                                Escolher Minha Vaga <ArrowRight size={16} />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEÇÃO 5: REGRAS E FILOSOFIA */}
            <section className="py-24 relative">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center justify-center p-5 rounded-[2rem] bg-gradient-to-br from-amber-500/20 to-amber-700/10 text-amber-500 shadow-xl border border-amber-500/20 mb-8">
                        <Shield size={36} />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic mb-6">Convivência Harmoniosa</h2>
                    <p className="text-slate-300 text-base md:text-lg leading-relaxed whitespace-pre-line text-left md:text-center p-8 md:p-12 bg-slate-900/40 backdrop-blur-sm shadow-xl rounded-[2.5rem] border border-slate-800">
                        {rules_text || "Prezamos pelo respeito mútuo, colaboração e silêncio a partir das 22h para que todos tenham um ambiente propício para estudos e descanso."}
                    </p>
                </div>
            </section>

            {/* SEÇÃO 6: PERGUNTAS FREQUENTES (FAQ) */}
            <section className="py-24 bg-slate-900/20 border-t border-white/5">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-rose-500 text-xs font-black uppercase tracking-[0.25em]">Dúvidas Frequentes</span>
                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tight mt-2 mb-4">
                            Perguntas & Respostas
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {FAQS.map((faq, idx) => {
                            const isOpen = faqOpen === idx;
                            return (
                                <div
                                    key={idx}
                                    className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden transition-all"
                                >
                                    <button
                                        onClick={() => setFaqOpen(isOpen ? null : idx)}
                                        className="w-full text-left p-6 flex items-center justify-between gap-4 font-black text-white text-base md:text-lg uppercase italic tracking-tight"
                                    >
                                        <span>{faq.q}</span>
                                        <span className={`p-2 rounded-xl bg-slate-800 text-rose-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                                            <ChevronRight size={18} />
                                        </span>
                                    </button>
                                    {isOpen && (
                                        <div className="px-6 pb-6 text-slate-300 text-sm leading-relaxed border-t border-slate-800/60 pt-4">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* SEÇÃO 7: QUER SABER MAIS / AGENTE VIRTUAL & CONTATO */}
            <section id="contato" className="py-28 bg-gradient-to-b from-slate-950 to-slate-900 border-t border-white/5 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full max-h-96 bg-rose-600/10 rounded-full blur-[140px] pointer-events-none" />

                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-rose-500/10 text-rose-500 mb-6">
                            <MessageCircle size={32} />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic mb-4">Pronto para Conhecer?</h2>
                        <p className="text-lg text-slate-300 font-medium max-w-xl mx-auto">
                            Tire suas dúvidas imediatamente com nosso Agente Virtual ou fale com nosso atendimento no WhatsApp para agendar uma visita.
                        </p>
                    </div>

                    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                        {!leadSubmitted ? (
                            <form onSubmit={handleLeadSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Como prefere ser chamado?</label>
                                        <input
                                            required
                                            type="text"
                                            value={leadForm.name}
                                            onChange={e => setLeadForm({ ...leadForm, name: e.target.value })}
                                            placeholder="Seu nome"
                                            className="w-full bg-slate-950/50 border border-slate-800 rounded-full px-6 py-4 text-white focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Telefone (WhatsApp)</label>
                                        <input
                                            required
                                            type="tel"
                                            value={leadForm.phone}
                                            onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })}
                                            placeholder="(21) 99999-9999"
                                            className="w-full bg-slate-950/50 border border-slate-800 rounded-full px-6 py-4 text-white focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Seu melhor E-mail</label>
                                    <input
                                        required
                                        type="email"
                                        value={leadForm.email}
                                        onChange={e => setLeadForm({ ...leadForm, email: e.target.value })}
                                        placeholder="seu@email.com"
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-full px-6 py-4 text-white focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 outline-none transition-all"
                                    />
                                </div>
                                <button type="submit" className="w-full flex items-center justify-center gap-3 bg-rose-600 hover:bg-rose-700 text-white px-8 py-5 rounded-full font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl shadow-rose-900/40 hover:scale-105 active:scale-95 mt-8">
                                    Iniciar Atendimento <Send size={18} />
                                </button>
                            </form>
                        ) : (
                            <div className="flex flex-col h-[550px] animate-in fade-in zoom-in duration-500">
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                    {chatMessages.map((msg, idx) => (
                                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] p-4 rounded-[2rem] text-sm font-medium leading-relaxed shadow-lg ${msg.role === 'user'
                                                ? 'bg-rose-600 text-white rounded-tr-none'
                                                : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none'
                                                }`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))}
                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-[2rem] rounded-tl-none shadow-lg">
                                                <div className="flex gap-1">
                                                    <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                    <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                    <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 bg-slate-950/40 border-t border-white/5 flex justify-center">
                                    <a
                                        href={`https://wa.me/5521983245000?text=${encodeURIComponent(`Olá, meu nome é ${leadForm.name} e acabei de conhecer a MoronaVila! Gostaria de agendar uma visita e tirar dúvidas.`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all shadow-lg hover:scale-105 active:scale-95"
                                    >
                                        <MessageCircle size={16} /> Falar com Consultor no WhatsApp
                                    </a>
                                </div>
                                <form onSubmit={handleSendMessage} className="p-4 bg-slate-950/60 border-t border-white/5 flex gap-3">
                                    <input
                                        type="text"
                                        value={currentMessage}
                                        onChange={e => setCurrentMessage(e.target.value)}
                                        placeholder="Digite sua dúvida aqui..."
                                        className="flex-1 bg-slate-950/50 border border-slate-800 rounded-full px-6 py-3 text-white focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 outline-none transition-all text-sm"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isTyping}
                                        className="bg-rose-600 hover:bg-rose-700 text-white p-3 rounded-full transition-all disabled:opacity-50 disabled:scale-95"
                                    >
                                        <Send size={20} />
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* MODAIS */}
            {showRegisterForm && <RegistrationModal />}
            {selectedRoom && (
                <RoomDetailsModal
                    room={selectedRoom}
                    onClose={() => setSelectedRoom(null)}
                />
            )}

            {/* FOOTER */}
            <footer className="bg-slate-950 border-t border-white/5 py-16">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-rose-600 rounded-xl text-white">
                                <Home size={20} />
                            </div>
                            <span className="font-black text-white text-xl uppercase italic tracking-tighter">MORONA<span className="text-rose-600">VILA</span></span>
                        </div>
                        <p className="text-slate-500 text-xs leading-relaxed max-w-sm">
                            Moradia compartilhada moderna, segura e sem burocracia na Vila Isabel, Rio de Janeiro.
                        </p>
                    </div>

                    <div className="text-left md:text-center space-y-1 text-xs text-slate-400">
                        <div className="font-bold text-slate-200">Endereço</div>
                        <div>Rua Torres Homem, 886 - Vila Isabel</div>
                        <div>Rio de Janeiro - RJ • CEP 20551-075</div>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-3">
                        <button
                            onClick={isLoggedIn && onGoToDashboard ? onGoToDashboard : onLoginClick}
                            className="px-6 py-3 rounded-full bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-black uppercase tracking-widest border border-rose-500/30 transition-all flex items-center gap-2"
                        >
                            <User size={14} />
                            <span>{isLoggedIn ? 'Acessar Meu Dashboard' : 'Login de Residentes'}</span>
                        </button>
                        <p className="text-slate-600 font-bold text-[10px] uppercase tracking-widest">
                            © {new Date().getFullYear()} MoronaVila. Todos os direitos reservados.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
