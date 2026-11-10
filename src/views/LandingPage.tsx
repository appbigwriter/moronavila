import React, { useEffect, useState } from 'react';
import {
    Home, MapPin, Sparkles, Shield, ChevronRight, Play,
    ArrowRight, MessageCircle, Send, X, Sofa, Check, Info,
    Calendar, CreditCard, CheckCircle2, XCircle, HelpCircle,
    Phone, Mail, User, Clock, Star, Users, ExternalLink,
    Bed, Bath, Layers, ShieldCheck, FileText
} from 'lucide-react';
import { fetchPublicPropertyDescription, fetchPublicRooms, fetchRentalConditions, signUpResident } from '../lib/database';
import { getLocalApiBase } from '../lib/localApi';
import { PropertyDescription, Room, RentalConditions, Resident } from '../types';
import { InteractiveMap } from '../components/InteractiveMap';
import { AmenitiesShowcase } from '../components/AmenitiesShowcase';
import { Language } from '../i18n/types';
import { TRANSLATIONS } from '../i18n/translations';
import { LanguageSelector } from '../components/LanguageSelector';

interface LandingPageProps {
    onLoginClick: () => void;
    isLoggedIn?: boolean;
    currentUser?: Resident | null;
    onGoToDashboard?: () => void;
    onOpenRules?: () => void;
}

const DEFAULT_PROPERTY_DESC: PropertyDescription = {
    id: 'default',
    main_text: "Seu quarto independente, sem as dores de um apartamento\nEntrada própria, mobiliado e sem fiador na Rua Torres Homem, Vila Isabel. Para quem trabalha e quer voltar para casa e descansar.",
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
    rooms_text: "Quartos, suítes independentes, studios e apartamento mobiliados, silenciosos e prontos para morar.",
    location_text: "Rua Torres Homem, 886 - Vila Isabel, Rio de Janeiro. A 300m do Shopping Boulevard e fácil acesso ao Maracanã, UERJ e Centro.",
    location_media: ['/fotos/vprimage11_entrada.jpg'],
    amenities_text: "Wi-Fi alta velocidade, ar condicionado, cozinha completa, lavanderia, sala de estudo, lounge para visitantes e área externa com churrasqueira.",
    amenities_media: [],
    rules_text: "Prezamos pela confiança, consideração e respeito, com silêncio a partir das 22h para que todos descansem."
};

// Linha de produtos da casa. Preços definidos pela gestão (nov/2026).
const PRODUCTS = [
    {
        name: 'Quarto Individual',
        price: 800,
        couplePrice: 1100,
        audience: 'Para 1 pessoa ou casal',
        promise: 'Seu quarto e seu banheiro, só seus, numa casa silenciosa.',
        features: ['Banheiro privativo (fora do quarto)', 'Mobiliado', 'Cozinha compartilhada com armário individual'],
        icon: Bed
    },
    {
        name: 'Suíte Independente',
        price: 900,
        couplePrice: 1200,
        audience: 'Para 1 pessoa ou casal',
        promise: 'Sua porta, sua rotina. Ninguém passa pelo seu quarto.',
        features: ['Entrada independente', 'Banheiro na suíte', 'Mobiliada', 'Cozinha compartilhada com armário individual'],
        icon: Home
    },
    {
        name: 'Studio',
        price: 1000,
        couplePrice: 1350,
        audience: 'Para profissionais ou casais sem filhos',
        promise: 'Seu primeiro lar a dois: mobiliado e sem fiador.',
        features: ['Cozinha e banheiro próprios', 'Mobiliado', 'Até 2 pessoas'],
        icon: Layers
    },
    {
        name: 'Apartamento MoronaVila',
        price: 1700,
        couplePrice: null,
        audience: 'Para casais ou quem trabalha de casa',
        promise: 'Um apartamento completo sem condomínio, IPTU ou fiador.',
        features: ['Quarto e sala', 'Cozinha e banheiro próprios', 'Mobiliado', 'Até 2 pessoas'],
        icon: Sofa
    }
];

// Promoção de lançamento: R$ 100 a menos por mês, durante 6 meses, para contratos fechados até 10/11/2026.
// Depois do prazo, o site volta sozinho aos preços normais.
const PROMO = { discount: 100, months: 6, deadline: '10/11', endsAt: new Date('2026-11-10T23:59:59-03:00') };
const isPromoActive = () => Date.now() <= PROMO.endsAt.getTime();
const formatBRL = (value: number) => `R$ ${value.toLocaleString('pt-BR')}`;
const MIN_PRICE = Math.min(...PRODUCTS.map(p => p.price));

const HOUSE_RULES = [
    '1. Visitas apenas para familiares do residente ou pessoas previamente cadastradas (máx. 2 dias/semana). Não é permitido receber crianças ou animais de estimação. Toda visita deve ser previamente cadastrada.',
    '2. Não é permitido fumar nem ingerir bebidas alcoólicas em nenhuma dependência da propriedade (multa de R$ 20,00 por infração).',
    '3. Proibido passar roupa nos quartos (espaço na sala para isso) e lavar roupa no banheiro do quarto. O uso da lavanderia precisa ser agendado com a administração, sendo a lavagem de roupa na máquina limitada a uma vez por semana e sem exceder o limite de peso do equipamento (multa de R$ 20,00 por infração).',
    '4. Aluguel sempre referente do 1º ao último dia do mês, pago antecipado até o 5º dia útil via PIX (21) 983245000 em nome de Sergio Oswaldo de Castro.',
    '5. Saída do imóvel mediante aviso prévio por e-mail ou WhatsApp com pelo menos 30 dias de antecedência. O depósito caução quita o último mês de permanência.',
    '6. Não é permitido som ou TV em volume alto em qualquer horário (multa de R$ 20,00 por infração).',
    '7. Entregas devem ser recebidas pelos próprios residentes, informando o número da unidade como complemento de endereço para aviso via interfone.',
    '8. Pratos, copos, talheres e pertences individuais devem ser guardados nos armários individuais da cozinha; itens fora serão recolhidos (multa de R$ 10,00 por infração).',
    '9. Cozinha deve ser deixada limpa imediatamente após o uso; câmeras registrarão infrações com multa sumária de R$ 20,00.',
    '10. Proibido que residentes entrem ou ocupem quartos ou banheiros de outros residentes (multa de R$ 50,00 por infração).',
    '11. Os eletrodomésticos e utensílios das partes compartilhadas deverão ser usados com zelo e caso haja necessidade de reposição ou manutenção por problemas técnicos o valor será rateado por todos os residentes independente de terem usado ou não. Os problemas ocasionados por mau uso e registrados pelas câmeras de segurança implicarão na cobrança total do reparo ou reposição do residente responsável pelo problema.',
    '12. Os residentes que por ventura desejarem usar o lounge, a churrasqueira e a área externa da casa se responsabilizam pela limpeza após o uso e por quaisquer danos que possam ocorrer, com multa de R$ 20,00 por infração.'
];

const DEFAULT_RENTAL_CONDITIONS: RentalConditions = {
    id: 'default',
    deposit_months: 1,
    cleaning_fee_fixed: 185,
    pro_rata_enabled: true,
    rules_summary: "O caução quita o último mês de permanencia do residente. Sem necessidade de fiador.",
    calculation_instructions: "Informe a data prevista de entrada para simular os valores do seu primeiro mês com total transparência."
};

const DEFAULT_SAMPLE_ROOMS: Room[] = [
    {
        id: '19535d39-de6f-4acd-bbfc-2ba817be7257',
        name: 'Quarto A',
        type: 'Quarto' as any,
        capacity: 1,
        rent_value: 900,
        cleaning_fee: 80,
        extras_value: 0,
        is_common_area: false,
        is_blocked_for_repairs: false,
        availability_status: 'Disponível',
        description: 'Quarto individual confortável e bem iluminado.',
        furniture: [
            { id: 'f1', name: 'Cama Box Solteiro', condition: 'Novo' },
            { id: 'f2', name: 'Guarda-Roupa', condition: 'Novo' },
            { id: 'f3', name: 'Mesa de Estudos e Cadeira', condition: 'Novo' }
        ],
        media: [
            { id: 'm1', url: '/fotos/98905_0gMXlxxyf06MJQMP.jpg', type: 'image' },
            { id: 'm2', url: '/fotos/98905_CYCX7spXgRfrsz7H.jpg', type: 'image' }
        ]
    },
    {
        id: '2b523237-b456-4d4b-8eb2-1f561efe9c57',
        name: 'Quarto B',
        type: 'Quarto' as any,
        capacity: 1,
        rent_value: 900,
        cleaning_fee: 80,
        extras_value: 0,
        is_common_area: false,
        is_blocked_for_repairs: false,
        availability_status: 'Disponível',
        description: 'Quarto individual com armário e mesa de estudos.',
        furniture: [
            { id: 'f4', name: 'Cama Box Solteiro', condition: 'Novo' },
            { id: 'f5', name: 'Armário Planejado', condition: 'Bom' },
            { id: 'f6', name: 'Escrivaninha', condition: 'Novo' }
        ],
        media: [
            { id: 'm3', url: '/fotos/98905_r9U1krISShnTliUA (1).jpg', type: 'image' },
            { id: 'm4', url: '/fotos/98905_Z6otj5s5Fg0NeCYF.jpg', type: 'image' }
        ]
    },
    {
        id: 'c4a3d74d-104d-49d4-a04b-6b439c0251ee',
        name: 'Quarto C',
        type: 'Quarto' as any,
        capacity: 1,
        rent_value: 900,
        cleaning_fee: 80,
        extras_value: 0,
        is_common_area: false,
        is_blocked_for_repairs: false,
        availability_status: 'Disponível',
        description: 'Quarto individual amplo e silencioso.',
        furniture: [
            { id: 'f7', name: 'Cama Box Solteiro', condition: 'Novo' },
            { id: 'f8', name: 'Armário', condition: 'Novo' },
            { id: 'f9', name: 'Mesa de Estudos', condition: 'Novo' }
        ],
        media: [
            { id: 'm5', url: '/fotos/98905_0gMXlxxyf06MJQMP.jpg', type: 'image' }
        ]
    },
    {
        id: 'c1e7a552-0cba-46f6-b36d-f5a3a79ca0c3',
        name: 'Quarto E',
        type: 'Quarto' as any,
        capacity: 1,
        rent_value: 800,
        cleaning_fee: 60,
        extras_value: 0,
        is_common_area: false,
        is_blocked_for_repairs: false,
        availability_status: 'Disponível',
        description: 'Quarto individual amplo e ventilado com cama e armário individual.',
        furniture: [
            { id: 'f10', name: 'Cama Individual', condition: 'Novo' },
            { id: 'f11', name: 'Armário Individual', condition: 'Novo' }
        ],
        media: [
            { id: 'm6', url: '/fotos/98905_CYCX7spXgRfrsz7H.jpg', type: 'image' }
        ]
    }
];

export function LandingPage({ onLoginClick, isLoggedIn, currentUser, onGoToDashboard, onOpenRules }: LandingPageProps) {
    const [currentLang, setCurrentLang] = useState<Language>(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            const urlLang = params.get('lang') as Language;
            if (urlLang && ['pt', 'en', 'es'].includes(urlLang)) return urlLang;
            const saved = localStorage.getItem('moronavila_lang') as Language;
            if (saved && ['pt', 'en', 'es'].includes(saved)) return saved;
        } catch {}
        return 'pt';
    });
    const t = TRANSLATIONS[currentLang] || TRANSLATIONS.pt;

    const promoActive = isPromoActive();
    const fromPrice = promoActive ? MIN_PRICE - PROMO.discount : MIN_PRICE;
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
    const [calculation, setCalculation] = useState<{ proRata: number; deposit: number; cleaning: number; total: number; daysRemaining?: number; isHalfMonth?: boolean } | null>(null);

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
        facebook: '',
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

            const parts = entryDate.split('-').map(Number);
            if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return;
            const [year, monthOneBased, day] = parts;
            const daysInMonth = new Date(year, monthOneBased, 0).getDate();
            const daysRemaining = Math.max(1, daysInMonth - day + 1);
            const isAfter15 = day > 15;

            let proRata = room.rent_value;
            if (isAfter15) {
                // Entrada após o dia 15: equivalente a 15 dias (50%, base comercial de 30 dias)
                proRata = room.rent_value * 0.5;
            } else if (rentalConditions.pro_rata_enabled !== false) {
                // Entrada do dia 1 ao dia 15: valor proporcional aos dias restantes do mês corrente
                proRata = (room.rent_value / daysInMonth) * daysRemaining;
            }

            const deposit = (rentalConditions.deposit_months ?? 1) * room.rent_value;
            const cleaning = rentalConditions.cleaning_fee_fixed ?? 185;

            setCalculation({
                proRata: Math.round(proRata),
                deposit: Math.round(deposit),
                cleaning: Math.round(cleaning),
                total: Math.round(proRata + deposit + cleaning),
                daysRemaining,
                isHalfMonth: isAfter15
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

    const { main_media } = propertyDesc;

    // Foto do Hero com fallback para a fachada real
    const heroMedia = main_media?.[0] || '/fotos/vprimage11_entrada.jpg';

    // Título e subtítulo dinâmicos de acordo com o idioma selecionado
    const heroTitle = t.hero.title;
    const heroSubtitle = t.hero.subtitle;

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
            q: 'Quanto é e como funciona o depósito de caução?',
            a: 'Equivale a um mês de aluguel. O residente é livre para deixar a casa desde que avise com a antecedência mínima de 30 dias sobre sua intenção, com o depósito quitando esse último período de 30 dias, do dia 1 ao último dia do mês da saída.'
        },
        {
            q: 'Quais são as regras básicas da propriedade?',
            a: `1 - Visitas apenas para familiares ou cadastrados (máx. 2 dias/semana); sem crianças ou pets.\n2 - Proibido fumar ou beber bebidas alcoólicas em toda a propriedade (multa de R$ 20,00).\n3 - Passar roupa apenas na sala; proibido lavar no banheiro; uso agendado da lavanderia (multa de R$ 20,00).\n4 - Aluguel pago antecipado até o 5º dia útil via PIX (21) 983245000 para Sergio Oswaldo de Castro.\n5 - Aviso de saída de 30 dias; depósito quita o último mês.\n6 - Proibido som ou TV alto em qualquer horário (multa de R$ 20,00).\n7 - Entregas recebidas pelo morador via interfone da unidade.\n8 - Louças guardadas nos armários individuais (multa de R$ 10,00 se deixadas fora).\n9 - Cozinha limpa após o uso (multa de R$ 20,00).\n10 - Proibido entrar em quartos/banheiros alheios (multa de R$ 50,00).\n11 - Eletrodomésticos compartilhados usados com zelo; rateio de manutenção apenas para problemas técnicos, com cobrança total do residente em caso de mau uso.\n12 - Lounge, churrasqueira e área externa: morador responsável por limpeza e danos (multa de R$ 20,00 por infração).\n\nAs multas são lançadas na fatura subsequente. A casa é monitorada por câmeras 24h.`
        },
        {
            q: 'Posso receber visitas?',
            a: 'Sim. Cada unidade pode cadastrar até 2 visitantes fixos, com documento e foto. Visitas com pernoite são permitidas até 2 noites por semana. O visitante entra pelo interfone da sua unidade, recebido por você. Assim você recebe quem ama, e sabe que seu vizinho também só recebe gente conhecida.'
        },
        {
            q: 'Como funcionam as contas? Há despesas extras?',
            a: 'Não há condomínio, IPTU ou rateio. A internet Wi-Fi, o gás da cozinha compartilhada e a limpeza das áreas comuns são por conta da casa. A partir de janeiro de 2027, luz e água passam a ser cobradas pelo medidor individual da sua unidade: você paga só o que usa. Nos studios e no apartamento, que têm cozinha própria, o gás é por conta do residente.'
        },
        {
            q: 'Vocês aceitam casais?',
            a: 'Sim. Todas as unidades recebem casais sem filhos: Quarto Individual R$ 1.100, Suíte Independente R$ 1.200, Studio R$ 1.350 e Apartamento MoronaVila R$ 1.700 (até 2 pessoas).'
        },
        {
            q: 'Preciso de fiador ou seguro fiança para alugar?',
            a: 'Não! Nosso processo é 100% desburocratizado. Não exigimos fiador nem comprovação complexa de imobiliária. A reserva e entrada são viabilizadas através de caução simples e pré-cadastro.'
        },
        {
            q: 'Os quartos já vêm mobiliados?',
            a: 'Sim, todas as unidades contam com cama, colchão confortável, armário/guarda-roupa e escrivaninha de trabalho. Basta trazer suas malas e roupas pessoais.'
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

        const isSuite = (room as any).suite === true;
        const availability = room.is_blocked_for_repairs
            ? (currentLang === 'pt' ? 'Em Manutenção' : currentLang === 'es' ? 'En Mantenimiento' : 'Under Maintenance')
            : (room.availability_status || t.roomModal.availability);

        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6">
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={onClose} />
                <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 max-h-[92vh] flex flex-col">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 z-10 p-3 bg-slate-950/70 hover:bg-rose-600 text-white rounded-2xl transition-all border border-white/10 shadow-lg"
                        title="Fechar"
                    >
                        <X size={22} />
                    </button>

                    <div className="flex flex-col lg:flex-row h-full overflow-y-auto lg:overflow-hidden">
                        {/* Galeria de Mídia */}
                        <div className="lg:w-7/12 relative bg-black aspect-video lg:aspect-auto flex flex-col justify-between">
                            <div className="flex-1 relative overflow-hidden flex items-center justify-center min-h-[300px] lg:min-h-[420px]">
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
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-600 p-8">
                                        <Home size={64} className="mb-2" />
                                        <span className="text-xs uppercase font-bold tracking-widest text-slate-500">Foto do Quarto</span>
                                    </div>
                                )}
                            </div>

                            {/* Miniaturas */}
                            {roomImages.length > 1 && (
                                <div className="p-4 bg-slate-950/80 backdrop-blur-md flex gap-2 overflow-x-auto no-scrollbar justify-center border-t border-white/5">
                                    {roomImages.map((media, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveMediaIndex(idx)}
                                            className={`relative w-16 md:w-20 aspect-video rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                                                activeMediaIndex === idx ? 'border-rose-500 scale-105 shadow-md shadow-rose-950' : 'border-transparent opacity-50 hover:opacity-100'
                                            }`}
                                        >
                                            <img src={media.url} className="w-full h-full object-cover" alt="" />
                                            {media.type === 'video' && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                                    <Play size={14} className="text-white" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Detalhes Técnicos Cadastrados */}
                        <div className="lg:w-5/12 p-6 md:p-10 flex flex-col h-full bg-slate-900 overflow-y-auto border-t lg:border-t-0 lg:border-l border-slate-800">
                            {/* Badges de Status e Tipo */}
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <span className="px-3 py-1 bg-rose-500/10 text-rose-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-rose-500/20">
                                    {room.type}
                                </span>
                                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border ${
                                    availability === 'Disponível' || availability === t.roomModal.availability
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                }`}>
                                    {availability}
                                </span>
                                {isSuite && (
                                    <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-500/20">
                                        {t.roomModal.privateSuite}
                                    </span>
                                )}
                            </div>

                            <h3 className="text-3xl font-black text-white uppercase italic tracking-tight mb-2">{room.name}</h3>

                            {/* Valor Principal */}
                            <div className="flex items-baseline gap-2 mb-6">
                                {promoActive && <span className="text-slate-500 text-sm font-bold line-through">{formatBRL(room.rent_value)}</span>}
                                <span className="text-3xl font-black text-rose-500">{formatBRL(promoActive ? room.rent_value - PROMO.discount : room.rent_value)}</span>
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">/ {t.vacanciesSection.perMonth}</span>
                            </div>

                            {/* Grid de Especificações do Cadastro */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800/80">
                                    <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">
                                        <Users size={13} className="text-rose-400" /> {t.roomModal.capacityLabel}
                                    </div>
                                    <div className="text-white text-xs font-bold">
                                        {room.capacity > 1 ? `${room.capacity} ${t.roomModal.shared}` : t.roomModal.individual}
                                    </div>
                                </div>

                                <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800/80">
                                    <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">
                                        <Bath size={13} className="text-rose-400" /> {t.roomModal.bathroomLabel}
                                    </div>
                                    <div className="text-white text-xs font-bold">
                                        {isSuite ? t.roomModal.privateSuite : t.roomModal.sharedBathroom}
                                    </div>
                                </div>

                                <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800/80">
                                    <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">
                                        <ShieldCheck size={13} className="text-rose-400" /> {t.roomModal.entryLabel}
                                    </div>
                                    <div className="text-white text-xs font-bold">
                                        {t.roomModal.entryDetails}
                                    </div>
                                </div>

                                <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800/80">
                                    <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">
                                        <Sparkles size={13} className="text-rose-400" /> {t.roomModal.includedLabel}
                                    </div>
                                    <div className="text-emerald-400 text-xs font-bold">
                                        {t.roomModal.includedDetails}
                                    </div>
                                </div>
                            </div>

                            {/* Descrição Cadastrada */}
                            <div className="mb-6">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-2 flex items-center gap-1.5">
                                    <Info size={13} /> {t.roomModal.descTitle}
                                </h4>
                                <div className="p-4 bg-slate-950/40 border border-slate-800/60 rounded-2xl">
                                    <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-line font-medium">
                                        {room.description || t.roomModal.defaultDesc}
                                    </p>
                                </div>
                            </div>

                            {/* Mobiliário e Inventário Cadastrado */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] flex items-center gap-1.5">
                                        <Sofa size={13} /> {t.roomModal.furnitureTitle}
                                    </h4>
                                </div>

                                {room.furniture && room.furniture.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-2.5 max-h-48 overflow-y-auto pr-1">
                                        {room.furniture.map(item => (
                                            <div key={item.id} className="flex items-center justify-between p-3 bg-slate-950/50 border border-slate-800/70 rounded-xl group">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-slate-900 rounded-lg text-rose-400 border border-slate-800">
                                                        <Sofa size={14} />
                                                    </div>
                                                    <div>
                                                        <div className="text-slate-200 text-xs font-bold uppercase">{item.name}</div>
                                                        {item.description && (
                                                             <div className="text-[10px] text-slate-500">{item.description}</div>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border ${
                                                    item.condition === 'Novo' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    item.condition === 'Bom' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                }`}>
                                                    {item.condition === 'Novo' ? t.roomModal.newBadge : item.condition === 'Bom' ? t.roomModal.goodBadge : t.roomModal.fairBadge}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 bg-slate-950/40 border border-dashed border-slate-800/80 rounded-2xl text-center">
                                        <p className="text-slate-400 text-xs font-medium">
                                            {t.roomModal.furnitureDefault}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Botões de Ação */}
                            <div className="mt-auto pt-4 flex flex-col gap-3">
                                <a
                                    href={`https://wa.me/5521981900803?text=${encodeURIComponent(`Olá! Tenho interesse no ${room.name} (${formatBRL(promoActive ? room.rent_value - PROMO.discount : room.rent_value)}/mês${promoActive ? ', na promoção' : ''}) na MoronaVila. Gostaria de agendar uma visita ou tirar dúvidas!`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2.5 border border-rose-500/40 hover:bg-rose-500/10 text-rose-400 px-6 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all"
                                >
                                    <MessageCircle size={16} /> {t.roomModal.whatsappCta}
                                </a>
                                <button
                                    onClick={() => {
                                        setRegistrationRoom(room);
                                        setShowRegisterForm(true);
                                        setRegistrationStep('simulator');
                                        setSelectedRoom(null);
                                    }}
                                    className="w-full flex items-center justify-center gap-3 bg-rose-600 hover:bg-rose-700 text-white px-6 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-rose-900/40 hover:scale-[1.01] active:scale-98"
                                >
                                    {t.roomModal.simulateCta} <ArrowRight size={16} />
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
                                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">{t.simulatorModal.title}</h3>
                                    <p className="text-slate-400 text-sm max-w-lg mx-auto">
                                        {currentLang === 'pt'
                                            ? (rentalConditions.calculation_instructions || "Informe a data prevista de entrada para simular os valores do seu primeiro mês com total transparência.")
                                            : currentLang === 'es'
                                            ? "Ingrese la fecha prevista de llegada para simular los valores de su primer mes con total transparencia."
                                            : "Enter your expected move-in date to simulate your first month costs with total transparency."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">{t.simulatorModal.step1Title}</label>
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
                                                <Info size={14} /> {t.simulatorModal.step2Title}
                                            </h4>
                                            <p className="text-xs text-slate-300 leading-relaxed italic">
                                                {currentLang === 'pt'
                                                    ? (rentalConditions.rules_summary && !rentalConditions.rules_summary.toLowerCase().includes('devolvido')
                                                        ? rentalConditions.rules_summary
                                                        : t.simulatorModal.depositTransparencyText)
                                                    : t.simulatorModal.depositTransparencyText}
                                            </p>
                                            <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
                                                {t.simulatorModal.proRataRuleNote}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-950/80 border border-slate-800 rounded-[2rem] p-8 space-y-6 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl" />

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-sm gap-3">
                                                <div>
                                                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px] block">{t.simulatorModal.monthlyRent}</span>
                                                    {calculation && (
                                                        <span className="text-[10px] text-slate-500 font-medium">
                                                            {calculation.isHalfMonth
                                                                ? t.simulatorModal.halfMonthBadge
                                                                : `${calculation.daysRemaining} ${t.simulatorModal.proRataDaysSuffix}`}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-white font-black shrink-0">R$ {calculation?.proRata || 0}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{t.simulatorModal.securityDeposit}</span>
                                                <span className="text-white font-black">R$ {calculation?.deposit || 0}</span>
                                            </div>
                                            <div className="flex justify-between items-start text-sm gap-3">
                                                <div>
                                                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px] block">{t.simulatorModal.cleaningFee}</span>
                                                    <span className="text-[10px] text-slate-500 font-medium block leading-snug mt-0.5">
                                                        {t.simulatorModal.keysDamageNote}
                                                    </span>
                                                </div>
                                                <span className="text-white font-black shrink-0">R$ {calculation?.cleaning || 0}</span>
                                            </div>
                                            <div className="h-px bg-slate-800 my-2" />
                                            <div className="flex justify-between items-center">
                                                <span className="text-rose-500 font-black uppercase tracking-widest text-xs">{t.simulatorModal.totalToMoveIn}</span>
                                                <span className="text-3xl font-black text-white tracking-tighter">R$ {calculation?.total || 0}</span>
                                            </div>
                                        </div>

                                        <button
                                            disabled={!entryDate}
                                            onClick={() => setRegistrationStep('form')}
                                            className="w-full flex items-center justify-center gap-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white px-8 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-rose-900/40"
                                        >
                                            {t.simulatorModal.agreeCta} <Check size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {registrationStep === 'form' && (
                            <form onSubmit={handleSignUp} className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
                                <div className="text-center space-y-4">
                                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">{t.simulatorModal.preRegisterTitle}</h3>
                                    <p className="text-slate-400 text-sm">{t.simulatorModal.preRegisterSubtitle} <span className="text-rose-500 font-bold underline">{registrationRoom.name}</span>.</p>
                                </div>

                                <div className="space-y-8">
                                    {/* 1. Dados Pessoais */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] border-b border-rose-500/20 pb-2">1. Dados Pessoais</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <input required placeholder="Nome Completo *" value={regForm.name} onChange={e => setRegForm({...regForm, name: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-rose-500" />
                                            <input required placeholder="CPF / Passport *" value={regForm.cpf} onChange={e => setRegForm({...regForm, cpf: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-rose-500" />
                                            <input required placeholder="Identidade / ID (RG) *" value={regForm.rg} onChange={e => setRegForm({...regForm, rg: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-rose-500" />
                                            <input required placeholder="Telefone / WhatsApp *" value={regForm.phone} onChange={e => setRegForm({...regForm, phone: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-rose-500" />
                                            <input required type="email" placeholder="E-mail *" value={regForm.email} onChange={e => setRegForm({...regForm, email: e.target.value})} className="w-full md:col-span-2 bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-rose-500" />
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
                                        <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] border-b border-rose-500/20 pb-2">4. Perfil Profissional</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <input required placeholder="Profissão / Cargo *" value={regForm.occupation} onChange={e => setRegForm({...regForm, occupation: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-rose-500" />
                                            <input required placeholder="Empresa onde trabalha *" value={regForm.company} onChange={e => setRegForm({...regForm, company: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-rose-500" />
                                            <input required placeholder="Perfil no Instagram (URL ou @) *" value={regForm.instagram} onChange={e => setRegForm({...regForm, instagram: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-rose-500" />
                                            <input placeholder="Perfil no Facebook / LinkedIn (URL ou Nome)" value={regForm.facebook} onChange={e => setRegForm({...regForm, facebook: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-rose-500" />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-3 bg-rose-600 hover:bg-rose-700 text-white px-8 py-6 rounded-full font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl shadow-rose-900/40 hover:scale-[1.02] active:scale-95"
                                >
                                    {t.simulatorModal.preRegisterTitle} <ArrowRight size={20} />
                                </button>
                            </form>
                        )}

                        {registrationStep === 'success' && (
                            <div className="text-center py-16 space-y-8 animate-in zoom-in-95">
                                <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 shadow-lg shadow-emerald-900/10">
                                    <Check size={48} />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">{t.simulatorModal.successTitle}</h3>
                                    <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
                                        {t.simulatorModal.successText}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowRegisterForm(false)}
                                    className="px-12 py-5 bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest rounded-full border border-white/10 transition-all"
                                >
                                    {t.simulatorModal.backToHome}
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-2 lg:gap-4">
                    <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                        <div className="p-2 bg-gradient-to-tr from-rose-600 to-rose-500 rounded-xl text-white shadow-lg shadow-rose-900/40">
                            <Home size={22} />
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase italic leading-none">
                                MORONA<span className="text-rose-600">VILA</span>
                            </h1>
                            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">Residencial</span>
                        </div>
                    </div>

                    <nav className="hidden md:flex items-center gap-2.5 lg:gap-3.5 xl:gap-5 flex-nowrap shrink-0">
                        <a href="#unidades" className="text-[10px] xl:text-[11px] font-bold text-slate-300 hover:text-white uppercase tracking-wider whitespace-nowrap transition-colors">{t.nav.units}</a>
                        <a href="#comodidades" className="text-[10px] xl:text-[11px] font-bold text-slate-300 hover:text-white uppercase tracking-wider whitespace-nowrap transition-colors">{t.nav.amenities}</a>
                        <a href="#localizacao" className="text-[10px] xl:text-[11px] font-bold text-slate-300 hover:text-white uppercase tracking-wider whitespace-nowrap transition-colors">{t.nav.location}</a>
                        <a href="#vagas" className="text-[10px] xl:text-[11px] font-bold text-slate-300 hover:text-white uppercase tracking-wider whitespace-nowrap transition-colors">{t.nav.vacancies}</a>
                        <a href="#comparativo" className="text-[10px] xl:text-[11px] font-bold text-slate-300 hover:text-white uppercase tracking-wider whitespace-nowrap transition-colors">{t.nav.comparison}</a>
                        <a
                            href="#regras"
                            onClick={onOpenRules ? (e) => { e.preventDefault(); onOpenRules(); } : undefined}
                            className="text-[10px] xl:text-[11px] font-bold text-amber-400 hover:text-amber-300 uppercase tracking-wider whitespace-nowrap transition-colors"
                        >
                            {t.nav.rules}
                        </a>
                        <a href="#contato" className="text-[10px] xl:text-[11px] font-bold text-rose-500 hover:text-rose-400 uppercase tracking-wider whitespace-nowrap transition-colors">{t.nav.scheduleVisit}</a>
                    </nav>

                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        {/* Seletor de Idiomas (Português, Inglês, Espanhol) */}
                        <LanguageSelector
                            currentLang={currentLang}
                            onLanguageChange={setCurrentLang}
                        />

                        <a
                            href="https://wa.me/5521981900803?text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20as%20vagas%20na%20MoronaVila"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                            <MessageCircle size={14} /> {t.nav.whatsapp}
                        </a>

                        {isLoggedIn && currentUser ? (
                            <button
                                onClick={onGoToDashboard || onLoginClick}
                                className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-lg shadow-rose-900/40 hover:scale-105"
                            >
                                <User size={15} className="shrink-0" />
                                <div className="flex flex-col items-start leading-tight text-left">
                                    <span className="text-[7.5px] font-bold uppercase tracking-wider text-rose-200">{t.nav.accessPrefix}</span>
                                    <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-white">{t.nav.residentAccess}</span>
                                </div>
                                <ChevronRight size={13} className="shrink-0 text-white/70 -ml-0.5" />
                            </button>
                        ) : (
                            <button
                                onClick={onLoginClick}
                                className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-white/10 hover:bg-rose-600 text-white transition-all border border-white/20 hover:border-rose-500 shadow-md hover:shadow-rose-900/30 group"
                            >
                                <User size={15} className="text-rose-400 group-hover:text-white shrink-0" />
                                <div className="flex flex-col items-start leading-tight text-left">
                                    <span className="text-[7.5px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-rose-100">{t.nav.accessPrefix}</span>
                                    <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-white">{t.nav.residentAccess}</span>
                                </div>
                                <ChevronRight size={13} className="text-slate-400 group-hover:text-white shrink-0 -ml-0.5" />
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
                                <MapPin size={13} /> {t.hero.addressBadge}
                            </span>
                            <span className="px-3 py-1.5 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/10">
                                {t.hero.silenceBadge}
                            </span>
                            <span className="px-3 py-1.5 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/10">
                                {t.hero.organizedBadge}
                            </span>
                            <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-emerald-500/30">
                                {t.hero.noGuarantorBadge}
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
                                href="#unidades"
                                className="inline-flex items-center gap-3 bg-rose-600 hover:bg-rose-700 text-white px-8 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl shadow-rose-900/50 hover:scale-105 active:scale-95"
                            >
                                {t.hero.viewUnitsCta} {formatBRL(fromPrice)} <ArrowRight size={18} />
                            </a>
                            <a
                                href="#localizacao"
                                className="inline-flex items-center gap-3 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white px-8 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all border border-slate-700 hover:border-slate-500 backdrop-blur-md"
                            >
                                <MapPin size={18} className="text-rose-500" /> {t.hero.mapCta}
                            </a>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
                            <div>
                                <div className="text-2xl font-black text-white">{t.hero.stats.downtownTime}</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.hero.stats.downtownLabel}</div>
                            </div>
                            <div>
                                <div className="text-2xl font-black text-rose-400">{t.hero.stats.uerjTime}</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.hero.stats.uerjLabel}</div>
                            </div>
                            <div>
                                <div className="text-2xl font-black text-amber-400">{t.hero.stats.metroTime}</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.hero.stats.metroLabel}</div>
                            </div>
                            <div>
                                <div className="text-2xl font-black text-emerald-400">{t.hero.stats.zeroBureaucracy}</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.hero.stats.zeroBureaucracyLabel}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEÇÃO 0: LINHA DE UNIDADES E PREÇOS */}
            <section id="unidades" className="py-28 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-16 max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-black uppercase tracking-[0.2em] mb-4">
                            <Home size={14} /> {t.unitsSection.tag}
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase italic mb-4">
                            {t.unitsSection.titlePrefix} <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-400">{formatBRL(fromPrice)}</span>
                        </h2>
                        <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                            {t.unitsSection.subtitle}
                        </p>
                    </div>

                    {promoActive && (
                        <div className="mb-10 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 text-center bg-gradient-to-r from-rose-600/20 to-amber-500/20 border border-rose-500/40 rounded-3xl px-6 py-4">
                            <span className="px-3 py-1 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shrink-0">{t.unitsSection.promoBadge}</span>
                            <span className="text-sm text-slate-200 font-bold">
                                {t.unitsSection.promoText}
                            </span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {PRODUCTS.map((product, idx) => {
                            const Icon = product.icon;
                            const localized = t.products[idx] || t.products[0];
                            return (
                                <div key={product.name} className="bg-slate-900/60 border border-slate-800 rounded-[2rem] p-7 flex flex-col hover:border-rose-500/40 transition-all">
                                    <div className="p-3 bg-rose-500/10 text-rose-400 rounded-2xl w-fit mb-5">
                                        <Icon size={24} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{localized.audience}</span>
                                    <h3 className="text-xl font-black text-white uppercase italic tracking-tight mt-1 mb-3">{localized.name}</h3>
                                    <div className="mb-4">
                                        {promoActive && (
                                            <span className="block text-slate-500 text-sm font-bold line-through">{formatBRL(product.price)}</span>
                                        )}
                                        <span className="text-3xl font-black text-rose-500">{formatBRL(promoActive ? product.price - PROMO.discount : product.price)}</span>
                                        <span className="text-slate-400 text-[11px] font-bold ml-1">{t.unitsSection.perMonth}{product.couplePrice ? '' : ` • ${t.unitsSection.upToTwoPeople}`}</span>
                                        {product.couplePrice && (
                                            <span className="block text-slate-400 text-[11px] font-bold mt-1">
                                                {t.unitsSection.coupleText}: {formatBRL(promoActive ? product.couplePrice - PROMO.discount : product.couplePrice)}{t.unitsSection.perMonth}
                                            </span>
                                        )}
                                        {promoActive && (
                                            <span className="block text-amber-400 text-[10px] font-black uppercase tracking-widest mt-2">{t.unitsSection.forPromoMonths}</span>
                                        )}
                                    </div>
                                    <p className="text-slate-300 text-sm leading-relaxed mb-5 italic">"{localized.promise}"</p>
                                    <ul className="space-y-2 mt-auto">
                                        {localized.features.map(feature => (
                                            <li key={feature} className="flex items-start gap-2 text-xs text-slate-300">
                                                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" /> {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-10 flex flex-wrap justify-center gap-4">
                        <a
                            href="#vagas"
                            className="inline-flex items-center gap-3 bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-rose-900/40"
                        >
                            {t.unitsSection.viewAvailableCta} <ArrowRight size={16} />
                        </a>
                        <a
                            href="https://wa.me/5521981900803?text=Ol%C3%A1%21%20Quero%20reservar%20uma%20unidade%20renovada%20da%20MoronaVila%20com%20pre%C3%A7o%20de%20lan%C3%A7amento."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 bg-slate-900/80 hover:bg-slate-800 text-slate-200 px-8 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all border border-slate-700"
                        >
                            <MessageCircle size={16} className="text-emerald-400" /> {t.unitsSection.reserveRenovatedCta}
                        </a>
                    </div>
                </div>
            </section>

            {/* SEÇÃO 1: COMODIDADES & ÁREAS COMUNS (COM FOTOS REAIS) */}
            <section id="comodidades" className="py-28 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <AmenitiesShowcase
                        currentLang={currentLang}
                        onSelectRoom={() => {
                            const el = document.getElementById('vagas');
                            el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    />
                </div>
            </section>

            {/* SEÇÃO 2: MAPA INTERATIVO E RADAR DE VILA ISABEL */}
            <section id="localizacao" className="py-28 bg-slate-900/30 border-y border-white/5 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-full max-h-96 bg-rose-600/5 rounded-full blur-[140px] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <InteractiveMap currentLang={currentLang} />
                </div>
            </section>

            {/* SEÇÃO 3: ACOMODAÇÕES & QUARTOS DISPONÍVEIS */}
            <section id="vagas" className="py-28 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-16 max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-black uppercase tracking-[0.2em] mb-4">
                            <Home size={14} /> {t.vacanciesSection.tag}
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase italic mb-4">
                            {t.vacanciesSection.titlePrefix} <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-400">{t.vacanciesSection.titleHighlight}</span>
                        </h2>
                        <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                            {t.vacanciesSection.subtitle}
                        </p>
                    </div>

                    {(() => {
                        const availableRooms = rooms.filter(
                            room => !room.is_common_area && room.availability_status === 'Disponível' && !room.is_blocked_for_repairs
                        );

                        if (availableRooms.length === 0) {
                            return (
                                <div className="p-12 text-center bg-slate-900/40 rounded-[2.5rem] border border-slate-800 max-w-xl mx-auto">
                                    <Home size={40} className="text-rose-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-black text-white uppercase mb-2">{t.vacanciesSection.noVacanciesTitle}</h3>
                                    <p className="text-slate-400 text-sm mb-6">{t.vacanciesSection.noVacanciesText}</p>
                                    <a
                                        href="https://wa.me/5521981900803?text=Gostaria%20de%20saber%20sobre%20as%20pr%C3%B3ximas%20vagas%20dispon%C3%ADveis%20na%20MoronaVila"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-widest transition-all"
                                    >
                                        <MessageCircle size={16} /> {t.vacanciesSection.waitingListCta}
                                    </a>
                                </div>
                            );
                        }

                        return (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {availableRooms.map(room => {
                                    const roomThumb = room.media && room.media[0] ? room.media[0].url : '/fotos/98905_0gMXlxxyf06MJQMP.jpg';
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
                                                    {room.capacity > 1 ? `${room.type} (${room.capacity} ${t.vacanciesSection.shared})` : (room.type || t.vacanciesSection.individual)}{(room as any).suite ? ` • ${t.vacanciesSection.suiteBadge}` : ''}
                                                </div>

                                                <div className="absolute top-4 right-4 bg-slate-950/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                                                    <span className="text-white font-black text-lg">{formatBRL(promoActive ? room.rent_value - PROMO.discount : room.rent_value)}</span>
                                                    <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest ml-1">{t.vacanciesSection.perMonth}</span>
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
                                                        {t.vacanciesSection.viewDetailsCta} <ArrowRight size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })()}
                </div>
            </section>

            {/* SEÇÃO 4: COMPARATIVO DE CUSTO-BENEFÍCIO */}
            <section id="comparativo" className="py-28 bg-slate-900/30 border-y border-white/5 relative">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-rose-500 text-xs font-black uppercase tracking-[0.25em]">{t.comparisonSection.tag}</span>
                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tight mt-2 mb-4">
                            {t.comparisonSection.title}
                        </h2>
                        <p className="text-slate-400 text-base max-w-2xl mx-auto">
                            {t.comparisonSection.subtitle}
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
                                    <h3 className="text-xl font-black text-white uppercase">{t.comparisonSection.traditional.title}</h3>
                                    <span className="text-xs text-slate-500">{t.comparisonSection.traditional.type}</span>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm text-slate-400 border-t border-slate-800 pt-6">
                                <div className="flex justify-between py-1"><span>{t.comparisonSection.traditional.rentIptu}</span><span className="text-slate-300 font-bold">R$ 1.200 - 1.800</span></div>
                                <div className="flex justify-between py-1"><span>{t.comparisonSection.traditional.condo}</span><span className="text-slate-300 font-bold">R$ 400 - 800</span></div>
                                <div className="flex justify-between py-1"><span>{t.comparisonSection.traditional.electricity}</span><span className="text-slate-300 font-bold">R$ 150 - 300</span></div>
                                <div className="flex justify-between py-1"><span>{t.comparisonSection.traditional.waterGas}</span><span className="text-slate-300 font-bold">R$ 100 - 180</span></div>
                                <div className="flex justify-between py-1"><span>{t.comparisonSection.traditional.internet}</span><span className="text-slate-300 font-bold">R$ 120 - 180</span></div>
                                <div className="flex justify-between py-1"><span>{t.comparisonSection.traditional.furniture}</span><span className="text-red-400 font-bold">R$ 5.000 a 10.000+</span></div>
                                <div className="flex justify-between py-1"><span>{t.comparisonSection.traditional.guarantor}</span><span className="text-red-400 font-bold">Obrigatório / Difícil</span></div>
                            </div>

                            <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 italic">
                                {t.comparisonSection.traditional.note}
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
                                    <h3 className="text-xl font-black text-white uppercase">{t.comparisonSection.moronavila.title}</h3>
                                    <span className="text-xs text-rose-400 font-bold">{t.comparisonSection.moronavila.subtitle}</span>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm text-slate-300 border-t border-rose-500/20 pt-6">
                                <div className="flex items-center justify-between py-1">
                                    <span className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> {t.comparisonSection.moronavila.furnishedUnit}</span>
                                    <span className="text-white font-black">A partir de {formatBRL(fromPrice)}</span>
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <span className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> {t.comparisonSection.moronavila.noCondoIptu}</span>
                                    <span className="text-white font-black">{t.comparisonSection.moronavila.noFee}</span>
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <span className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> {t.comparisonSection.moronavila.electricityWater}</span>
                                    <span className="text-white font-black">Só o que você usa*</span>
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <span className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> {t.comparisonSection.moronavila.wifi}</span>
                                    <span className="text-white font-black">{t.comparisonSection.moronavila.included}</span>
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <span className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> {t.comparisonSection.moronavila.kitchen}</span>
                                    <span className="text-white font-black">{t.comparisonSection.moronavila.included}</span>
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <span className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> {t.comparisonSection.moronavila.cleaning}</span>
                                    <span className="text-white font-black">{t.comparisonSection.moronavila.included}</span>
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <span className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> {t.comparisonSection.moronavila.intercom}</span>
                                    <span className="text-white font-black">{t.comparisonSection.moronavila.included}</span>
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <span className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> {t.comparisonSection.moronavila.guarantor}</span>
                                    <span className="text-emerald-400 font-black">{t.comparisonSection.moronavila.flexible}</span>
                                </div>
                            </div>

                            <div className="text-[11px] text-slate-400 italic leading-relaxed">
                                {t.comparisonSection.moronavila.meterNote}
                            </div>

                            <a
                                href="#vagas"
                                className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-rose-900/40"
                            >
                                {t.comparisonSection.moronavila.chooseRoomCta} <ArrowRight size={16} />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEÇÃO 5: REGRAS E FILOSOFIA */}
            <section id="regras" className="py-24 relative scroll-mt-20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center justify-center p-5 rounded-[2rem] bg-gradient-to-br from-amber-500/20 to-amber-700/10 text-amber-500 shadow-xl border border-amber-500/20 mb-8">
                        <Shield size={36} />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic mb-4">{t.rulesSection.title}</h2>
                    <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                        {t.rulesSection.subtitle}
                    </p>
                    <div className="text-left p-8 md:p-12 bg-slate-900/40 backdrop-blur-sm shadow-xl rounded-[2.5rem] border border-slate-800 space-y-4">
                        {t.rulesSection.rulesList.map(rule => (
                            <div key={rule} className="flex items-start gap-3 text-sm md:text-base text-slate-200">
                                <CheckCircle2 size={18} className="text-amber-400 shrink-0 mt-0.5" /> {rule}
                            </div>
                        ))}
                        <div className="pt-4 mt-4 border-t border-slate-800 text-xs md:text-sm text-slate-400 leading-relaxed">
                            {t.rulesSection.cctvNote}
                        </div>
                    </div>
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={onOpenRules ? onOpenRules : () => { window.location.hash = '#regras'; }}
                            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-black uppercase tracking-widest transition-all hover:scale-105 shadow-lg shadow-amber-950/20 cursor-pointer"
                        >
                            <FileText size={15} /> {t.rulesSection.rulesAndRegisterCta}
                        </button>
                        <a
                            href="https://forms.gle/nQnbXWZgQesmoUmm6"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-black uppercase tracking-widest transition-all hover:scale-105"
                        >
                            <ExternalLink size={15} /> {t.rulesSection.googleFormsCta}
                        </a>
                    </div>
                </div>
            </section>

            {/* SEÇÃO 6: PERGUNTAS FREQUENTES (FAQ) */}
            <section className="py-24 bg-slate-900/20 border-t border-white/5">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-rose-500 text-xs font-black uppercase tracking-[0.25em]">{t.faqSection.tag}</span>
                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tight mt-2 mb-4">
                            {t.faqSection.title}
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {t.faqSection.items.map((faq, idx) => {
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
                                        <div className="px-6 pb-6 text-slate-300 text-sm leading-relaxed border-t border-slate-800/60 pt-4 whitespace-pre-line">
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
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic mb-4">{t.contactSection.title}</h2>
                        <p className="text-lg text-slate-300 font-medium max-w-xl mx-auto">
                            {t.contactSection.subtitle}
                        </p>
                    </div>

                    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                        {!leadSubmitted ? (
                            <form onSubmit={handleLeadSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">{t.contactSection.formNameLabel}</label>
                                        <input
                                            required
                                            type="text"
                                            value={leadForm.name}
                                            onChange={e => setLeadForm({ ...leadForm, name: e.target.value })}
                                            placeholder={t.contactSection.formNamePlaceholder}
                                            className="w-full bg-slate-950/50 border border-slate-800 rounded-full px-6 py-4 text-white focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">{t.contactSection.formPhoneLabel}</label>
                                        <input
                                            required
                                            type="tel"
                                            value={leadForm.phone}
                                            onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })}
                                            placeholder={t.contactSection.formPhonePlaceholder}
                                            className="w-full bg-slate-950/50 border border-slate-800 rounded-full px-6 py-4 text-white focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">{t.contactSection.formEmailLabel}</label>
                                    <input
                                        required
                                        type="email"
                                        value={leadForm.email}
                                        onChange={e => setLeadForm({ ...leadForm, email: e.target.value })}
                                        placeholder={t.contactSection.formEmailPlaceholder}
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-full px-6 py-4 text-white focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 outline-none transition-all"
                                    />
                                </div>
                                <button type="submit" className="w-full flex items-center justify-center gap-3 bg-rose-600 hover:bg-rose-700 text-white px-8 py-5 rounded-full font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl shadow-rose-900/40 hover:scale-105 active:scale-95 mt-8">
                                    {t.contactSection.startChatCta} <Send size={18} />
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
                                        href={`https://wa.me/5521981900803?text=${encodeURIComponent(`Olá, meu nome é ${leadForm.name} e acabei de conhecer a MoronaVila! Gostaria de agendar uma visita e tirar dúvidas.`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all shadow-lg hover:scale-105 active:scale-95"
                                    >
                                        <MessageCircle size={16} /> {t.contactSection.whatsappConsultantCta}
                                    </a>
                                </div>
                                <form onSubmit={handleSendMessage} className="p-4 bg-slate-950/60 border-t border-white/5 flex gap-3">
                                    <input
                                        type="text"
                                        value={currentMessage}
                                        onChange={e => setCurrentMessage(e.target.value)}
                                        placeholder={t.contactSection.chatPlaceholder}
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
                            {t.footer.desc}
                        </p>
                    </div>

                    <div className="text-left md:text-center space-y-2 text-xs text-slate-400">
                        <div className="font-bold text-slate-200">{t.footer.addressTitle}</div>
                        <div>{t.footer.addressLine1}</div>
                        <div>{t.footer.addressLine2}</div>
                        <div className="pt-2 flex flex-col items-center gap-1">
                            <button
                                onClick={onOpenRules ? onOpenRules : () => { window.location.hash = '#regras'; }}
                                className="text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                                <FileText size={12} /> {t.footer.rulesLink}
                            </button>
                            <a
                                href="https://forms.gle/nQnbXWZgQesmoUmm6"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-slate-200 text-[11px] inline-flex items-center gap-1 transition-colors"
                            >
                                <ExternalLink size={10} /> {t.footer.formsLink}
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-3">
                        <button
                            onClick={isLoggedIn && onGoToDashboard ? onGoToDashboard : onLoginClick}
                            className="px-6 py-3 rounded-full bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-black uppercase tracking-widest border border-rose-500/30 transition-all flex items-center gap-2"
                        >
                            <User size={14} />
                            <span>{isLoggedIn ? t.footer.dashboardBtn : t.footer.loginBtn}</span>
                        </button>
                        <p className="text-slate-600 font-bold text-[10px] uppercase tracking-widest">
                            {t.footer.rights}
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
