import React, { useState } from 'react';
import {
    MapPin, Navigation, ShoppingBag, Utensils, GraduationCap,
    HeartPulse, Music, Compass, ExternalLink, Clock, Bike,
    Car, Footprints, Layers, Sparkles, Building2
} from 'lucide-react';

export interface Place {
    id: string;
    name: string;
    category: 'shopping' | 'food' | 'culture' | 'education' | 'health' | 'leisure' | 'market' | 'transit';
    distance: string;
    walkTime: string;
    bikeTime: string;
    carTime: string;
    description: string;
    highlight?: string;
    // Posição no radar estilizado (x, y de -100 a +100 relativos ao centro)
    radarPos: { x: number; y: number };
    addressQuery: string;
}

const PLACES_DATA: Place[] = [
    {
        id: 'praca-sete',
        name: 'Praça Sete',
        category: 'leisure',
        distance: '100 metros',
        walkTime: '1 min',
        bikeTime: '< 1 min',
        carTime: '1 min',
        description: 'Ponto de encontro vibrante do bairro, com quiosques, lazer ao ar livre e vida noturna.',
        highlight: 'Ao virar a esquina',
        radarPos: { x: 28, y: -26 },
        addressQuery: 'Praca Barao de Drummond Vila Isabel Rio de Janeiro'
    },
    {
        id: 'parme',
        name: 'Pizzaria Parmê',
        category: 'food',
        distance: '100 metros',
        walkTime: '1 min',
        bikeTime: '< 1 min',
        carTime: '1 min',
        description: 'A tradicional e famosa pizzaria carioca com rodízio, tortas e lanches na 28 de Setembro.',
        highlight: 'Tradição carioca',
        radarPos: { x: -30, y: -20 },
        addressQuery: 'Parme Boulevard 28 de Setembro Vila Isabel Rio de Janeiro'
    },
    {
        id: 'unidos-vila-isabel',
        name: 'Unidos de Vila Isabel',
        category: 'culture',
        distance: '150 metros',
        walkTime: '2 min',
        bikeTime: '1 min',
        carTime: '1 min',
        description: 'Templo do samba carioca na Av. 28 de Setembro. Ensaios, eventos culturais e história.',
        highlight: 'Cultura & Samba',
        radarPos: { x: -52, y: -48 },
        addressQuery: 'Quadra Unidos de Vila Isabel Av 28 de Setembro'
    },
    {
        id: 'supermercado-extra',
        name: 'Supermercado Extra',
        category: 'market',
        distance: '150 metros',
        walkTime: '2 min',
        bikeTime: '1 min',
        carTime: '1 min',
        description: 'Supermercado completo, padaria, açougue e farmácias para resolver tudo do seu dia a dia.',
        highlight: 'Praticidade total',
        radarPos: { x: -36, y: 38 },
        addressQuery: 'Supermercado Extra Boulevard 28 de Setembro Vila Isabel'
    },
    {
        id: 'vila-gourmet',
        name: 'Vila Gourmet',
        category: 'food',
        distance: '150 metros',
        walkTime: '2 min',
        bikeTime: '1 min',
        carTime: '1 min',
        description: 'Polo gastronômico a céu aberto com dezenas de food trucks, hambúrgueres artesanais e chopp.',
        highlight: 'Dezenas de Food Trucks',
        radarPos: { x: 34, y: 32 },
        addressQuery: 'Espaco Vila Gourmet Vila Isabel Rio de Janeiro'
    },
    {
        id: 'shopping-boulevard',
        name: 'Shopping Boulevard',
        category: 'shopping',
        distance: '300 metros',
        walkTime: '4 min',
        bikeTime: '2 min',
        carTime: '2 min',
        description: 'Grande shopping center com cinemas Cinemark, praça de alimentação, academia, lojas e serviços.',
        highlight: 'Lazer & Conveniência',
        radarPos: { x: -78, y: 18 },
        addressQuery: 'Shopping Boulevard Rio de Janeiro Vila Isabel'
    },
    {
        id: 'hupe',
        name: 'Hospital HUPE / UERJ',
        category: 'health',
        distance: '900 metros',
        walkTime: '11 min',
        bikeTime: '3 min',
        carTime: '4 min',
        description: 'Um dos maiores complexos de saúde e formação médica de excelência do Rio.',
        highlight: 'Campus de Saúde',
        radarPos: { x: 58, y: -62 },
        addressQuery: 'Hospital Universitario Pedro Ernesto Vila Isabel'
    },
    {
        id: 'uerj',
        name: 'UERJ (Maracanã)',
        category: 'education',
        distance: '1.2 km',
        walkTime: '15 min',
        bikeTime: '4 min',
        carTime: '5 min',
        description: 'Principal universidade estadual com cursos de graduação, pós-graduação, biblioteca e teatro.',
        highlight: 'Hub Universitário',
        radarPos: { x: 22, y: -84 },
        addressQuery: 'UERJ Universidade do Estado do Rio de Janeiro Maracana'
    },
    {
        id: 'metro-maracana',
        name: 'Metrô Maracanã',
        category: 'transit',
        distance: '1.3 km',
        walkTime: '16 min',
        bikeTime: '5 min',
        carTime: '5 min',
        description: 'Conexão rápida da Linha 2 do Metrô para Centro, Zona Sul, Tijuca e Zona Norte.',
        highlight: 'Mobilidade Integrada',
        radarPos: { x: 56, y: 76 },
        addressQuery: 'Estacao Maracana Metro Rio'
    },
    {
        id: 'maracana',
        name: 'Estádio Maracanã',
        category: 'leisure',
        distance: '1.5 km',
        walkTime: '18 min',
        bikeTime: '6 min',
        carTime: '6 min',
        description: 'O maior palco do futebol mundial, grandes shows, pista de corrida e ciclovia.',
        highlight: 'Ícone Mundial',
        radarPos: { x: 84, y: -10 },
        addressQuery: 'Estadio Jornalista Mario Filho Maracana'
    }
];

const CATEGORIES = [
    { key: 'all', label: 'Todos os Locais', icon: Compass },
    { key: 'food', label: 'Gastronomia & Food Trucks', icon: Utensils },
    { key: 'shopping', label: 'Compras & Mercados', icon: ShoppingBag },
    { key: 'culture', label: 'Cultura & Lazer', icon: Music },
    { key: 'education', label: 'Educação & Saúde', icon: GraduationCap },
    { key: 'transit', label: 'Mobilidade & Metrô', icon: Navigation }
];

export function InteractiveMap() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [activePlace, setActivePlace] = useState<Place>(PLACES_DATA[0]);
    const [viewMode, setViewMode] = useState<'radar' | 'map'>('radar');

    const filteredPlaces = PLACES_DATA.filter(place => {
        if (selectedCategory === 'all') return true;
        if (selectedCategory === 'food') return place.category === 'food';
        if (selectedCategory === 'shopping') return place.category === 'shopping' || place.category === 'market';
        if (selectedCategory === 'culture') return place.category === 'culture' || place.category === 'leisure';
        if (selectedCategory === 'education') return place.category === 'education' || place.category === 'health';
        if (selectedCategory === 'transit') return place.category === 'transit';
        return true;
    });

    const getCategoryIcon = (category: Place['category']) => {
        switch (category) {
            case 'food': return <Utensils size={14} className="text-amber-400" />;
            case 'shopping':
            case 'market': return <ShoppingBag size={14} className="text-emerald-400" />;
            case 'culture':
            case 'leisure': return <Music size={14} className="text-rose-400" />;
            case 'education': return <GraduationCap size={14} className="text-indigo-400" />;
            case 'health': return <HeartPulse size={14} className="text-red-400" />;
            case 'transit': return <Navigation size={14} className="text-cyan-400" />;
            default: return <MapPin size={14} className="text-rose-400" />;
        }
    };

    const getGoogleMapsRouteUrl = (addressQuery: string) => {
        const origin = encodeURIComponent('Rua Torres Homem 886, Vila Isabel, Rio de Janeiro - RJ');
        const destination = encodeURIComponent(addressQuery);
        return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=walking`;
    };

    return (
        <div className="w-full">
            {/* Header da Seção */}
            <div className="text-center max-w-3xl mx-auto mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-black uppercase tracking-[0.2em] mb-4">
                    <MapPin size={14} /> Vila Isabel • Rio de Janeiro
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tight mb-4">
                    Viva perto de tudo que <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-400">facilita sua vida</span>
                </h2>
                <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                    Localização privilegiada na <strong className="text-slate-200">Rua Torres Homem, 886</strong>. Faça praticamente tudo a pé, com mercados, shopping, restaurantes e universidades ao seu redor.
                </p>
            </div>

            {/* Alternador de Categorias - Responsivo sem scroll lateral */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap md:justify-center gap-2 sm:gap-2.5 mb-8 max-w-4xl mx-auto">
                {CATEGORIES.map(cat => {
                    const Icon = cat.icon;
                    const isSelected = selectedCategory === cat.key;
                    return (
                        <button
                            key={cat.key}
                            onClick={() => setSelectedCategory(cat.key)}
                            className={`flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 rounded-2xl text-[10.5px] sm:text-xs font-bold transition-all duration-300 border ${
                                isSelected
                                    ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-900/30 scale-[1.02] md:scale-105 ring-2 ring-rose-500/20'
                                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                            }`}
                        >
                            <Icon size={15} className={`shrink-0 ${isSelected ? 'text-white' : 'text-rose-400'}`} />
                            <span className="truncate">{cat.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Painel Principal do Mapa / Radar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Lado Esquerdo: O Mapa Visual / Radar Interativo (7 colunas) */}
                <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-[2.5rem] p-6 md:p-8 flex flex-col relative overflow-hidden backdrop-blur-xl shadow-2xl">
                    {/* Botão de Alternar Modo Radar / Mapa Google */}
                    <div className="flex items-center justify-between mb-6 z-20">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                            <span className="text-[11px] font-black uppercase tracking-widest text-slate-300">
                                {viewMode === 'radar' ? 'Radar Interativo de Distâncias' : 'Visão de Mapa Real'}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-2xl border border-slate-800">
                            <button
                                onClick={() => setViewMode('radar')}
                                className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    viewMode === 'radar' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                Radar
                            </button>
                            <button
                                onClick={() => setViewMode('map')}
                                className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    viewMode === 'map' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                Satélite / Mapa
                            </button>
                        </div>
                    </div>

                    {/* Conteúdo: MODO RADAR */}
                    {viewMode === 'radar' ? (
                        <div className="relative w-full aspect-[4/3] md:aspect-square min-h-[480px] md:min-h-[540px] max-h-[580px] mx-auto flex items-center justify-center my-auto overflow-hidden">
                            {/* Círculos concêntricos e malha do Radar */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                {/* Anel Externo 1.5 km */}
                                <div className="absolute w-[94%] h-[94%] rounded-full border border-dashed border-rose-500/15 flex items-center justify-center">
                                    <span className="absolute -top-2.5 px-2 bg-slate-900 text-[8px] font-black text-rose-400/60 uppercase tracking-widest">
                                        Raio 1.5 km (~18 min)
                                    </span>
                                </div>
                                {/* Anel 900m */}
                                <div className="absolute w-[74%] h-[74%] rounded-full border border-slate-800/80 flex items-center justify-center">
                                    <span className="absolute -top-2.5 px-2 bg-slate-900 text-[8px] font-black text-slate-500 uppercase tracking-widest">
                                        Raio 900m (~11 min)
                                    </span>
                                </div>
                                {/* Anel 300m */}
                                <div className="absolute w-[50%] h-[50%] rounded-full border border-rose-500/20 bg-rose-500/[0.015] flex items-center justify-center">
                                    <span className="absolute -top-2.5 px-2 bg-slate-900 text-[8px] font-black text-rose-400/80 uppercase tracking-widest">
                                        Raio 300m (~4 min)
                                    </span>
                                </div>
                                {/* Anel 150m */}
                                <div className="absolute w-[28%] h-[28%] rounded-full border border-emerald-500/25 bg-emerald-500/[0.02] flex items-center justify-center">
                                    <span className="absolute -top-2.5 px-2 bg-slate-900 text-[7.5px] font-black text-emerald-400/90 uppercase tracking-widest">
                                        100-150m (~1-2 min)
                                    </span>
                                </div>
                                {/* Linhas dos eixos do Radar */}
                                <div className="absolute w-full h-px bg-slate-800/40" />
                                <div className="absolute h-full w-px bg-slate-800/40" />
                                <div className="absolute w-full h-px bg-slate-800/20 rotate-45" />
                                <div className="absolute w-full h-px bg-slate-800/20 -rotate-45" />
                            </div>

                            {/* PONTO CENTRAL: Moronavila */}
                            <div className="relative z-30 flex flex-col items-center justify-center cursor-pointer group">
                                <div className="relative flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-500 text-white shadow-xl shadow-rose-900/50 border-2 border-white/20 group-hover:scale-105 transition-transform">
                                    <Building2 size={20} />
                                    <span className="absolute -inset-1 rounded-2xl bg-rose-500/30 animate-pulse -z-10" />
                                </div>
                                <div className="absolute top-13 bg-slate-950/95 border border-rose-500/30 px-2 py-1 rounded-lg shadow-xl whitespace-nowrap text-center pointer-events-none">
                                    <div className="text-[8.5px] font-black uppercase text-rose-400 tracking-wider">MORONAVILA</div>
                                    <div className="text-[7.5px] text-slate-400">R. Torres Homem, 886</div>
                                </div>
                            </div>

                            {/* PINS INTERATIVOS AO REDOR */}
                            {filteredPlaces.map(place => {
                                const isSelected = activePlace.id === place.id;
                                // Amplitude com 45% do raio
                                const leftPercent = 50 + (place.radarPos.x * 0.45);
                                const topPercent = 50 + (place.radarPos.y * 0.45);

                                return (
                                    <button
                                        key={place.id}
                                        onClick={() => setActivePlace(place)}
                                        style={{
                                            left: `${leftPercent}%`,
                                            top: `${topPercent}%`
                                        }}
                                        className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group transition-all duration-300 ${
                                            isSelected ? 'scale-115 z-40' : 'hover:scale-105 opacity-95 hover:opacity-100'
                                        }`}
                                    >
                                        <div className={`px-2 py-1 md:px-2.5 md:py-1.5 rounded-xl border shadow-lg flex items-center gap-1.5 transition-all ${
                                            isSelected
                                                ? 'bg-rose-600 border-white text-white shadow-rose-900/60 ring-2 ring-rose-500/40'
                                                : 'bg-slate-950/90 border-slate-700/80 text-slate-200 hover:border-rose-500/80'
                                        }`}>
                                            {getCategoryIcon(place.category)}
                                            <span className="text-[8.5px] md:text-[9.5px] font-bold max-w-[70px] md:max-w-[95px] truncate">
                                                {place.name}
                                            </span>
                                        </div>
                                        {/* Badge de tempo */}
                                        <div className={`mt-0.5 text-[7px] md:text-[7.5px] font-black px-1.5 py-0.5 rounded border text-center transition-all ${
                                            isSelected
                                                ? 'bg-white text-slate-950 border-white'
                                                : 'bg-slate-900/90 text-slate-300 border-slate-700/80'
                                        }`}>
                                            🚶 {place.walkTime}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        /* Conteúdo: MODO MAPA REAL (Google Maps) */
                        <div className="relative w-full aspect-square max-h-[520px] rounded-3xl overflow-hidden border border-slate-800">
                            <iframe
                                title="Mapa Moronavila"
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                scrolling="no"
                                src={`https://maps.google.com/maps?q=${encodeURIComponent('Rua Torres Homem 886, Vila Isabel, Rio de Janeiro')}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                                className="w-full h-full filter invert-[90%] hue-rotate-180 contrast-[90%]"
                            />
                            <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                                <div>
                                    <div className="text-xs font-black text-white">Moronavila - Vila Isabel</div>
                                    <div className="text-[10px] text-slate-400">Rua Torres Homem, 886 - CEP 20551-075</div>
                                </div>
                                <a
                                    href={getGoogleMapsRouteUrl(activePlace.addressQuery)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all"
                                >
                                    Abrir Rota <ExternalLink size={12} />
                                </a>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
                        <span className="flex items-center gap-1.5">
                            <Sparkles size={14} className="text-rose-400" /> Clique em qualquer ponto para ver detalhes e rotas
                        </span>
                        <span className="text-slate-500 font-mono">22°55'03"S • 43°15'02"W</span>
                    </div>
                </div>

                {/* Lado Direito: Detalhe do Local Ativo & Lista Rápida (5 colunas) */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    {/* Card de Destaque do Ponto Selecionado */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-rose-500/30 rounded-[2.5rem] p-6 md:p-8 relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 w-36 h-36 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="flex items-center justify-between gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest">
                                {activePlace.highlight || 'Ponto de Interesse'}
                            </span>
                            <span className="text-slate-400 text-xs font-mono font-bold flex items-center gap-1">
                                <Footprints size={14} className="text-rose-400" /> {activePlace.distance}
                            </span>
                        </div>

                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tight mb-3">
                            {activePlace.name}
                        </h3>

                        <p className="text-slate-300 text-sm leading-relaxed mb-6">
                            {activePlace.description}
                        </p>

                        {/* Tempos de Deslocamento em Badges */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl text-center">
                                <div className="text-rose-400 flex justify-center mb-1"><Footprints size={18} /></div>
                                <div className="text-white font-black text-sm">{activePlace.walkTime}</div>
                                <div className="text-[9px] text-slate-400 font-bold uppercase">A pé</div>
                            </div>
                            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl text-center">
                                <div className="text-amber-400 flex justify-center mb-1"><Bike size={18} /></div>
                                <div className="text-white font-black text-sm">{activePlace.bikeTime}</div>
                                <div className="text-[9px] text-slate-400 font-bold uppercase">Bike</div>
                            </div>
                            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl text-center">
                                <div className="text-cyan-400 flex justify-center mb-1"><Car size={18} /></div>
                                <div className="text-white font-black text-sm">{activePlace.carTime}</div>
                                <div className="text-[9px] text-slate-400 font-bold uppercase">Carro/App</div>
                            </div>
                        </div>

                        {/* Ação: Traçar Rota no Google Maps */}
                        <a
                            href={getGoogleMapsRouteUrl(activePlace.addressQuery)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2.5 bg-rose-600 hover:bg-rose-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-rose-900/40 hover:scale-[1.02] active:scale-98"
                        >
                            Ver Rota no Google Maps <ExternalLink size={16} />
                        </a>
                    </div>

                    {/* Lista Rápida dos Principais Vizinhos */}
                    <div className="bg-slate-900/40 border border-slate-800/80 rounded-[2.5rem] p-6 flex-1 flex flex-col">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                            <Layers size={14} className="text-rose-500" /> Outros Destaques Próximos
                        </h4>

                        <div className="space-y-2.5 overflow-y-auto max-h-[280px] pr-1">
                            {filteredPlaces.map(place => (
                                <button
                                    key={place.id}
                                    onClick={() => setActivePlace(place)}
                                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                                        activePlace.id === place.id
                                            ? 'bg-rose-500/10 border-rose-500/40 text-white'
                                            : 'bg-slate-950/40 border-slate-800/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                                    }`}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                                            {getCategoryIcon(place.category)}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-xs font-bold truncate text-slate-200">{place.name}</div>
                                            <div className="text-[10px] text-slate-400 font-mono">{place.distance}</div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black uppercase text-rose-400 px-2 py-1 bg-rose-500/10 rounded-lg shrink-0">
                                        🚶 {place.walkTime}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
