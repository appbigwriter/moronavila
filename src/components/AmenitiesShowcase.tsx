import React, { useState } from 'react';
import {
    Utensils, BookOpen, Coffee, Sparkles, ShieldCheck,
    Wifi, CheckCircle2, Droplets, Zap, Brush, Wrench,
    Smartphone, ArrowRight, Eye, ChevronLeft, ChevronRight
} from 'lucide-react';

interface AmenityCategory {
    id: string;
    title: string;
    shortTitle: string;
    icon: any;
    badge: string;
    subtitle: string;
    description: string;
    images: string[];
    features: string[];
    benefit: string;
}

const AMENITY_DATA: AmenityCategory[] = [
    {
        id: 'quartos',
        title: 'Quartos Mobiliados & Privativos',
        shortTitle: 'Quartos Mobiliados',
        icon: Sparkles,
        badge: 'Privacidade & Conforto',
        subtitle: 'Acomodações prontas para morar com foco e tranquilidade',
        description: 'Quartos privativos planejados para estudantes e profissionais, com cama confortável, escrivaninha de estudos, armário, ar-condicionado e ventilação natural.',
        images: [
            '/fotos/98905_0gMXlxxyf06MJQMP.jpg',
            '/fotos/98905_CYCX7spXgRfrsz7H.jpg',
            '/fotos/98905_JRni84qYdUydS9eF.jpg',
            '/fotos/98905_r9U1krISShnTliUA (1).jpg',
            '/fotos/98905_Z6otj5s5Fg0NeCYF.jpg'
        ],
        features: [
            'Cama confortável e colchão de alta densidade',
            'Guarda-roupa amplo e escrivaninha de estudos no quarto',
            'Opções de suítes privativas ou banheiros compartilhados otimizados',
            'Janelas com ventilação natural e ambiente silencioso'
        ],
        benefit: 'Mudança instantânea no mesmo dia, sem gastar milhares de reais com frete ou compra de móveis.'
    },
    {
        id: 'cozinha',
        title: 'Cozinha Gourmet & Totalmente Equipada',
        shortTitle: 'Cozinha Gourmet',
        icon: Utensils,
        badge: 'Praticidade & Economia',
        subtitle: 'Tudo pronto para você preparar suas refeições com conforto',
        description: 'Ampla cozinha planejada equipada com eletrodomésticos modernos, bancadas espaçosas, geladeiras, micro-ondas, cooktops e armários com espaços dedicados para cada residente.',
        images: [
            '/fotos/98905_u8EOBdAE1TXcvbZE.jpg',
            '/fotos/vprimage10_cozinha.jpg'
        ],
        features: [
            'Eletrodomésticos modernos (geladeiras, micro-ondas, fogões)',
            'Utensílios completos e bancada para refeições rápidas',
            'Espaço individual de despensa/armário identificado',
            'Limpeza periódica de suporte inclusa'
        ],
        benefit: 'Economize tempo e dinheiro cozinhando em casa sem precisar comprar nenhum utensílio ou eletrodoméstico.'
    },
    {
        id: 'convivencia',
        title: 'Área Externa & Convivência',
        shortTitle: 'Área Externa & Convivência',
        icon: Coffee,
        badge: 'Descompressão & Bem-Estar',
        subtitle: 'Espaço ao ar livre para relaxar, tomar ar fresco e socializar',
        description: 'Ambiente externo arejado com mesas e bancos para ler um livro ao sol, descontrair com os colegas de casa ou tomar um café da manhã ao ar livre.',
        images: [
            '/fotos/vprimage1.jpg',
            '/fotos/vprimage4.jpg',
            '/fotos/vprimage5.jpg',
            '/fotos/vprimage6.jpg',
            '/fotos/vprimage7.jpg',
            '/fotos/vprimage8.jpg',
            '/fotos/vprimage9_areaexterna2.jpg',
            '/fotos/vprimage9_areaexterna.jpg',
            '/fotos/vprimage9_areaexterna3.jpg'
        ],
        features: [
            'Ambiente aberto e bem ventilado',
            'Mesas para descanso e socialização tranquila',
            'Área verde e iluminação acolhedora',
            'Espaço seguro dentro dos limites da propriedade'
        ],
        benefit: 'Equilíbrio mental garantido após um dia intenso de estudos ou trabalho.'
    },
    {
        id: 'estudos',
        title: 'Sala de Estudos & Coworking',
        shortTitle: 'Coworking & Estudos',
        icon: BookOpen,
        badge: 'Foco & Produtividade',
        subtitle: 'Ambiente silencioso, iluminado e planejado para alto rendimento',
        description: 'Espaço exclusivo com mesas amplas, iluminação adequada para leitura prolongada, tomadas individuais para notebooks e conexão Wi-Fi de fibra óptica com alta velocidade e baixa latência.',
        images: [
            '/fotos/vprimage3_saladeestudos.jpg',
            '/fotos/vprimage3_saladeestudos2.jpg'
        ],
        features: [
            'Mesas espaçosas e cadeiras confortáveis',
            'Iluminação focada e tomadas ao alcance das mãos',
            'Wi-Fi dedicado de alta performance para aulas e reuniões',
            'Regras de silêncio rigorosas para máxima concentração'
        ],
        benefit: 'Perfeito para estudantes da UERJ/HUPE e profissionais remotos que precisam de disciplina e foco diário.'
    },
    {
        id: 'seguranca',
        title: 'Entrada Inteligente & Tecnologia',
        shortTitle: 'Segurança & Interfonia',
        icon: ShieldCheck,
        badge: 'Tranquilidade 24h',
        subtitle: 'Acesso seguro e interfone individualizado (Em breve)',
        description: 'Fachada moderna e segura na Rua Torres Homem com controle de acesso, monitoramento e sistema exclusivo de interfonia individualizada que permitirá atender portaria e entregas diretamente com comodidade.',
        images: [
            '/fotos/vprimage11_entrada.jpg'
        ],
        features: [
            'Entrada segura e identificada',
            'Interfone individualizado para cada morador (Em breve)',
            'Câmeras de monitoramento nas áreas comuns',
            'Aplicativo exclusivo para moradores abrirem chamados e reservas'
        ],
        benefit: 'Sensação total de segurança para você e tranquilidade absoluta para sua família.'
    }
];

const INCLUDED_BENEFITS = [
    { icon: Zap, title: 'Energia Elétrica', desc: 'Sem surpresa na conta de luz' },
    { icon: Droplets, title: 'Água & Esgoto', desc: 'Consumo totalmente incluso' },
    { icon: Wifi, title: 'Wi-Fi Ultra-Rápido', desc: 'Fibra óptica de alta velocidade' },
    { icon: Brush, title: 'Limpeza Semanal', desc: 'Áreas comuns sempre limpas' },
    { icon: Wrench, title: 'Manutenção Ágil', desc: 'Suporte rápido direto no app' },
    { icon: Smartphone, title: 'App do Morador', desc: 'Lavanderia, avisos e interfone (em breve)' }
];

export function AmenitiesShowcase({ onSelectRoom }: { onSelectRoom?: () => void }) {
    const [activeTab, setActiveTab] = useState<string>('cozinha');
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

    const activeAmenity = AMENITY_DATA.find(a => a.id === activeTab) || AMENITY_DATA[0];

    const handleTabChange = (id: string) => {
        setActiveTab(id);
        setCurrentImageIndex(0);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % activeAmenity.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + activeAmenity.images.length) % activeAmenity.images.length);
    };

    return (
        <div className="w-full space-y-20">
            {/* Header das Amenidades */}
            <div className="text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-black uppercase tracking-[0.2em] mb-4">
                    <Sparkles size={14} /> Espaços & Facilidades
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tight mb-4">
                    Comodidades pensadas para <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-400">sua rotina e conforto</span>
                </h2>
                <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                    Aqui você não aluga apenas um quarto, você ganha acesso a uma casa completa e organizada, pronta para você viver bem desde o primeiro dia.
                </p>
            </div>

            {/* Abas de Navegação das Áreas */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar justify-start md:justify-center">
                {AMENITY_DATA.map(amenity => {
                    const Icon = amenity.icon;
                    const isSelected = activeTab === amenity.id;
                    return (
                        <button
                            key={amenity.id}
                            onClick={() => handleTabChange(amenity.id)}
                            className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider whitespace-nowrap transition-all duration-300 border ${
                                isSelected
                                    ? 'bg-rose-600 text-white border-rose-500 shadow-xl shadow-rose-900/30 scale-105'
                                    : 'bg-slate-900/70 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                            }`}
                        >
                            <Icon size={18} className={isSelected ? 'text-white' : 'text-rose-500'} />
                            {amenity.shortTitle}
                        </button>
                    );
                })}
            </div>

            {/* Showcase Visual em Destaque */}
            <div className="bg-slate-900/50 border border-slate-800/90 rounded-[3rem] p-6 md:p-12 overflow-hidden relative shadow-2xl backdrop-blur-xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                    {/* Visual / Carrossel de Fotos Reais (7 colunas) */}
                    <div className="lg:col-span-7 flex flex-col gap-4">
                        <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-slate-950 group">
                            <img
                                src={activeAmenity.images[currentImageIndex]}
                                alt={activeAmenity.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                            {/* Badge sobre a imagem */}
                            <div className="absolute top-5 left-5 bg-slate-950/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-rose-400">
                                {activeAmenity.badge}
                            </div>

                            {/* Controles do Carrossel de Fotos */}
                            {activeAmenity.images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-950/70 hover:bg-rose-600 text-white border border-white/10 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-950/70 hover:bg-rose-600 text-white border border-white/10 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                                        {activeAmenity.images.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentImageIndex(idx)}
                                                className={`w-2 h-2 rounded-full transition-all ${
                                                    currentImageIndex === idx ? 'w-6 bg-rose-500' : 'bg-white/40'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Miniaturas de Fotos */}
                        {activeAmenity.images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto no-scrollbar">
                                {activeAmenity.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`relative w-24 aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                                            currentImageIndex === idx
                                                ? 'border-rose-500 scale-105 shadow-md shadow-rose-900/40'
                                                : 'border-transparent opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Conteúdo & Benefícios (5 colunas) */}
                    <div className="lg:col-span-5 space-y-6">
                        <div>
                            <span className="text-rose-500 text-xs font-black uppercase tracking-[0.25em]">
                                {activeAmenity.badge}
                            </span>
                            <h3 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tight mt-1 mb-3">
                                {activeAmenity.title}
                            </h3>
                            <p className="text-slate-300 text-base leading-relaxed font-medium">
                                {activeAmenity.description}
                            </p>
                        </div>

                        {/* Lista de Features com checkmarks */}
                        <div className="space-y-3 pt-2">
                            {activeAmenity.features.map((feat, idx) => (
                                <div key={idx} className="flex items-start gap-3 text-sm text-slate-200">
                                    <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                                        <CheckCircle2 size={16} />
                                    </div>
                                    <span>{feat}</span>
                                </div>
                            ))}
                        </div>

                        {/* Card de Benefício Prático */}
                        <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-2xl relative overflow-hidden">
                            <div className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1 flex items-center gap-1.5">
                                <Sparkles size={12} /> Benefício Direto
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-medium">
                                {activeAmenity.benefit}
                            </p>
                        </div>

                        {onSelectRoom && (
                            <button
                                onClick={onSelectRoom}
                                className="inline-flex items-center gap-3 bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-rose-900/40 hover:scale-105 active:scale-95"
                            >
                                Ver Vagas Disponíveis <ArrowRight size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Banner: "Tudo Incluso na sua Mensalidade" */}
            <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-indigo-950/40 border border-rose-500/20 rounded-[3rem] p-8 md:p-14 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-3xl mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-3">
                        <CheckCircle2 size={14} /> Zero Surpresas no Final do Mês
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tight mb-3">
                        Tudo em uma única conta, sem burocracia
                    </h3>
                    <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                        Esqueça a dor de cabeça de negociar com imobiliárias, pagar condomínio à parte, IPTU, taxas extras ou ter que comprar geladeira e fogão.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {INCLUDED_BENEFITS.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div key={idx} className="p-5 bg-slate-950/60 border border-slate-800/80 rounded-2xl flex flex-col items-center text-center group hover:border-rose-500/40 transition-all">
                                <div className="p-3.5 rounded-xl bg-rose-500/10 text-rose-400 mb-3 group-hover:scale-110 group-hover:bg-rose-600 group-hover:text-white transition-all">
                                    <Icon size={22} />
                                </div>
                                <h4 className="text-xs font-bold text-white uppercase mb-1">{item.title}</h4>
                                <p className="text-[10px] text-slate-400 leading-tight">{item.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
