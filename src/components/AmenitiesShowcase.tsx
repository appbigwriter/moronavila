import React, { useState } from 'react';
import {
    Utensils, BookOpen, Coffee, Sparkles, ShieldCheck,
    Wifi, CheckCircle2, Droplets, Zap, Brush, Wrench,
    Smartphone, ArrowRight, Eye, ChevronLeft, ChevronRight, Shirt
} from 'lucide-react';
import { Language } from '../i18n/types';

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
        description: 'Quartos, suítes independentes, studios e apartamento planejados para profissionais e casais, com cama confortável, escrivaninha de trabalho, armário, ar-condicionado e ventilação natural.',
        images: [
            '/fotos/98905_0gMXlxxyf06MJQMP.jpg',
            '/fotos/98905_CYCX7spXgRfrsz7H.jpg',
            '/fotos/98905_JRni84qYdUydS9eF.jpg',
            '/fotos/98905_r9U1krISShnTliUA (1).jpg',
            '/fotos/98905_Z6otj5s5Fg0NeCYF.jpg'
        ],
        features: [
            'Cama confortável e colchão de alta densidade',
            'Guarda-roupa amplo e escrivaninha de trabalho',
            'Suítes com entrada independente, studios e apartamento com cozinha e banheiro próprios',
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
        title: 'Área Externa, Churrasqueira & Lounge',
        shortTitle: 'Área Externa & Lounge',
        icon: Coffee,
        badge: 'Descompressão & Bem-Estar',
        subtitle: 'Ampla área ao ar livre com churrasqueira e lounge para receber visitas',
        description: 'Ampla área externa arejada, com churrasqueira, mesas e terraço com vista para descansar depois do trabalho. E um lounge para receber seus visitantes com conforto, sem precisar levá-los para dentro da sua unidade.',
        images: [
            '/fotos/98905_aBdAfNfiZ6MqqyKB.jpg',
            '/fotos/vprimage7.jpg',
            '/fotos/vprimage9_areaexterna2.jpg',
            '/fotos/vprimage9_areaexterna.jpg',
            '/fotos/vprimage9_areaexterna3.jpg'
        ],
        features: [
            'Ampla área externa, aberta e bem ventilada',
            'Churrasqueira para os residentes',
            'Lounge para receber visitantes',
            'Terraço com vista e área verde'
        ],
        benefit: 'Espaço de sobra para respirar e receber quem você gosta, sem abrir mão da tranquilidade da casa.'
    },
    {
        id: 'lavanderia',
        title: 'Lavanderia',
        shortTitle: 'Lavanderia',
        icon: Shirt,
        badge: 'Praticidade no Dia a Dia',
        subtitle: 'Lave sua roupa em casa, sem lavanderia paga',
        description: 'Lavanderia coberta com máquinas de lavar, tanque e varal, de uso dos residentes, com horários organizados pelo app do morador.',
        images: [
            '/fotos/98905_GxHlp9Nr0ZME7gd1.jpg'
        ],
        features: [
            'Máquinas de lavar de uso dos residentes',
            'Tanque e varal',
            'Horários organizados pelo app do morador',
            'Área coberta e ventilada'
        ],
        benefit: 'Uma despesa e um deslocamento a menos na sua semana.'
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
            'Wi-Fi dedicado de alta performance para reuniões e trabalho remoto',
            'Regras de silêncio rigorosas para máxima concentração'
        ],
        benefit: 'Perfeito para quem trabalha de casa, estuda para concursos ou se prepara para plantões e provas de residência.'
    },
    {
        id: 'seguranca',
        title: 'Entrada Inteligente & Tecnologia',
        shortTitle: 'Segurança & Interfonia',
        icon: ShieldCheck,
        badge: 'Tranquilidade 24h',
        subtitle: 'Acesso seguro e interfone individual em cada unidade',
        description: 'Fachada moderna e segura na Rua Torres Homem com controle de acesso, monitoramento e interfone individual em cada unidade para atender entregas e receber seus visitantes cadastrados com segurança.',
        images: [
            '/fotos/vprimage11_entrada.jpg'
        ],
        features: [
            'Entrada segura e identificada',
            'Interfone individual em cada unidade (em instalação)',
            'Câmeras de monitoramento 24h nas áreas comuns',
            'Visitantes previamente cadastrados: só entra quem é conhecido'
        ],
        benefit: 'Sensação total de segurança para você e tranquilidade absoluta para sua família.'
    }
];

const INCLUDED_BENEFITS = [
    { icon: Zap, title: 'Luz Individual', desc: 'Medidor próprio: pague só o que usa (jan/2027)' },
    { icon: Droplets, title: 'Água Individual', desc: 'Sem rateio com ninguém (jan/2027)' },
    { icon: Wifi, title: 'Wi-Fi Ultra-Rápido', desc: 'Fibra óptica de alta velocidade' },
    { icon: Brush, title: 'Limpeza Semanal', desc: 'Áreas comuns sempre limpas' },
    { icon: Wrench, title: 'Manutenção Ágil', desc: 'Suporte rápido direto no app' },
    { icon: Smartphone, title: 'App do Morador', desc: 'Lavanderia, avisos e chamados' }
];

const AMENITIES_I18N: Record<Language, {
    tag: string;
    titlePrefix: string;
    titleHighlight: string;
    subtitle: string;
    benefitBadge: string;
    viewVacancies: string;
    bannerBadge: string;
    bannerTitle: string;
    bannerSubtitle: string;
    categories: Record<string, {
        title: string;
        shortTitle: string;
        badge: string;
        subtitle: string;
        description: string;
        features: string[];
        benefit: string;
    }>;
    benefits: Array<{ title: string; desc: string }>;
}> = {
    pt: {
        tag: 'Espaços & Facilidades',
        titlePrefix: 'Comodidades pensadas para ',
        titleHighlight: 'sua rotina e conforto',
        subtitle: 'Aqui você não aluga apenas um quarto, você ganha acesso a uma casa completa e organizada, pronta para você viver bem desde o primeiro dia.',
        benefitBadge: 'Benefício Direto',
        viewVacancies: 'Ver Vagas Disponíveis',
        bannerBadge: 'Sem Condomínio, Sem IPTU, Sem Fiador',
        bannerTitle: 'Aluguel fixo e justo, sem burocracia',
        bannerSubtitle: 'Esqueça a dor de cabeça de negociar com imobiliárias, pagar condomínio à parte, IPTU, taxas extras ou ter que comprar geladeira e fogão.',
        categories: {
            quartos: {
                title: 'Quartos Mobiliados & Privativos',
                shortTitle: 'Quartos Mobiliados',
                badge: 'Privacidade & Conforto',
                subtitle: 'Acomodações prontas para morar com foco e tranquilidade',
                description: 'Quartos, suítes independentes, studios e apartamento planejados para profissionais e casais, com cama confortável, escrivaninha de trabalho, armário, ar-condicionado e ventilação natural.',
                features: [
                    'Cama confortável e colchão de alta densidade',
                    'Guarda-roupa amplo e escrivaninha de trabalho',
                    'Suítes com entrada independente, studios e apartamento com cozinha e banheiro próprios',
                    'Janelas com ventilação natural e ambiente silencioso'
                ],
                benefit: 'Mudança instantânea no mesmo dia, sem gastar milhares de reais com frete ou compra de móveis.'
            },
            cozinha: {
                title: 'Cozinha Gourmet & Totalmente Equipada',
                shortTitle: 'Cozinha Gourmet',
                badge: 'Praticidade & Economia',
                subtitle: 'Tudo pronto para você preparar suas refeições com conforto',
                description: 'Ampla cozinha planejada equipada com eletrodomésticos modernos, bancadas espaçosas, geladeiras, micro-ondas, cooktops e armários com espaços dedicados para cada residente.',
                features: [
                    'Eletrodomésticos modernos (geladeiras, micro-ondas, fogões)',
                    'Utensílios completos e bancada para refeições rápidas',
                    'Espaço individual de despensa/armário identificado',
                    'Limpeza periódica de suporte inclusa'
                ],
                benefit: 'Economize tempo e dinheiro cozinhando em casa sem precisar comprar nenhum utensílio ou eletrodoméstico.'
            },
            convivencia: {
                title: 'Área Externa, Churrasqueira & Lounge',
                shortTitle: 'Área Externa & Lounge',
                badge: 'Descompressão & Bem-Estar',
                subtitle: 'Ampla área ao ar livre com churrasqueira e lounge para receber visitas',
                description: 'Ampla área externa arejada, com churrasqueira, mesas e terraço com vista para descansar depois do trabalho. E um lounge para receber seus visitantes com conforto, sem precisar levá-los para dentro da sua unidade.',
                features: [
                    'Ampla área externa, aberta e bem ventilada',
                    'Churrasqueira para os residentes',
                    'Lounge para receber visitantes',
                    'Terraço com vista e área verde'
                ],
                benefit: 'Espaço de sobra para respirar e receber quem você gosta, sem abrir mão da tranquilidade da casa.'
            },
            lavanderia: {
                title: 'Lavanderia',
                shortTitle: 'Lavanderia',
                badge: 'Praticidade no Dia a Dia',
                subtitle: 'Lave sua roupa em casa, sem lavanderia paga',
                description: 'Lavanderia coberta com máquinas de lavar, tanque e varal, de uso dos residentes, com horários organizados pelo app do morador.',
                features: [
                    'Máquinas de lavar de uso dos residentes',
                    'Tanque e varal',
                    'Horários organizados pelo app do morador',
                    'Área coberta e ventilada'
                ],
                benefit: 'Uma despesa e um deslocamento a menos na sua semana.'
            },
            estudos: {
                title: 'Sala de Estudos & Coworking',
                shortTitle: 'Coworking & Estudos',
                badge: 'Foco & Produtividade',
                subtitle: 'Ambiente silencioso, iluminado e planejado para alto rendimento',
                description: 'Espaço exclusivo com mesas amplas, iluminação adequada para leitura prolongada, tomadas individuais para notebooks e conexão Wi-Fi de fibra óptica com alta velocidade e baixa latência.',
                features: [
                    'Mesas espaçosas e cadeiras confortáveis',
                    'Iluminação focada e tomadas ao alcance das mãos',
                    'Wi-Fi dedicado de alta performance para reuniões e trabalho remoto',
                    'Regras de silêncio rigorosas para máxima concentração'
                ],
                benefit: 'Perfeito para quem trabalha de casa, estuda para concursos ou se prepara para plantões e provas de residência.'
            },
            seguranca: {
                title: 'Entrada Inteligente & Tecnologia',
                shortTitle: 'Segurança & Interfonia',
                badge: 'Tranquilidade 24h',
                subtitle: 'Acesso seguro e interfone individual em cada unidade',
                description: 'Fachada moderna e segura na Rua Torres Homem com controle de acesso, monitoramento e interfone individual em cada unidade para atender entregas e receber seus visitantes cadastrados com segurança.',
                features: [
                    'Entrada segura e identificada',
                    'Interfone individual em cada unidade (em instalação)',
                    'Câmeras de monitoramento 24h nas áreas comuns',
                    'Visitantes previamente cadastrados: só entra quem é conhecido'
                ],
                benefit: 'Sensação total de segurança para você e tranquilidade absoluta para sua família.'
            }
        },
        benefits: [
            { title: 'Luz Individual', desc: 'Medidor próprio: pague só o que usa (jan/2027)' },
            { title: 'Água Individual', desc: 'Sem rateio com ninguém (jan/2027)' },
            { title: 'Wi-Fi Ultra-Rápido', desc: 'Fibra óptica de alta velocidade' },
            { title: 'Limpeza Semanal', desc: 'Áreas comuns sempre limpas' },
            { title: 'Manutenção Ágil', desc: 'Suporte rápido direto no app' },
            { title: 'App do Morador', desc: 'Lavanderia, avisos e chamados' }
        ]
    },
    en: {
        tag: 'Spaces & Amenities',
        titlePrefix: 'Amenities designed for ',
        titleHighlight: 'your routine and comfort',
        subtitle: 'Here you don’t just rent a room; you gain access to a fully equipped, organized home, ready for you to live well from day one.',
        benefitBadge: 'Direct Benefit',
        viewVacancies: 'View Available Units',
        bannerBadge: 'No HOA Fees, No Property Tax, No Guarantor',
        bannerTitle: 'Fixed and fair rent, zero bureaucracy',
        bannerSubtitle: 'Forget the headache of dealing with real estate agencies, paying separate HOA fees, property taxes, extra charges, or buying a fridge and stove.',
        categories: {
            quartos: {
                title: 'Furnished & Private Rooms',
                shortTitle: 'Furnished Rooms',
                badge: 'Privacy & Comfort',
                subtitle: 'Move-in ready accommodations designed for focus and peace of mind',
                description: 'Rooms, independent suites, studios, and full apartments designed for professionals and couples, featuring comfortable beds, desks, closets, air conditioning, and natural ventilation.',
                features: [
                    'Comfortable bed with high-density mattress',
                    'Spacious wardrobe and dedicated work desk',
                    'Private entrance suites, studios and apartment with private kitchen and bath',
                    'Windows with natural airflow and quiet atmosphere'
                ],
                benefit: 'Move in on the same day without spending thousands on shipping or buying furniture.'
            },
            cozinha: {
                title: 'Gourmet & Fully Equipped Kitchen',
                shortTitle: 'Gourmet Kitchen',
                badge: 'Convenience & Savings',
                subtitle: 'Everything ready for you to cook your meals in total comfort',
                description: 'Spacious kitchen equipped with modern appliances, ample countertops, refrigerators, microwaves, cooktops, and dedicated storage cabinets for each resident.',
                features: [
                    'Modern appliances (refrigerators, microwaves, stoves)',
                    'Complete cookware set and quick-dining counter',
                    'Dedicated, clearly labeled individual pantry cabinet',
                    'Periodic support cleaning included'
                ],
                benefit: 'Save time and money by cooking at home without needing to buy any utensils or appliances.'
            },
            convivencia: {
                title: 'Outdoor Area, BBQ & Resident Lounge',
                shortTitle: 'Outdoor Area & Lounge',
                badge: 'Relaxation & Well-Being',
                subtitle: 'Spacious open-air patio with BBQ grill and lounge for welcoming guests',
                description: 'Spacious breezy outdoor area with barbecue grill, tables, and rooftop terrace with views to unwind after work. Plus a comfortable lounge to host visitors without bringing them into your private unit.',
                features: [
                    'Spacious open-air outdoor patio, fresh and well-ventilated',
                    'Barbecue grill available for residents',
                    'Welcoming resident lounge to receive authorized guests',
                    'Rooftop terrace with views and green areas'
                ],
                benefit: 'Plenty of space to breathe and host loved ones without compromising house tranquility.'
            },
            lavanderia: {
                title: 'Resident Laundry',
                shortTitle: 'Laundry',
                badge: 'Daily Convenience',
                subtitle: 'Wash your clothes at home with no laundromat fees',
                description: 'Covered laundry room with washing machines, sink, and drying racks for residents, with slots easily organized through the resident app.',
                features: [
                    'Washing machines available for resident use',
                    'Wash sink and clothes drying lines',
                    'Organized time slots managed via resident app',
                    'Covered and airy utility area'
                ],
                benefit: 'One less errand and extra expense in your weekly routine.'
            },
            estudos: {
                title: 'Study Room & Coworking',
                shortTitle: 'Coworking & Study',
                badge: 'Focus & Productivity',
                subtitle: 'Quiet, well-lit environment planned for high performance',
                description: 'Exclusive workspace with large tables, ideal lighting for prolonged reading, individual laptop power outlets, and high-speed low-latency fiber optic Wi-Fi.',
                features: [
                    'Spacious work desks and ergonomic chairs',
                    'Targeted lighting and easily accessible power sockets',
                    'High-performance dedicated Wi-Fi for remote work and calls',
                    'Strict quiet rules for maximum concentration'
                ],
                benefit: 'Perfect for remote workers, test prep students, and healthcare professionals preparing for residency exams.'
            },
            seguranca: {
                title: 'Smart Access & Technology',
                shortTitle: 'Security & Intercom',
                badge: '24/7 Peace of Mind',
                subtitle: 'Secure access and individual intercom in each unit',
                description: 'Modern, secure facade on Rua Torres Homem with access control, 24/7 video monitoring, and individual intercoms in every unit to answer deliveries and welcome registered visitors safely.',
                features: [
                    'Secure, verified entrance door',
                    'Individual intercom in each unit (being deployed)',
                    '24/7 security cameras in common areas',
                    'Pre-registered visitors: only authorized guests enter'
                ],
                benefit: 'Total peace of mind for you and complete reassurance for your family.'
            }
        },
        benefits: [
            { title: 'Individual Electricity', desc: 'Own meter: pay only what you use (Jan/2027)' },
            { title: 'Individual Water', desc: 'No splitting bills with anyone (Jan/2027)' },
            { title: 'Ultra-Fast Wi-Fi', desc: 'High-speed fiber optic connection' },
            { title: 'Weekly Cleaning', desc: 'Common areas kept spotless' },
            { title: 'Agile Maintenance', desc: 'Quick support directly via app' },
            { title: 'Resident App', desc: 'Laundry slots, notices, and requests' }
        ]
    },
    es: {
        tag: 'Espacios y Comodidades',
        titlePrefix: 'Comodidades pensadas para ',
        titleHighlight: 'su rutina y confort',
        subtitle: 'Aquí no solo alquila una habitación; obtiene acceso a una casa completa y organizada, lista para vivir bien desde el primer día.',
        benefitBadge: 'Beneficio Directo',
        viewVacancies: 'Ver Unidades Disponibles',
        bannerBadge: 'Sin Expensas, Sin Impuestos, Sin Garante',
        bannerTitle: 'Alquiler fijo y justo, sin burocracia',
        bannerSubtitle: 'Olvide los dolores de cabeza de negociar con inmobiliarias, pagar expensas aparte, impuestos, cargos extra o tener que comprar heladera y cocina.',
        categories: {
            quartos: {
                title: 'Habitaciones Amobladas y Privativas',
                shortTitle: 'Habitaciones Amobladas',
                badge: 'Privacidad y Confort',
                subtitle: 'Alojamiento listo para habitar con enfoque y tranquilidad',
                description: 'Habitaciones, suites independientes, estudios y departamento diseñados para profesionales y parejas, con cama cómoda, escritorio de trabajo, armario, aire acondicionado y ventilación natural.',
                features: [
                    'Cama confortable y colchón de alta densidad',
                    'Armario amplio y escritorio de trabajo dedicado',
                    'Suites con entrada independiente, estudios y departamento con cocina y baño propios',
                    'Ventanas con ventilación natural y ambiente silencioso'
                ],
                benefit: 'Mudanza inmediata en el mismo día, sin gastar miles en fletes o compra de muebles.'
            },
            cozinha: {
                title: 'Cocina Gourmet Totalmente Equipada',
                shortTitle: 'Cocina Gourmet',
                badge: 'Practicidad y Ahorro',
                subtitle: 'Todo listo para que prepare sus comidas con total comodidad',
                description: 'Amplia cocina diseñada con electrodomésticos modernos, mesadas espaciosas, heladeras, microondas, anafes y armarios con espacios dedicados para cada residente.',
                features: [
                    'Electrodomésticos modernos (heladeras, microondas, anafes)',
                    'Vajilla y utensilios completos y mesada para comidas rápidas',
                    'Espacio individual de alacena y despensa identificado',
                    'Limpieza periódica de mantenimiento incluida'
                ],
                benefit: 'Ahorre tiempo y dinero cocinando en casa sin tener que comprar ningún utensilio o electrodoméstico.'
            },
            convivencia: {
                title: 'Área Exterior, Parrilla y Lounge',
                shortTitle: 'Área Exterior y Lounge',
                badge: 'Descanso y Bienestar',
                subtitle: 'Amplia área al aire libre con parrilla y salón para recibir visitas',
                description: 'Amplia área exterior aireada, con parrilla, mesas y terraza con vistas para descansar después del trabajo. Y un salón para recibir a sus visitas con comodidad sin necesidad de llevarlos a su unidad privada.',
                features: [
                    'Amplia área exterior abierta y bien ventilada',
                    'Parrilla disponible para residentes',
                    'Salón lounge para recibir visitas autorizadas',
                    'Terraza con vistas y área verde'
                ],
                benefit: 'Espacio de sobra para respirar y recibir a quienes aprecia sin alterar la tranquilidad del hogar.'
            },
            lavanderia: {
                title: 'Lavandería',
                shortTitle: 'Lavandería',
                badge: 'Practicidad Cotidiana',
                subtitle: 'Lave su ropa en casa sin pagar lavanderías externas',
                description: 'Lavandería cubierta con lavarropas, pileta y tender para residentes, con turnos organizados a través de la app del residente.',
                features: [
                    'Lavarropas de uso exclusivo para residentes',
                    'Pileta de lavado y tender para secado',
                    'Turnos organizados mediante la app del residente',
                    'Área cubierta y ventilada'
                ],
                benefit: 'Un gasto y un traslado menos en su semana.'
            },
            estudos: {
                title: 'Sala de Estudio y Coworking',
                shortTitle: 'Coworking y Estudio',
                badge: 'Concentración y Productividad',
                subtitle: 'Ambiente silencioso, iluminado y planificado para alto rendimiento',
                description: 'Espacio exclusivo con mesas amplias, iluminación adecuada para lectura prolongada, enchufes individuales para notebooks y conexión Wi-Fi de fibra óptica de alta velocidad y baja latencia.',
                features: [
                    'Mesas espaciosas y sillas ergonómicas confortables',
                    'Iluminación focalizada y tomas eléctricas al alcance',
                    'Wi-Fi dedicado de alto rendimiento para videollamadas y trabajo remoto',
                    'Normas estrictas de silencio para máxima concentración'
                ],
                benefit: 'Ideal para quienes trabajan desde casa, estudian para oposiciones o se preparan para residencias médicas.'
            },
            seguranca: {
                title: 'Entrada Inteligente y Tecnología',
                shortTitle: 'Seguridad e Intercomunicador',
                badge: 'Tranquilidad 24h',
                subtitle: 'Acceso seguro e intercomunicador individual en cada unidad',
                description: 'Fachada moderna y segura en Rua Torres Homem con control de acceso, monitoreo 24h e intercomunicador en cada unidad para recibir entregas y visitas autorizadas con total seguridad.',
                features: [
                    'Entrada segura e identificada',
                    'Intercomunicador individual en cada unidad (en instalación)',
                    'Cámaras de vigilancia 24h en áreas comunes',
                    'Visitas previamente registradas: solo ingresan personas autorizadas'
                ],
                benefit: 'Sensación total de seguridad para usted y tranquilidad absoluta para su familia.'
            }
        },
        benefits: [
            { title: 'Luz Individual', desc: 'Medidor propio: pague solo lo que consume (Ene/2027)' },
            { title: 'Agua Individual', desc: 'Sin repartir costos con nadie (Ene/2027)' },
            { title: 'Wi-Fi Ultrarrápido', desc: 'Fibra óptica de alta velocidad' },
            { title: 'Limpieza Semanal', desc: 'Áreas comunes siempre impecables' },
            { title: 'Mantenimiento Ágil', desc: 'Soporte rápido directo en la app' },
            { title: 'App del Residente', desc: 'Lavandería, avisos y solicitudes' }
        ]
    }
};

export function AmenitiesShowcase({ onSelectRoom, currentLang }: { onSelectRoom?: () => void; currentLang?: Language }) {
    const activeLang: Language = currentLang || (
        typeof window !== 'undefined'
            ? ((localStorage.getItem('moronavila_lang') as Language) || 'pt')
            : 'pt'
    );
    const t = AMENITIES_I18N[activeLang] || AMENITIES_I18N.pt;

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

    const catTrans = t.categories[activeAmenity.id] || activeAmenity;

    return (
        <div className="w-full space-y-20">
            {/* Header das Amenidades */}
            <div className="text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-black uppercase tracking-[0.2em] mb-4">
                    <Sparkles size={14} /> {t.tag}
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tight mb-4">
                    {t.titlePrefix}<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-400">{t.titleHighlight}</span>
                </h2>
                <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                    {t.subtitle}
                </p>
            </div>

            {/* Abas de Navegação das Áreas - Responsivo sem scroll lateral */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap md:justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
                {AMENITY_DATA.map((amenity, index) => {
                    const Icon = amenity.icon;
                    const isSelected = activeTab === amenity.id;
                    const isLastOdd = index === AMENITY_DATA.length - 1 && AMENITY_DATA.length % 2 !== 0;
                    const shortTitle = t.categories[amenity.id]?.shortTitle || amenity.shortTitle;
                    return (
                        <button
                            key={amenity.id}
                            onClick={() => handleTabChange(amenity.id)}
                            className={`flex items-center justify-center gap-2 px-3 py-3 sm:px-5 sm:py-3.5 rounded-2xl font-black text-[11px] sm:text-xs uppercase tracking-wider transition-all duration-300 border ${
                                isLastOdd ? 'col-span-2 sm:col-span-1 md:col-span-auto' : ''
                            } ${
                                isSelected
                                    ? 'bg-rose-600 text-white border-rose-500 shadow-xl shadow-rose-900/30 scale-[1.02] md:scale-105 ring-2 ring-rose-500/20'
                                    : 'bg-slate-900/70 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                            }`}
                        >
                            <Icon size={16} className={`shrink-0 ${isSelected ? 'text-white' : 'text-rose-500'}`} />
                            <span className="truncate">{shortTitle}</span>
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
                                alt={catTrans.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                            {/* Badge sobre a imagem */}
                            <div className="absolute top-5 left-5 bg-slate-950/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-rose-400">
                                {catTrans.badge}
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
                                {catTrans.badge}
                            </span>
                            <h3 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tight mt-1 mb-3">
                                {catTrans.title}
                            </h3>
                            <p className="text-slate-300 text-base leading-relaxed font-medium">
                                {catTrans.description}
                            </p>
                        </div>

                        {/* Lista de Features com checkmarks */}
                        <div className="space-y-3 pt-2">
                            {catTrans.features.map((feat, idx) => (
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
                                <Sparkles size={12} /> {t.benefitBadge}
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-medium">
                                {catTrans.benefit}
                            </p>
                        </div>

                        {onSelectRoom && (
                            <button
                                onClick={onSelectRoom}
                                className="inline-flex items-center gap-3 bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-rose-900/40 hover:scale-105 active:scale-95"
                            >
                                {t.viewVacancies} <ArrowRight size={16} />
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
                        <CheckCircle2 size={14} /> {t.bannerBadge}
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tight mb-3">
                        {t.bannerTitle}
                    </h3>
                    <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                        {t.bannerSubtitle}
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {t.benefits.map((item, idx) => {
                        const Icon = INCLUDED_BENEFITS[idx]?.icon || Zap;
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
