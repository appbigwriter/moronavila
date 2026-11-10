import React, { useState, useEffect } from 'react';
import {
    ShieldCheck, ArrowLeft, ExternalLink, Copy, Check, AlertTriangle,
    Users, Ban, Shirt, DollarSign, Calendar, Clock, Volume2, Package,
    Coffee, Camera, Lock, FileText, Send, Sparkles, CheckCircle2,
    Home, Phone, Mail, User, Info, AlertCircle, HeartHandshake,
    Printer, ChevronDown, ChevronUp, UserPlus, X, ArrowRight,
    UserCheck, BadgeCheck, Instagram, Facebook, Upload, Trash2,
    Image as ImageIcon, Plug, Flame, Eye, EyeOff
} from 'lucide-react';
import { Resident, UserRole } from '../types';
import { createResident, uploadResidentDocument } from '../lib/database';
import { supabase } from '../lib/supabase';
import { Language } from '../i18n/types';
import { TRANSLATIONS } from '../i18n/translations';
import { LanguageSelector } from '../components/LanguageSelector';

const RULE_TITLES: Record<Language, string[]> = {
    pt: [
        'Visitas & Segurança',
        'Proibição de Fumo e Álcool',
        'Passar e Lavar Roupas & Lavanderia',
        'Vencimento do Aluguel & Chave PIX',
        'Saída do Imóvel & Aviso Prévio de 30 Dias',
        'Silêncio & Televisão e Som',
        'Recebimento de Entregas & Interfone',
        'Organização da Cozinha & Armários Individuais',
        'Limpeza Imediata da Cozinha & Multa',
        'Privacidade de Quartos e Banheiros & Multa',
        'Regras de Uso dos Eletrodomésticos de Uso Compartilhado',
        'Uso do Lounge, Churrasqueira e Área Externa da Casa'
    ],
    en: [
        'Visitors & Security',
        'No Smoking & Alcohol Prohibition',
        'Ironing, Washing Clothes & Laundry',
        'Rent Due Date & PIX Payment Key',
        'Move-Out Notice & 30-Day Prior Notice',
        'Quiet Hours & TV/Music Volume',
        'Delivery Reception & Intercom',
        'Kitchen Organization & Individual Cabinets',
        'Immediate Kitchen Cleaning & Fines',
        'Privacy of Rooms & Bathrooms & Fines',
        'Shared Appliances Usage Rules',
        'Lounge, BBQ & Outdoor Area Usage'
    ],
    es: [
        'Visitas y Seguridad',
        'Prohibición de Fumar y Alcohol',
        'Planchado, Lavado de Ropa y Lavandería',
        'Vencimiento del Alquiler y Clave PIX',
        'Salida del Inmueble y Preaviso de 30 Días',
        'Silencio y Volumen de TV/Música',
        'Recepción de Envíos e Intercomunicador',
        'Organización de Cocina y Armarios Individuales',
        'Limpieza Inmediata de la Cocina y Multas',
        'Privacidad de Habitaciones y Baños y Multas',
        'Reglas de Uso de Electrodomésticos Compartidos',
        'Uso del Salón, Parrilla y Área Exterior'
    ]
};

const DECLARATION_TEXT: Record<Language, { title: string; body: string; backToHome: string }> = {
    pt: {
        title: 'DECLARAÇÃO FORMAL DE ACEITE INTEGRAL DAS REGRAS *',
        body: 'Declaro que li, compreendi e dei aceite integral em todas as 12 Regras de Conduta do Residencial Moronavila e que assumo a responsabilidade pelos meus atos e das pessoas que forem autorizadas por mim a visitar a propriedade, e que responderei financeiramente danos a propriedade ou moveis, eletrodomesticos, equipamentos e utensillhos que estou recebendo na minha unidade e nas partes compatilhadas.',
        backToHome: 'Voltar ao Início'
    },
    en: {
        title: 'FORMAL DECLARATION OF FULL RULES ACCEPTANCE *',
        body: 'I declare that I have read, understood, and fully accepted all 12 House Rules of Residencial Moronavila, and that I assume full responsibility for my actions and those of any person authorized by me to visit the property, and that I will be financially responsible for any damage to property, furniture, appliances, equipment, and utensils received in my unit and in shared areas.',
        backToHome: 'Back to Home'
    },
    es: {
        title: 'DECLARACIÓN FORMAL DE ACEPTACIÓN INTEGRAL DE LAS REGLAS *',
        body: 'Declaro que he leído, comprendido y aceptado en su totalidad las 12 Reglas de Convivencia del Residencial Moronavila, y que asumo total responsabilidad por mis actos y por las personas autorizadas por mí a visitar la propiedad, respondiendo financieramente por cualquier daño a la propiedad, muebles, electrodomésticos, equipos y utensilios en mi unidad y en las áreas compartidas.',
        backToHome: 'Volver al Inicio'
    }
};

interface FineCardItem {
    title: string;
    value: string;
    note: string;
    color: string;
}

interface RulesViewTranslations {
    backToHome: string;
    rulesAndRegTitle: string;
    registerVisitBtn: string;
    googleFormsBtn: string;
    printBtn: string;
    heroBadge: string;
    heroTitlePrefix: string;
    heroTitleHighlight: string;
    heroSubtitle: string;
    heroDesc: string;
    standardRatesTitle: string;
    ratesPerMonth: string;
    rentAndCleaningNote: string;
    monthPeriodRef: string;
    paidInAdvance: string;
    exclusivePromoBadge: string;
    promoDiscountNote: string;
    promoDetailsText: string;
    entryConditionsTitle: string;
    depositPlusMonth: string;
    entryConditionsDesc: string;
    depositCoversLastMonth: string;
    pixDetailsTitle: string;
    pixBeneficiaryLabel: string;
    pixKeyLabel: string;
    copyPixBtn: string;
    copiedPixBtn: string;
    mandatoryRuleAcceptanceTag: string;
    the12RulesTitle: string;
    the12RulesSubtitle: string;
    rulesAcceptedLabel: string;
    allRulesAcceptedBadge: string;
    rulesAcceptedSuffix: string;
    finesTableTitle: string;
    finesTableSubtitle: string;
    finesPolicyText: string;
    fineCards: FineCardItem[];
    googleFormsCardTag: string;
    googleFormsCardTitle: string;
    googleFormsCardDesc: string;
    googleFormsOpenBtn: string;
    googleFormsCopyBtn: string;
    googleFormsCopiedBtn: string;
    formTag: string;
    formTitle: string;
    formSubtitle: string;
    labelFullName: string;
    placeholderFullName: string;
    labelEmail: string;
    placeholderEmail: string;
    labelPhone: string;
    placeholderPhone: string;
    labelCpf: string;
    placeholderCpf: string;
    labelRg: string;
    placeholderRg: string;
    labelBirthDate: string;
    labelOriginAddress: string;
    placeholderOriginAddress: string;
    labelFamilyAddress: string;
    placeholderFamilyAddress: string;
    labelDesiredRoom: string;
    roomOptions: {
        single: string;
        suite: string;
        studio: string;
        apartment: string;
    };
    labelEntryDate: string;
    labelOccupation: string;
    placeholderOccupation: string;
    labelCompany: string;
    placeholderCompany: string;
    labelUniversity: string;
    placeholderUniversity: string;
    labelCourse: string;
    placeholderCourse: string;
    labelEmergencyName: string;
    placeholderEmergencyName: string;
    labelEmergencyPhone: string;
    placeholderEmergencyPhone: string;
    labelInstagram: string;
    placeholderInstagram: string;
    labelFacebook: string;
    placeholderFacebook: string;
    docsSectionTitle: string;
    docsSectionDesc: string;
    docsSectionBadge: string;
    docFrontLabel: string;
    docFrontHint: string;
    docFrontClick: string;
    docFrontTypeHint: string;
    docChangeImage: string;
    docFrontUploaded: string;
    docBackLabel: string;
    docBackHint: string;
    docBackClick: string;
    docBackTypeHint: string;
    docBackUploaded: string;
    passwordSectionTitle: string;
    passwordSectionDesc: string;
    passwordSectionBadge: string;
    passwordCreateLabel: string;
    passwordMinDigits: string;
    passwordPlaceholder: string;
    passwordConfirmLabel: string;
    passwordConfirmPlaceholder: string;
    passwordMatch: string;
    passwordMismatch: string;
    warningPendingRulesPrefix: string;
    warningPendingRulesSuffix: string;
    viewPendingRulesBtn: string;
    declarationReminder: string;
    preferGoogleFormsLink: string;
    submitProcessing: string;
    submitConfirm: string;
    successTitle: string;
    successDesc: string;
    dashboardCreatedTitle: string;
    dashboardCreatedDesc: string;
    nextStepsTitle: string;
    nextStep1: string;
    nextStep2: string;
    nextStep3: string;
    enterDashboardNowBtn: string;
    confirmWhatsAppBtn: string;
    visitorModalTitle: string;
    visitorModalSubtitle: string;
    visitorSafetyNotice: string;
    visitorResidentNameLabel: string;
    visitorResidentUnitLabel: string;
    visitorNameLabel: string;
    visitorNamePlaceholder: string;
    visitorDocLabel: string;
    visitorDocPlaceholder: string;
    visitorPhoneLabel: string;
    visitorPhonePlaceholder: string;
    visitorRelationshipLabel: string;
    visitorFrequencyLabel: string;
    visitorOvernightLabel: string;
    visitorOvernightSub: string;
    visitorTermsDeclaration: string;
    visitorCancelBtn: string;
    visitorSubmitBtn: string;
}

const RULES_VIEW_I18N: Record<Language, RulesViewTranslations> = {
    pt: {
        backToHome: 'Voltar ao Início',
        rulesAndRegTitle: 'Regulamento & Cadastro',
        registerVisitBtn: 'Cadastrar Visita',
        googleFormsBtn: 'Google Forms',
        printBtn: 'Imprimir',
        heroBadge: 'Regulamento de Convivência & Cadastro Oficial',
        heroTitlePrefix: 'Aceite de Regras e ',
        heroTitleHighlight: 'Cadastro de Residente',
        heroSubtitle: 'Regras de Conduta Residencial MoronaVila',
        heroDesc: 'Para garantir um ambiente harmonioso, seguro, limpo e propício ao descanso e produtividade de todos, estabelecemos normas transparentes e iguais para todos os residentes da propriedade.',
        standardRatesTitle: 'Valores Padrão',
        ratesPerMonth: '/mês',
        rentAndCleaningNote: 'R$ 900 aluguel + R$ 60 taxa de limpeza das áreas comuns',
        monthPeriodRef: 'Ref. 1º ao último dia do mês',
        paidInAdvance: 'Pago antecipado até o 5º dia útil',
        exclusivePromoBadge: 'Promoção Exclusiva',
        promoDiscountNote: 'Desconto de R$ 100,00/mês por 6 meses',
        promoDetailsText: 'Até 10/11 será concedido desconto de 100 reais no aluguel mensal para novos residentes, por um período de 6 meses.',
        entryConditionsTitle: 'Condições de Entrada',
        depositPlusMonth: 'Depósito + Mês Corrente',
        entryConditionsDesc: 'Para entrada na casa é necessário 1 mês de aluguel como depósito + mês corrente à entrada.',
        depositCoversLastMonth: 'O depósito quita o período de 1 a 30(31) do último mês de permanência do residente.',
        pixDetailsTitle: 'Dados para Pagamento via PIX',
        pixBeneficiaryLabel: 'Favorecido:',
        pixKeyLabel: 'Chave PIX:',
        copyPixBtn: 'Copiar Chave PIX',
        copiedPixBtn: 'Chave Copiada!',
        mandatoryRuleAcceptanceTag: 'Aceite Obrigatório de Cada Item',
        the12RulesTitle: 'As 12 Regras de Conduta Residencial',
        the12RulesSubtitle: 'É obrigatório ler e dar o aceite individual em cada uma das 12 regras abaixo para poder concluir seu cadastro.',
        rulesAcceptedLabel: 'Aceites Realizados:',
        allRulesAcceptedBadge: '✓ Todas Aceitas',
        rulesAcceptedSuffix: 'Aceitas',
        finesTableTitle: 'Tabela e Aplicação de Multas por Infração',
        finesTableSubtitle: 'Segurança e monitoramento eletrônico 24 horas por dia em todas as áreas comuns',
        finesPolicyText: '"Os valores de multas aplicadas por infrações ao regulamento da casa serão anexados à fatura do mês subsequente e pagos diretamente via internet."',
        fineCards: [
            {
                title: 'Fumo & Bebidas Alcoólicas',
                value: 'R$ 20,00',
                note: 'por infração registrada',
                color: 'text-rose-400'
            },
            {
                title: 'Silêncio / Som ou TV Alto',
                value: 'R$ 20,00',
                note: 'por infração em qualquer horário',
                color: 'text-purple-400'
            },
            {
                title: 'Roupa no quarto / Peso lavanderia',
                value: 'R$ 20,00',
                note: 'por infração registrada',
                color: 'text-amber-400'
            },
            {
                title: 'Deixar cozinha / louça suja',
                value: 'R$ 20,00',
                note: 'por infração sumária',
                color: 'text-rose-400'
            },
            {
                title: 'Louça/Pertence fora do armário',
                value: 'R$ 10,00',
                note: 'por infração (item recolhido)',
                color: 'text-cyan-400'
            },
            {
                title: 'Entrada em quarto/banheiro alheio',
                value: 'R$ 50,00',
                note: 'por infração registrada',
                color: 'text-red-500'
            },
            {
                title: 'Lounge, Churrasqueira & Externa',
                value: 'R$ 20,00',
                note: 'por infração / danos / sujeira',
                color: 'text-rose-400'
            },
            {
                title: 'Eletrodomésticos Compartilhados',
                value: 'Cobrança Total',
                note: 'mau uso integral / rateio se técnico',
                color: 'text-amber-300'
            }
        ],
        googleFormsCardTag: 'Formulário Externo Oficial',
        googleFormsCardTitle: 'Formulário no Google Forms',
        googleFormsCardDesc: 'Você também pode preencher e assinar este termo diretamente pelo link oficial do Google Forms.',
        googleFormsOpenBtn: 'Abrir no Google Forms',
        googleFormsCopyBtn: 'Copiar Link',
        googleFormsCopiedBtn: 'Link Copiado!',
        formTag: 'Pré-Cadastro & Aceite Digital',
        formTitle: 'Formulário de Cadastro de Residente',
        formSubtitle: 'Preencha suas informações para formalizar seu aceite e dar entrada na casa',
        labelFullName: 'Nome Completo *',
        placeholderFullName: 'Seu nome completo',
        labelEmail: 'E-mail *',
        placeholderEmail: 'seuemail@exemplo.com',
        labelPhone: 'WhatsApp / Telefone *',
        placeholderPhone: '(21) 99999-9999',
        labelCpf: 'CPF *',
        placeholderCpf: '000.000.000-00',
        labelRg: 'RG / Órgão Emissor *',
        placeholderRg: '00.000.000-0 DETRAN',
        labelBirthDate: 'Data de Nascimento *',
        labelOriginAddress: 'Endereço Anterior / Cidade de Origem *',
        placeholderOriginAddress: 'Rua, Número, Bairro, Cidade - UF',
        labelFamilyAddress: 'Endereço da Família / Responsáveis *',
        placeholderFamilyAddress: 'Cidade e Bairro onde moram pais/familiares',
        labelDesiredRoom: 'Acomodação Pretendida *',
        roomOptions: {
            single: 'Quarto Individual (R$ 960/mês)',
            suite: 'Suíte Independente',
            studio: 'Studio MoronaVila',
            apartment: 'Apartamento Completo MoronaVila'
        },
        labelEntryDate: 'Data Prevista de Entrada *',
        labelOccupation: 'Profissão / Ocupação Atual *',
        placeholderOccupation: 'Ex: Engenheiro, Médico, Advogado, Autônomo',
        labelCompany: 'Empresa / Empregador *',
        placeholderCompany: "Nome da empresa ou 'Autônomo' / 'Concursado'",
        labelUniversity: 'Faculdade / Universidade',
        placeholderUniversity: 'Ex: UERJ, UFRJ, Estácio (se aplicável)',
        labelCourse: 'Curso / Área de Formação',
        placeholderCourse: 'Ex: Medicina, Direito, Computação',
        labelEmergencyName: 'Contato de Emergência (Nome) *',
        placeholderEmergencyName: 'Nome do familiar ou responsável',
        labelEmergencyPhone: 'Telefone de Emergência *',
        placeholderEmergencyPhone: '(21) 98888-8888',
        labelInstagram: 'Instagram (URL ou @) *',
        placeholderInstagram: 'seuperfil ou link',
        labelFacebook: 'Facebook (URL ou Nome) *',
        placeholderFacebook: 'facebook.com/seuperfil ou nome',
        docsSectionTitle: 'Imagens do Documento de Identidade (RG ou CNH) * Obrigatório',
        docsSectionDesc: 'É obrigatório anexar fotos legíveis da frente (com foto) e do verso do seu documento de identificação',
        docsSectionBadge: 'Obrigatório anexar ambos os lados',
        docFrontLabel: 'Frente do Documento',
        docFrontHint: '(com foto)',
        docFrontClick: 'Clique para enviar a Frente',
        docFrontTypeHint: 'RG com foto ou CNH',
        docChangeImage: 'Trocar Imagem',
        docFrontUploaded: 'Frente carregada',
        docBackLabel: 'Verso do Documento',
        docBackHint: '(ou CNH completa)',
        docBackClick: 'Clique para enviar o Verso',
        docBackTypeHint: 'Verso do RG ou comprovante',
        docBackUploaded: 'Verso carregado',
        passwordSectionTitle: 'Senha de Acesso ao seu Dashboard * Obrigatório',
        passwordSectionDesc: 'Defina uma senha pessoal. Com seu e-mail e esta senha, você entrará diretamente no seu Dashboard de Morador para gerenciar aluguel, lavanderia, visitantes e reparos.',
        passwordSectionBadge: 'Mínimo 6 caracteres',
        passwordCreateLabel: 'Criar Senha de Acesso *',
        passwordMinDigits: 'mínimo 6 dígitos',
        passwordPlaceholder: 'Digite sua senha de acesso',
        passwordConfirmLabel: 'Confirmar Senha *',
        passwordConfirmPlaceholder: 'Repita sua senha de acesso',
        passwordMatch: '✓ Coincidem',
        passwordMismatch: '✗ Não coincidem',
        warningPendingRulesPrefix: 'Atenção: É obrigatório dar o aceite em cada uma das 12 regras acima (',
        warningPendingRulesSuffix: 'aceitas).',
        viewPendingRulesBtn: 'Ver regras pendentes ↑',
        declarationReminder: 'Marque a caixa de declaração acima para confirmar o aceite geral e liberar o envio do cadastro.',
        preferGoogleFormsLink: 'Prefiro preencher pelo Google Forms',
        submitProcessing: 'Processando Aceite...',
        submitConfirm: 'Confirmar Aceite e Cadastro',
        successTitle: 'Aceite & Cadastro Registrados com Sucesso!',
        successDesc: 'Seus dados foram recebidos e seu aceite integral às 12 Regras de Conduta do Residencial Moronavila foi confirmado com sucesso.',
        dashboardCreatedTitle: 'Acesso ao seu Dashboard Criado',
        dashboardCreatedDesc: 'Sua senha de acesso foi cadastrada com sucesso. Use este e-mail e senha para entrar no seu Dashboard exclusivo do Morador.',
        nextStepsTitle: 'Próximos Passos:',
        nextStep1: '1. Realizar o pagamento do depósito caução via PIX para Sergio Oswaldo de Castro (chave: 21 983245000).',
        nextStep2: '2. Enviar o comprovante de pagamento para a administração no WhatsApp.',
        nextStep3: '3. Você também pode preencher no Google Forms para sua cópia de segurança.',
        enterDashboardNowBtn: 'Entrar no Meu Dashboard Agora',
        confirmWhatsAppBtn: 'Confirmar no WhatsApp',
        visitorModalTitle: 'Cadastro de Visita Autorizada',
        visitorModalSubtitle: 'Regra 1: Familiares ou convidados cadastrados (máx. 2 dias/semana)',
        visitorSafetyNotice: 'Não é permitido receber crianças ou animais de estimação. O visitante entra obrigatoriamente pelo interfone recebido pelo morador e não fica na casa sem ele.',
        visitorResidentNameLabel: 'Nome do Morador *',
        visitorResidentUnitLabel: 'Unidade / Quarto *',
        visitorNameLabel: 'Nome Completo do Visitante *',
        visitorNamePlaceholder: 'Nome completo de quem vai visitar',
        visitorDocLabel: 'CPF ou RG do Visitante *',
        visitorDocPlaceholder: '000.000.000-00',
        visitorPhoneLabel: 'WhatsApp do Visitante *',
        visitorPhonePlaceholder: '(21) 99999-9999',
        visitorRelationshipLabel: 'Parentesco ou Relação',
        visitorFrequencyLabel: 'Frequência (Máx. 2 dias/sem)',
        visitorOvernightLabel: 'Haverá pernoite na visita?',
        visitorOvernightSub: 'Permitido no máximo até 2 noites por semana',
        visitorTermsDeclaration: 'Declaro que o visitante está ciente e cumprirá todas as regras da propriedade (silêncio, proibição de álcool e fumo, sem pets e sem crianças), que será recebido por mim via interfone e que não permanecerá no imóvel sem minha presença.',
        visitorCancelBtn: 'Cancelar',
        visitorSubmitBtn: 'Salvar & Autorizar Visita'
    },
    en: {
        backToHome: 'Back to Home',
        rulesAndRegTitle: 'Guidelines & Registration',
        registerVisitBtn: 'Register Visitor',
        googleFormsBtn: 'Google Forms',
        printBtn: 'Print',
        heroBadge: 'Community Guidelines & Official Registration',
        heroTitlePrefix: 'House Rules Acceptance & ',
        heroTitleHighlight: 'Resident Registration',
        heroSubtitle: 'MoronaVila Residential Code of Conduct',
        heroDesc: 'To ensure a harmonious, safe, clean environment favorable to everyone’s rest and productivity, we establish transparent and equal standards for all property residents.',
        standardRatesTitle: 'Standard Rates',
        ratesPerMonth: '/month',
        rentAndCleaningNote: 'R$ 900 rent + R$ 60 common area cleaning fee',
        monthPeriodRef: 'Ref. 1st to the last day of the month',
        paidInAdvance: 'Paid in advance by the 5th business day',
        exclusivePromoBadge: 'Exclusive Promo',
        promoDiscountNote: 'R$ 100.00/month discount for 6 months',
        promoDetailsText: 'Until Nov 10, a R$ 100 discount on monthly rent will be granted to new residents for 6 months.',
        entryConditionsTitle: 'Move-in Conditions',
        depositPlusMonth: 'Security Deposit + Current Month',
        entryConditionsDesc: 'To move in, 1 month rent as security deposit + current month upon arrival is required.',
        depositCoversLastMonth: 'The deposit covers the 1st to 30th/31st of the resident’s final month of stay.',
        pixDetailsTitle: 'PIX Payment Information',
        pixBeneficiaryLabel: 'Beneficiary:',
        pixKeyLabel: 'PIX Key:',
        copyPixBtn: 'Copy PIX Key',
        copiedPixBtn: 'Key Copied!',
        mandatoryRuleAcceptanceTag: 'Mandatory Acceptance of Each Item',
        the12RulesTitle: 'The 12 Residential Conduct Rules',
        the12RulesSubtitle: 'It is mandatory to read and individually accept each of the 12 rules below to complete your registration.',
        rulesAcceptedLabel: 'Accepted Items:',
        allRulesAcceptedBadge: '✓ All Accepted',
        rulesAcceptedSuffix: 'Accepted',
        finesTableTitle: 'Violation Fines & Penalty Schedule',
        finesTableSubtitle: '24/7 security and electronic monitoring in all common areas',
        finesPolicyText: '"Fines applied for house rules violations will be attached to the following month invoice and paid directly online."',
        fineCards: [
            {
                title: 'Smoking & Alcoholic Beverages',
                value: 'R$ 20.00',
                note: 'per recorded violation',
                color: 'text-rose-400'
            },
            {
                title: 'Silence / Loud TV or Sound',
                value: 'R$ 20.00',
                note: 'per violation at any hour',
                color: 'text-purple-400'
            },
            {
                title: 'Clothes in Room / Laundry Limit',
                value: 'R$ 20.00',
                note: 'per recorded violation',
                color: 'text-amber-400'
            },
            {
                title: 'Leaving Kitchen / Dishes Dirty',
                value: 'R$ 20.00',
                note: 'per immediate violation',
                color: 'text-rose-400'
            },
            {
                title: 'Dishes/Items Outside Locker',
                value: 'R$ 10.00',
                note: 'per violation (item collected)',
                color: 'text-cyan-400'
            },
            {
                title: 'Entering Another Room/Bathroom',
                value: 'R$ 50.00',
                note: 'per recorded violation',
                color: 'text-red-500'
            },
            {
                title: 'Lounge, BBQ & Outdoor Area',
                value: 'R$ 20.00',
                note: 'per violation / damage / mess',
                color: 'text-rose-400'
            },
            {
                title: 'Shared Appliances Misuse',
                value: 'Full Cost',
                note: 'full misuse / shared if technical',
                color: 'text-amber-300'
            }
        ],
        googleFormsCardTag: 'Official External Form',
        googleFormsCardTitle: 'Google Forms Registration',
        googleFormsCardDesc: 'You can also fill out and sign this agreement directly via the official Google Forms link.',
        googleFormsOpenBtn: 'Open in Google Forms',
        googleFormsCopyBtn: 'Copy Link',
        googleFormsCopiedBtn: 'Link Copied!',
        formTag: 'Pre-Registration & Digital Acceptance',
        formTitle: 'Resident Registration Form',
        formSubtitle: 'Fill in your details to formalize your acceptance and complete your move-in',
        labelFullName: 'Full Name *',
        placeholderFullName: 'Your full name',
        labelEmail: 'Email Address *',
        placeholderEmail: 'yourname@example.com',
        labelPhone: 'WhatsApp / Phone *',
        placeholderPhone: '+1 (555) 000-0000',
        labelCpf: 'Tax ID / Passport / CPF *',
        placeholderCpf: 'ID or Passport Number',
        labelRg: 'ID / Issuing Agency *',
        placeholderRg: 'ID number & authority',
        labelBirthDate: 'Date of Birth *',
        labelOriginAddress: 'Previous Address / Hometown *',
        placeholderOriginAddress: 'Street, Number, Neighborhood, City - State/Country',
        labelFamilyAddress: 'Family / Guardians Address *',
        placeholderFamilyAddress: 'City and neighborhood where parents/family reside',
        labelDesiredRoom: 'Desired Accommodation *',
        roomOptions: {
            single: 'Single Room (R$ 960/mo)',
            suite: 'Private Suite',
            studio: 'MoronaVila Studio',
            apartment: 'Full MoronaVila Apartment'
        },
        labelEntryDate: 'Expected Move-in Date *',
        labelOccupation: 'Current Profession / Occupation *',
        placeholderOccupation: 'E.g., Engineer, Physician, Lawyer, Freelancer',
        labelCompany: 'Company / Employer *',
        placeholderCompany: "Company name or 'Self-employed' / 'Civil Servant'",
        labelUniversity: 'College / University',
        placeholderUniversity: 'E.g., UERJ, UFRJ, NYU (if applicable)',
        labelCourse: 'Course / Field of Study',
        placeholderCourse: 'E.g., Medicine, Law, Computer Science',
        labelEmergencyName: 'Emergency Contact (Name) *',
        placeholderEmergencyName: 'Name of relative or guardian',
        labelEmergencyPhone: 'Emergency Contact Phone *',
        placeholderEmergencyPhone: '+1 (555) 000-0000',
        labelInstagram: 'Instagram (URL or @) *',
        placeholderInstagram: 'yourprofile or URL',
        labelFacebook: 'Facebook (URL or Name) *',
        placeholderFacebook: 'facebook.com/yourprofile or name',
        docsSectionTitle: 'Identity Document Photos (ID or Driver License) * Required',
        docsSectionDesc: 'Legible photos of both the front (with photo) and back of your identification document are required',
        docsSectionBadge: 'Both sides required',
        docFrontLabel: 'Front of Document',
        docFrontHint: '(with photo)',
        docFrontClick: 'Click to upload Front',
        docFrontTypeHint: 'ID with photo or Driver License',
        docChangeImage: 'Change Image',
        docFrontUploaded: 'Front uploaded',
        docBackLabel: 'Back of Document',
        docBackHint: '(or full document)',
        docBackClick: 'Click to upload Back',
        docBackTypeHint: 'Back of ID or proof',
        docBackUploaded: 'Back uploaded',
        passwordSectionTitle: 'Dashboard Access Password * Required',
        passwordSectionDesc: 'Set a personal password. With your email and this password, you will access your Resident Dashboard directly to manage rent, laundry, visitors, and repairs.',
        passwordSectionBadge: 'Minimum 6 characters',
        passwordCreateLabel: 'Create Access Password *',
        passwordMinDigits: 'minimum 6 characters',
        passwordPlaceholder: 'Enter your access password',
        passwordConfirmLabel: 'Confirm Password *',
        passwordConfirmPlaceholder: 'Repeat your access password',
        passwordMatch: '✓ Match',
        passwordMismatch: '✗ Do not match',
        warningPendingRulesPrefix: 'Attention: It is mandatory to accept each of the 12 rules above (',
        warningPendingRulesSuffix: 'accepted).',
        viewPendingRulesBtn: 'View pending rules ↑',
        declarationReminder: 'Check the declaration box above to confirm overall acceptance and enable registration submission.',
        preferGoogleFormsLink: 'I prefer to fill out Google Forms',
        submitProcessing: 'Processing Acceptance...',
        submitConfirm: 'Confirm Acceptance & Register',
        successTitle: 'Acceptance & Registration Completed Successfully!',
        successDesc: 'Your details have been received and your full acceptance of the 12 Moronavila Residential Conduct Rules has been confirmed.',
        dashboardCreatedTitle: 'Dashboard Access Created',
        dashboardCreatedDesc: 'Your access password was registered successfully. Use this email and password to log in to your exclusive Resident Dashboard.',
        nextStepsTitle: 'Next Steps:',
        nextStep1: '1. Make the security deposit payment via PIX to Sergio Oswaldo de Castro (key: 21 983245000).',
        nextStep2: '2. Send payment receipt to the management team via WhatsApp.',
        nextStep3: '3. You can also fill out Google Forms for your backup copy.',
        enterDashboardNowBtn: 'Enter My Dashboard Now',
        confirmWhatsAppBtn: 'Confirm on WhatsApp',
        visitorModalTitle: 'Authorized Visitor Registration',
        visitorModalSubtitle: 'Rule 1: Registered relatives or guests (max 2 days/week)',
        visitorSafetyNotice: 'Children and pets are not permitted. Visitors must enter through the intercom with the resident and may not stay unaccompanied.',
        visitorResidentNameLabel: 'Resident Name *',
        visitorResidentUnitLabel: 'Unit / Room *',
        visitorNameLabel: 'Visitor Full Name *',
        visitorNamePlaceholder: 'Full name of the person visiting',
        visitorDocLabel: 'Visitor ID or Passport *',
        visitorDocPlaceholder: '000.000.000-00',
        visitorPhoneLabel: 'Visitor WhatsApp / Phone *',
        visitorPhonePlaceholder: '+1 (555) 000-0000',
        visitorRelationshipLabel: 'Relationship',
        visitorFrequencyLabel: 'Frequency (Max 2 days/week)',
        visitorOvernightLabel: 'Will the visitor stay overnight?',
        visitorOvernightSub: 'Allowed up to a maximum of 2 nights per week',
        visitorTermsDeclaration: 'I declare that the visitor is aware of and will comply with all property rules (silence, no alcohol or smoking, no pets, no children), will be received by me via intercom, and will not remain in the house without my presence.',
        visitorCancelBtn: 'Cancel',
        visitorSubmitBtn: 'Save & Authorize Visitor'
    },
    es: {
        backToHome: 'Volver al Inicio',
        rulesAndRegTitle: 'Reglamento y Registro',
        registerVisitBtn: 'Registrar Visita',
        googleFormsBtn: 'Google Forms',
        printBtn: 'Imprimir',
        heroBadge: 'Reglamento de Convivencia y Registro Oficial',
        heroTitlePrefix: 'Aceptación de Reglas y ',
        heroTitleHighlight: 'Registro de Residente',
        heroSubtitle: 'Reglas de Conducta Residencial MoronaVila',
        heroDesc: 'Para garantizar un ambiente armonioso, seguro, limpio y propicio para el descanso y la productividad de todos, establecemos normas transparentes e iguales para todos los residentes de la propiedad.',
        standardRatesTitle: 'Valores Estándar',
        ratesPerMonth: '/mes',
        rentAndCleaningNote: 'R$ 900 alquiler + R$ 60 tarifa de limpieza de áreas comunes',
        monthPeriodRef: 'Ref. 1º al último día del mes',
        paidInAdvance: 'Pago por adelantado hasta el 5º día hábil',
        exclusivePromoBadge: 'Promoción Exclusiva',
        promoDiscountNote: 'Desconto de R$ 100,00/mes por 6 meses',
        promoDetailsText: 'Hasta el 10/11 se otorgará un descuento de 100 reales en el alquiler mensual para nuevos residentes durante 6 meses.',
        entryConditionsTitle: 'Condiciones de Ingreso',
        depositPlusMonth: 'Depósito + Mes Corriente',
        entryConditionsDesc: 'Para ingresar a la casa se requiere 1 mes de alquiler como depósito + el mes corriente de llegada.',
        depositCoversLastMonth: 'El depósito salda el período del 1 al 30(31) del último mes de estadía del residente.',
        pixDetailsTitle: 'Datos para Pago vía PIX',
        pixBeneficiaryLabel: 'Beneficiario:',
        pixKeyLabel: 'Clave PIX:',
        copyPixBtn: 'Copiar Clave PIX',
        copiedPixBtn: '¡Clave Copiada!',
        mandatoryRuleAcceptanceTag: 'Aceptación Obligatoria de Cada Ítem',
        the12RulesTitle: 'Las 12 Reglas de Conducta Residencial',
        the12RulesSubtitle: 'Es obligatorio leer y aceptar individualmente cada una de las 12 reglas siguientes para completar su registro.',
        rulesAcceptedLabel: 'Aceptaciones Realizadas:',
        allRulesAcceptedBadge: '✓ Todas Aceptadas',
        rulesAcceptedSuffix: 'Aceptadas',
        finesTableTitle: 'Tabla y Aplicación de Multas por Infracción',
        finesTableSubtitle: 'Seguridad y monitoreo electrónico 24 horas al día en todas las áreas comunes',
        finesPolicyText: '"Los valores de las multas aplicadas por infracciones al reglamento de la casa serán agregados a la factura del mes siguiente y abonados directamente por internet."',
        fineCards: [
            {
                title: 'Fumar y Bebidas Alcohólicas',
                value: 'R$ 20,00',
                note: 'por infracción registrada',
                color: 'text-rose-400'
            },
            {
                title: 'Silencio / Sonido o TV Alto',
                value: 'R$ 20,00',
                note: 'por infracción en cualquier horario',
                color: 'text-purple-400'
            },
            {
                title: 'Ropa en habitación / Peso lavandería',
                value: 'R$ 20,00',
                note: 'por infracción registrada',
                color: 'text-amber-400'
            },
            {
                title: 'Dejar cocina / vajilla sucia',
                value: 'R$ 20,00',
                note: 'por infracción sumaria',
                color: 'text-rose-400'
            },
            {
                title: 'Vajilla/Pertenencias fuera del armario',
                value: 'R$ 10,00',
                note: 'por infracción (ítem retirado)',
                color: 'text-cyan-400'
            },
            {
                title: 'Ingreso a habitación/baño ajeno',
                value: 'R$ 50,00',
                note: 'por infracción registrada',
                color: 'text-red-500'
            },
            {
                title: 'Lounge, Parrilla y Área Exterior',
                value: 'R$ 20,00',
                note: 'por infracción / daños / suciedad',
                color: 'text-rose-400'
            },
            {
                title: 'Electrodomésticos Compartidos',
                value: 'Cobro Total',
                note: 'mal uso integral / prorrateo si es técnico',
                color: 'text-amber-300'
            }
        ],
        googleFormsCardTag: 'Formulario Externo Oficial',
        googleFormsCardTitle: 'Formulario en Google Forms',
        googleFormsCardDesc: 'También puede completar y firmar este acuerdo directamente a través del enlace oficial de Google Forms.',
        googleFormsOpenBtn: 'Abrir en Google Forms',
        googleFormsCopyBtn: 'Copiar Enlace',
        googleFormsCopiedBtn: '¡Enlace Copiado!',
        formTag: 'Pre-Registro y Aceptación Digital',
        formTitle: 'Formulario de Registro de Residente',
        formSubtitle: 'Complete sus datos para formalizar su aceptación e ingresar a la casa',
        labelFullName: 'Nombre Completo *',
        placeholderFullName: 'Su nombre completo',
        labelEmail: 'Correo Electrónico *',
        placeholderEmail: 'sucorreo@ejemplo.com',
        labelPhone: 'WhatsApp / Teléfono *',
        placeholderPhone: '+34 600 000 000',
        labelCpf: 'DNI / Pasaporte / CPF *',
        placeholderCpf: 'Número de documento o pasaporte',
        labelRg: 'Documento de Identidad / Emisor *',
        placeholderRg: 'Número de documento y emisor',
        labelBirthDate: 'Fecha de Nacimiento *',
        labelOriginAddress: 'Dirección Anterior / Ciudad de Origen *',
        placeholderOriginAddress: 'Calle, Número, Barrio, Ciudad, País',
        labelFamilyAddress: 'Dirección de Familiares / Responsables *',
        placeholderFamilyAddress: 'Ciudad y barrio donde viven los familiares',
        labelDesiredRoom: 'Alojamiento Deseado *',
        roomOptions: {
            single: 'Habitación Individual (R$ 960/mes)',
            suite: 'Suite Independiente',
            studio: 'Estudio MoronaVila',
            apartment: 'Apartamento Completo MoronaVila'
        },
        labelEntryDate: 'Fecha Prevista de Ingreso *',
        labelOccupation: 'Profesión / Ocupación Actual *',
        placeholderOccupation: 'Ej: Ingeniero, Médico, Abogado, Independiente',
        labelCompany: 'Empresa / Empleador *',
        placeholderCompany: "Nombre de la empresa o 'Independiente'",
        labelUniversity: 'Facultad / Universidad',
        placeholderUniversity: 'Ej: UERJ, UFRJ, Universidad (si aplica)',
        labelCourse: 'Carrera / Área de Estudio',
        placeholderCourse: 'Ej: Medicina, Derecho, Computación',
        labelEmergencyName: 'Contacto de Emergencia (Nombre) *',
        placeholderEmergencyName: 'Nombre del familiar o responsable',
        labelEmergencyPhone: 'Teléfono de Emergencia *',
        placeholderEmergencyPhone: '+34 600 000 000',
        labelInstagram: 'Instagram (URL o @) *',
        placeholderInstagram: 'tuperfil o enlace',
        labelFacebook: 'Facebook (URL o Nombre) *',
        placeholderFacebook: 'facebook.com/tuperfil o nombre',
        docsSectionTitle: 'Imágenes del Documento de Identidad (DNI o Licencia) * Obligatorio',
        docsSectionDesc: 'Es obligatorio adjuntar fotos legibles del frente (con foto) y del reverso de su documento de identificación',
        docsSectionBadge: 'Obligatorio adjuntar ambos lados',
        docFrontLabel: 'Frente del Documento',
        docFrontHint: '(con foto)',
        docFrontClick: 'Haga clic para subir el Frente',
        docFrontTypeHint: 'DNI con foto o Licencia',
        docChangeImage: 'Cambiar Imagen',
        docFrontUploaded: 'Frente subido',
        docBackLabel: 'Reverso del Documento',
        docBackHint: '(o documento completo)',
        docBackClick: 'Haga clic para subir el Reverso',
        docBackTypeHint: 'Reverso del documento o comprobante',
        docBackUploaded: 'Reverso subido',
        passwordSectionTitle: 'Contraseña de Acceso al Dashboard * Obligatoria',
        passwordSectionDesc: 'Establezca una contraseña personal. Con su correo y esta contraseña, accederá directamente a su Dashboard de Residente para gestionar alquiler, lavandería, visitas y mantenimiento.',
        passwordSectionBadge: 'Mínimo 6 caracteres',
        passwordCreateLabel: 'Crear Contraseña de Acceso *',
        passwordMinDigits: 'mínimo 6 dígitos',
        passwordPlaceholder: 'Ingrese su contraseña de acceso',
        passwordConfirmLabel: 'Confirmar Contraseña *',
        passwordConfirmPlaceholder: 'Repita su contraseña de acceso',
        passwordMatch: '✓ Coinciden',
        passwordMismatch: '✗ No coinciden',
        warningPendingRulesPrefix: 'Atención: Es obligatorio aceptar cada una de las 12 reglas anteriores (',
        warningPendingRulesSuffix: 'aceptadas).',
        viewPendingRulesBtn: 'Ver reglas pendientes ↑',
        declarationReminder: 'Marque la casilla de declaración anterior para confirmar la aceptación general y habilitar el envío del registro.',
        preferGoogleFormsLink: 'Prefiero completar en Google Forms',
        submitProcessing: 'Procesando Aceptación...',
        submitConfirm: 'Confirmar Aceptación y Registro',
        successTitle: '¡Aceptación y Registro Realizados con Éxito!',
        successDesc: 'Sus datos fueron recibidos y su aceptación integral de las 12 Reglas de Convivencia de Residencial Moronavila fue confirmada con éxito.',
        dashboardCreatedTitle: 'Acceso a su Dashboard Creado',
        dashboardCreatedDesc: 'Su contraseña de acceso fue registrada con éxito. Use este correo y contraseña para ingresar a su Dashboard exclusivo de Residente.',
        nextStepsTitle: 'Próximos Pasos:',
        nextStep1: '1. Realizar el pago del depósito de garantía vía PIX a Sergio Oswaldo de Castro (clave: 21 983245000).',
        nextStep2: '2. Enviar el comprobante de pago a la administración por WhatsApp.',
        nextStep3: '3. También puede completar el formulario de Google para su copia de seguridad.',
        enterDashboardNowBtn: 'Entrar a Mi Dashboard Ahora',
        confirmWhatsAppBtn: 'Confirmar en WhatsApp',
        visitorModalTitle: 'Registro de Visita Autorizada',
        visitorModalSubtitle: 'Regla 1: Familiares o invitados registrados (máx. 2 días/semana)',
        visitorSafetyNotice: 'No se permite el ingreso de niños ni mascotas. El visitante entra obligatoriamente por el intercomunicador recibido por el residente y no permanece en la casa sin él.',
        visitorResidentNameLabel: 'Nombre del Residente *',
        visitorResidentUnitLabel: 'Unidad / Habitación *',
        visitorNameLabel: 'Nombre Completo del Visitante *',
        visitorNamePlaceholder: 'Nombre completo de quien va a visitar',
        visitorDocLabel: 'DNI o Pasaporte del Visitante *',
        visitorDocPlaceholder: '000.000.000-00',
        visitorPhoneLabel: 'WhatsApp del Visitante *',
        visitorPhonePlaceholder: '+34 600 000 000',
        visitorRelationshipLabel: 'Parentesco o Relación',
        visitorFrequencyLabel: 'Frecuencia (Máx. 2 días/sem)',
        visitorOvernightLabel: '¿Habrá pernocte en la visita?',
        visitorOvernightSub: 'Permitido como máximo hasta 2 noches por semana',
        visitorTermsDeclaration: 'Declaro que el visitante está al tanto y cumplirá todas las reglas de la propiedad (silencio, prohibición de alcohol y tabaco, sin mascotas y sin niños), que será recibido por mí vía intercomunicador y que no permanecerá en la vivienda sin mi presencia.',
        visitorCancelBtn: 'Cancelar',
        visitorSubmitBtn: 'Guardar y Autorizar Visita'
    }
};

interface RulesAcceptanceViewProps {
    onBack: () => void;
    currentUser?: Resident | null;
}

export interface AuthorizedVisitor {
    id: string;
    residentName: string;
    residentUnit: string;
    visitorName: string;
    visitorDoc: string;
    visitorPhone: string;
    relationship: string;
    daysPerWeek: string;
    overnight: boolean;
    registeredAt: string;
    status: 'Autorizado' | 'Pendente';
}

export const RULES_DATA = [
    {
        id: 1,
        title: 'Visitas & Segurança',
        description: 'Visitas apenas para membros da família do residente ou pessoas previamente cadastradas por no máximo dois dias por semana. Por questões de segurança não podemos receber crianças ou animais de estimação. O visitante só entra após prévio cadastro e recebimento via interfone pelo próprio morador.',
        tags: ['Familiares ou Cadastrados', 'Máx. 2 dias/semana', 'Sem crianças', 'Sem animais de estimação'],
        actionText: 'Cadastrar Visita Autorizada',
        icon: Users,
        color: 'indigo'
    },
    {
        id: 2,
        title: 'Proibição de Fumo e Álcool',
        description: 'Não é permitido fumar nem beber bebidas alcoólicas em nenhuma dependência da propriedade. As infrações registradas por câmeras ou relatos comprovados acarretarão multa de R$ 20,00 por ocorrência.',
        tags: ['Tolerância zero', 'Proibido fumar', 'Sem bebidas alcoólicas', 'Multa de R$ 20,00', 'Todas as áreas'],
        fine: 'R$ 20,00 por infração',
        icon: Ban,
        color: 'rose'
    },
    {
        id: 3,
        title: 'Passar e Lavar Roupas & Lavanderia',
        description: 'Não é permitido passar roupa nos quartos (há um espaço na sala para isso) bem como não é permitido lavar roupa no banheiro do quarto, o uso da lavanderia precisa ser agendada com a administração. A lavagem de roupa na máquina é limitada a uma vez por semana e não poderá exceder o limite de peso do equipamento. As câmeras de segurança registrarão as infrações e os responsáveis receberão uma multa de R$ 20,00 por infração.',
        tags: ['Passar roupa na sala', 'Proibido lavar no quarto', 'Agendar lavanderia', '1x por semana', 'Limite de peso', 'Multa de R$ 20,00'],
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
        description: 'Não é permitido som ou TV em volume alto em qualquer horário. O descumprimento do silêncio e do sossego alheio acarretará multa de R$ 20,00 por ocorrência registrada.',
        tags: ['Silêncio 24h', 'Qualquer horário', 'Respeito ao descanso alheio', 'Multa de R$ 20,00'],
        fine: 'R$ 20,00 por infração',
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
        description: 'Pratos, copos, talheres e outros pertences individuais devem ser guardados nos respectivos armários individuais da cozinha, qualquer item deixado fora será recolhido e o residente estará sujeito a multa de R$ 10,00 por infração.',
        tags: ['Armários individuais', 'Guarda obrigatória', 'Itens fora serão recolhidos', 'Multa de R$ 10,00'],
        fine: 'R$ 10,00 por infração',
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
    },
    {
        id: 11,
        title: 'Regras de Uso dos Eletrodomésticos de Uso Compartilhado',
        description: 'Os eletrodomésticos e utensílios das partes compartilhadas deverão ser usados com zelo e caso haja necessidade de reposição ou manutenção por problemas técnicos o valor será rateado por todos os residentes independente de terem usado ou não. Os problemas ocasionados por mau uso e registrados pelas câmeras de segurança implicarão na cobrança total do reparo ou reposição do residente responsável pelo problema.',
        tags: ['Eletrodomésticos', 'Uso com zelo', 'Rateio por falha técnica', 'Cobrança total por mau uso', 'Câmeras 24h'],
        fine: 'Cobrança total do reparo ou reposição por mau uso',
        icon: Plug,
        color: 'amber'
    },
    {
        id: 12,
        title: 'Uso do Lounge, Churrasqueira e Área Externa da Casa',
        description: 'Os residentes que por ventura desejarem usar essas áreas da casa se responsabilizam pela limpeza após o uso e por quaisquer danos que possam ocorrer e multa de 20 reais por infração.',
        tags: ['Lounge e Churrasqueira', 'Área externa', 'Limpeza obrigatória após uso', 'Responsabilidade por danos', 'Multa de R$ 20,00'],
        fine: 'R$ 20,00 por infração',
        icon: Flame,
        color: 'rose'
    }
];

export function RulesAcceptanceView({ onBack, currentUser }: RulesAcceptanceViewProps) {
    const googleFormsUrl = 'https://forms.gle/nQnbXWZgQesmoUmm6';
    const pixKey = '(21) 983245000';
    const pixBeneficiary = 'Sergio Oswaldo de Castro';

    const [currentLang, setCurrentLang] = useState<Language>(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang') as Language;
        if (langParam && (langParam === 'pt' || langParam === 'en' || langParam === 'es')) {
            return langParam;
        }
        const saved = localStorage.getItem('moronavila_lang') as Language;
        return (saved === 'pt' || saved === 'en' || saved === 'es') ? saved : 'pt';
    });

    const handleLanguageChange = (lang: Language) => {
        setCurrentLang(lang);
        localStorage.setItem('moronavila_lang', lang);
        const url = new URL(window.location.href);
        url.searchParams.set('lang', lang);
        window.history.replaceState({}, '', url.toString());
    };

    const t = TRANSLATIONS[currentLang];
    const rvt = RULES_VIEW_I18N[currentLang] || RULES_VIEW_I18N.pt;

    const [copiedPix, setCopiedPix] = useState(false);
    const [copiedFormUrl, setCopiedFormUrl] = useState(false);
    const [acceptedRules, setAcceptedRules] = useState<Record<number, boolean>>({});
    const [acceptedAll, setAcceptedAll] = useState(false);

    // Modal de Cadastro de Visita Autorizada
    const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
    const [visitorSuccess, setVisitorSuccess] = useState(false);
    const [visitorProtocol, setVisitorProtocol] = useState('');
    const [authorizedVisitors, setAuthorizedVisitors] = useState<AuthorizedVisitor[]>([]);

    const [visitorForm, setVisitorForm] = useState({
        residentName: currentUser?.name || '',
        residentUnit: '',
        visitorName: '',
        visitorDoc: '',
        visitorPhone: '',
        relationship: 'Familiar',
        daysPerWeek: '2 dias por semana',
        overnight: false,
        notes: '',
        termsAccepted: false
    });

    // Carregar visitas salvas localmente
    useEffect(() => {
        try {
            const saved = localStorage.getItem('vpr_authorized_visitors');
            if (saved) {
                setAuthorizedVisitors(JSON.parse(saved));
            }
        } catch (e) {
            console.error('Erro ao ler visitas autorizadas:', e);
        }
    }, []);

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
        university: (currentUser as any)?.university || '',
        course: (currentUser as any)?.course || '',
        instagram: currentUser?.instagram || '',
        facebook: (currentUser as any)?.facebook || '',
        desired_room_type: 'Quarto Individual',
        entry_date: ''
    });

    // Upload de Imagens de Documentos de Identidade
    const [docFrontFile, setDocFrontFile] = useState<File | null>(null);
    const [docFrontPreview, setDocFrontPreview] = useState<string | null>(null);
    const [docBackFile, setDocBackFile] = useState<File | null>(null);
    const [docBackPreview, setDocBackPreview] = useState<string | null>(null);

    const handleDocFrontSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setDocFrontFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setDocFrontPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleDocBackSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setDocBackFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setDocBackPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveDocFront = () => {
        setDocFrontFile(null);
        setDocFrontPreview(null);
    };

    const handleRemoveDocBack = () => {
        setDocBackFile(null);
        setDocBackPreview(null);
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [showDetailedForm, setShowDetailedForm] = useState(true);

    // Senha de Acesso ao Dashboard do Morador
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

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

    const acceptedCount = RULES_DATA.filter(r => !!acceptedRules[r.id]).length;
    const allRulesAccepted = acceptedCount === RULES_DATA.length;

    const handleToggleRule = (id: number) => {
        setAcceptedRules(prev => {
            const updated = { ...prev, [id]: !prev[id] };
            const allChecked = RULES_DATA.every(r => updated[r.id]);
            if (!allChecked) {
                setAcceptedAll(false);
            }
            return updated;
        });
    };

    const handleToggleAcceptAll = () => {
        if (!allRulesAccepted && !acceptedAll) {
            setSubmitError(`É obrigatório aceitar individualmente cada uma das 12 regras antes de assinar a declaração final. Você aceitou ${acceptedCount} de 12 regras.`);
            const rulesSection = document.getElementById('secao-regras');
            if (rulesSection) {
                rulesSection.scrollIntoView({ behavior: 'smooth' });
            }
            return;
        }
        setAcceptedAll(!acceptedAll);
    };

    const handleVisitorSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!visitorForm.visitorName.trim() || !visitorForm.visitorDoc.trim() || !visitorForm.visitorPhone.trim()) {
            alert('Por favor, preencha todos os campos obrigatórios do visitante (Nome, Documento e Telefone).');
            return;
        }

        if (!visitorForm.termsAccepted) {
            alert('É obrigatório declarar ciência e responsabilidade sobre as regras da residência.');
            return;
        }

        const protocol = `MV-VIS-${Math.floor(1000 + Math.random() * 9000)}`;
        const newVisitor: AuthorizedVisitor = {
            id: protocol,
            residentName: visitorForm.residentName || 'Residente',
            residentUnit: visitorForm.residentUnit || 'Geral',
            visitorName: visitorForm.visitorName,
            visitorDoc: visitorForm.visitorDoc,
            visitorPhone: visitorForm.visitorPhone,
            relationship: visitorForm.relationship,
            daysPerWeek: visitorForm.daysPerWeek,
            overnight: visitorForm.overnight,
            registeredAt: new Date().toLocaleDateString('pt-BR'),
            status: 'Autorizado'
        };

        const updated = [newVisitor, ...authorizedVisitors];
        setAuthorizedVisitors(updated);
        try {
            localStorage.setItem('vpr_authorized_visitors', JSON.stringify(updated));
        } catch (err) {
            console.error('Erro ao salvar localmente:', err);
        }

        setVisitorProtocol(protocol);
        setVisitorSuccess(true);
    };

    const handleSendVisitorWhatsApp = () => {
        const text = `*CADASTRO DE VISITA AUTORIZADA - MORONAVILA*%0A` +
            `*Protocolo:* ${visitorProtocol}%0A%0A` +
            `*Morador(a):* ${visitorForm.residentName}%0A` +
            `*Unidade/Quarto:* ${visitorForm.residentUnit}%0A` +
            `*Nome do Visitante:* ${visitorForm.visitorName}%0A` +
            `*CPF/RG do Visitante:* ${visitorForm.visitorDoc}%0A` +
            `*WhatsApp do Visitante:* ${visitorForm.visitorPhone}%0A` +
            `*Relação/Parentesco:* ${visitorForm.relationship}%0A` +
            `*Frequência:* ${visitorForm.daysPerWeek}%0A` +
            `*Pernoite:* ${visitorForm.overnight ? 'Sim (máx. 2 noites/semana)' : 'Não'}%0A` +
            `*Observações:* ${visitorForm.notes || 'Nenhuma'}%0A%0A` +
            `_Declaro que o visitante cumprirá rigorosamente as regras da casa (silêncio, sem fumo/álcool, sem crianças/pets) e entrará pelo interfone sob minha responsabilidade direta._`;

        window.open(`https://wa.me/5521983245000?text=${text}`, '_blank');
    };

    const handleSubmitRegistration = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError('');

        if (!allRulesAccepted) {
            const missing = RULES_DATA.filter(r => !acceptedRules[r.id]);
            setSubmitError(`É obrigatório aceitar individualmente cada uma das 12 regras. Faltam ${missing.length} regra(s) para aceitar.`);
            const rulesSection = document.getElementById('secao-regras');
            if (rulesSection) rulesSection.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        if (!acceptedAll) {
            setSubmitError('É obrigatório marcar e assinar a Declaração Formal de Aceite Integral das Regras.');
            return;
        }

        // Validação obrigatória de TODOS os campos cadastrais
        if (!formData.name.trim()) {
            setSubmitError('Por favor, informe seu Nome Completo.');
            return;
        }
        if (!formData.email.trim()) {
            setSubmitError('Por favor, informe seu E-mail de contato.');
            return;
        }
        if (!formData.phone.trim()) {
            setSubmitError('Por favor, informe seu WhatsApp / Telefone principal.');
            return;
        }
        if (!formData.cpf.trim()) {
            setSubmitError('Por favor, informe seu CPF.');
            return;
        }
        if (!formData.rg.trim()) {
            setSubmitError('Por favor, informe seu RG com Órgão Emissor.');
            return;
        }
        if (!formData.birth_date.trim()) {
            setSubmitError('Por favor, informe sua Data de Nascimento.');
            return;
        }
        if (!formData.origin_address.trim()) {
            setSubmitError('Por favor, informe seu Endereço Anterior / Cidade de Origem.');
            return;
        }
        if (!formData.family_address.trim()) {
            setSubmitError('Por favor, informe o Endereço de seus Familiares / Pais.');
            return;
        }
        if (!formData.emergency_contact_name.trim()) {
            setSubmitError('Por favor, informe o Nome do seu Contato de Emergência.');
            return;
        }
        if (!formData.emergency_contact_phone.trim()) {
            setSubmitError('Por favor, informe o WhatsApp / Telefone do Contato de Emergência.');
            return;
        }
        if (!formData.occupation.trim()) {
            setSubmitError('Por favor, informe sua Profissão / Ocupação Atual.');
            return;
        }
        if (!formData.company.trim()) {
            setSubmitError('Por favor, informe sua Empresa / Local de Trabalho (ou informe Autônomo).');
            return;
        }
        if (!formData.instagram.trim()) {
            setSubmitError('Por favor, informe seu Instagram (@usuario ou link do perfil).');
            return;
        }
        if (!formData.facebook.trim()) {
            setSubmitError('Por favor, informe seu Facebook (link do perfil ou nome no Facebook).');
            return;
        }
        if (!formData.desired_room_type.trim()) {
            setSubmitError('Por favor, selecione a Acomodação Pretendida.');
            return;
        }
        if (!formData.entry_date.trim()) {
            setSubmitError('Por favor, informe a Data Prevista de Entrada / Mudança.');
            return;
        }
        if (!docFrontFile && !docFrontPreview) {
            setSubmitError('É obrigatório anexar a foto da Frente do seu Documento de Identidade (RG ou CNH com foto).');
            return;
        }
        if (!docBackFile && !docBackPreview) {
            setSubmitError('É obrigatório anexar a foto do Verso do seu Documento de Identidade (ou CNH completa).');
            return;
        }
        if (!password || password.trim().length < 6) {
            setSubmitError('Por favor, crie uma Senha de Acesso com no mínimo 6 caracteres para entrar no seu Dashboard.');
            return;
        }
        if (password !== confirmPassword) {
            setSubmitError('A confirmação de senha não confere com a senha digitada.');
            return;
        }

        setIsSubmitting(true);

        try {
            let docFrontUrl = docFrontPreview || '';
            let docBackUrl = docBackPreview || '';

            // Realiza upload das fotos dos documentos para o bucket resident-documents
            if (docFrontFile) {
                try {
                    docFrontUrl = await uploadResidentDocument(docFrontFile, 'doc_frente');
                } catch (e: any) {
                    console.warn('Upload doc frente:', e);
                }
            }

            if (docBackFile) {
                try {
                    docBackUrl = await uploadResidentDocument(docBackFile, 'doc_verso');
                } catch (e: any) {
                    console.warn('Upload doc verso:', e);
                }
            }

            await createResident({
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                phone: formData.phone.trim(),
                cpf: formData.cpf.trim(),
                rg: formData.rg.trim(),
                birth_date: formData.birth_date.trim(),
                origin_address: formData.origin_address.trim(),
                family_address: formData.family_address.trim(),
                emergency_contact_name: formData.emergency_contact_name.trim(),
                emergency_contact_phone: formData.emergency_contact_phone.trim(),
                occupation: formData.occupation.trim(),
                company: formData.company.trim(),
                university: (formData.university || '').trim(),
                course: (formData.course || '').trim(),
                instagram: formData.instagram.trim(),
                facebook: formData.facebook.trim(),
                desired_room_type: formData.desired_room_type.trim(),
                document_front_url: docFrontUrl,
                document_back_url: docBackUrl,
                document_urls: [docFrontUrl, docBackUrl].filter(Boolean),
                entry_date: formData.entry_date || new Date().toISOString().split('T')[0],
                status: 'Candidato',
                role: UserRole.RESIDENT,
                habilitado: false,
                motivo_bloqueio: 'Aguardando aprovação da administração.',
                internet_active: false,
                rent_value: 900,
                cleaning_fee: 60,
                password: password.trim()
            });

            // Tenta autenticar automaticamente com a credencial recém-criada
            try {
                await supabase.auth.signInWithPassword({
                    email: formData.email.trim().toLowerCase(),
                    password: password.trim()
                });
            } catch (autoLoginErr) {
                console.warn('Auto-login após cadastro:', autoLoginErr);
            }

            setSubmitSuccess(true);
        } catch (err: any) {
            console.error('Erro ao cadastrar candidato no Supabase:', err);
            setSubmitError(err.message || 'Erro ao gravar cadastro no banco de dados. Por favor, verifique os dados ou fale com a administração pelo WhatsApp.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleWhatsAppConfirm = () => {
        const text = `*NOVO CADASTRO & ACEITE DE REGRAS - MORONAVILA*%0A%0A` +
            `*Nome:* ${formData.name}%0A` +
            `*E-mail:* ${formData.email}%0A` +
            `*WhatsApp:* ${formData.phone}%0A` +
            `*CPF:* ${formData.cpf}%0A` +
            `*RG:* ${formData.rg}%0A` +
            `*Data de Nascimento:* ${formData.birth_date}%0A` +
            `*Acomodação Desejada:* ${formData.desired_room_type}%0A` +
            `*Data Prevista Entrada:* ${formData.entry_date}%0A` +
            `*Profissão / Empresa:* ${formData.occupation} / ${formData.company}%0A` +
            `*Instagram:* ${formData.instagram}%0A` +
            `*Facebook:* ${formData.facebook}%0A` +
            `*Origem:* ${formData.origin_address}%0A` +
            `*Família:* ${formData.family_address}%0A` +
            `*Contato de Emergência:* ${formData.emergency_contact_name} (${formData.emergency_contact_phone})%0A` +
            `*Documentos Anexados:* ${docFrontFile ? 'Frente enviada' : 'Sim'} e ${docBackFile ? 'Verso enviado' : 'Sim'}%0A%0A` +
            `_Declaro que li, compreendi e dei aceite integral em todas as 12 Regras de Conduta do Residencial Moronavila e que assumo a responsabilidade pelos meus atos e das pessoas que forem autorizadas por mim a visitar a propriedade, e que responderei financeiramente danos a propriedade ou moveis, eletrodomesticos, equipamentos e utensillhos que estou recebendo na minha unidade e nas partes compatilhadas._`;
        window.open(`https://wa.me/5521983245000?text=${text}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-rose-500 selection:text-white">
            {/* Top Bar Fixa / Sticky */}
            <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
                    <button
                        onClick={onBack}
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors py-2 px-3 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 cursor-pointer"
                    >
                        <ArrowLeft size={16} />
                        <span>{rvt.backToHome}</span>
                    </button>

                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-rose-600 text-white shadow-lg shadow-rose-900/40">
                            <Home size={18} />
                        </div>
                        <span className="text-base font-black text-white tracking-tighter uppercase italic">
                            MORONA<span className="text-rose-600">VILA</span>
                        </span>
                        <span className="text-slate-600 hidden sm:inline">•</span>
                        <span className="text-xs text-slate-400 hidden sm:inline font-semibold">{rvt.rulesAndRegTitle}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <LanguageSelector currentLang={currentLang} onLanguageChange={handleLanguageChange} />

                        <button
                            onClick={() => {
                                setVisitorSuccess(false);
                                setIsVisitorModalOpen(true);
                            }}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-indigo-950/30 cursor-pointer"
                            title="Cadastrar visitante autorizado"
                        >
                            <UserPlus size={14} />
                            <span className="hidden sm:inline">{rvt.registerVisitBtn}</span>
                        </button>

                        <a
                            href={googleFormsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-black uppercase tracking-wider transition-all hover:scale-105"
                            title="Abrir formulário no Google Forms"
                        >
                            <ExternalLink size={14} />
                            <span className="hidden md:inline">{rvt.googleFormsBtn}</span>
                        </a>

                        <button
                            onClick={() => window.print()}
                            className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold transition-all cursor-pointer"
                            title="Imprimir termo de regras"
                        >
                            <Printer size={14} />
                            <span className="hidden lg:inline">{rvt.printBtn}</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12">
                {/* HERO TITLE */}
                <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-black uppercase tracking-widest">
                        <ShieldCheck size={14} /> {rvt.heroBadge}
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white italic">
                        {rvt.heroTitlePrefix}<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-400">{rvt.heroTitleHighlight}</span>
                    </h1>
                    <p className="text-lg sm:text-xl font-bold text-amber-400/90 tracking-tight">
                        {rvt.heroSubtitle}
                    </p>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        {rvt.heroDesc}
                    </p>
                </div>

                {/* BANNER PROMOCIONAL E CONDIÇÕES FINANCEIRAS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Card 1: Valor do Aluguel */}
                    <div className="relative p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-4 shadow-xl">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{rvt.standardRatesTitle}</span>
                            <div className="p-2 rounded-xl bg-slate-800/80 text-rose-400">
                                <DollarSign size={18} />
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-white tracking-tight">
                                R$ 960<span className="text-sm font-semibold text-slate-400">{rvt.ratesPerMonth}</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                                {rvt.rentAndCleaningNote}
                            </p>
                        </div>
                        <div className="pt-3 border-t border-slate-800/60 text-xs text-slate-300 space-y-1">
                            <div className="flex items-center gap-2">
                                <Check size={14} className="text-emerald-400 shrink-0" />
                                <span>{rvt.monthPeriodRef}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check size={14} className="text-emerald-400 shrink-0" />
                                <span>{rvt.paidInAdvance}</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Promoção Especial até 10/11 */}
                    <div className="relative p-6 rounded-3xl bg-gradient-to-br from-rose-950/40 via-slate-900/80 to-amber-950/30 border border-rose-500/40 backdrop-blur-sm space-y-4 shadow-2xl shadow-rose-950/30">
                        <div className="inline-block px-3 py-1 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest animate-pulse">
                            {rvt.exclusivePromoBadge}
                        </div>
                        <div>
                            <div className="text-3xl font-black text-rose-400 tracking-tight flex items-baseline gap-2">
                                R$ 860<span className="text-sm font-semibold text-slate-400">{rvt.ratesPerMonth}</span>
                                <span className="text-xs line-through text-slate-500">R$ 960</span>
                            </div>
                            <p className="text-xs font-bold text-amber-300 mt-1">
                                {rvt.promoDiscountNote}
                            </p>
                        </div>
                        <div className="pt-3 border-t border-rose-500/20 text-xs text-slate-300">
                            <p className="leading-relaxed">
                                {rvt.promoDetailsText}
                            </p>
                        </div>
                    </div>

                    {/* Card 3: Condições de Entrada & Caução */}
                    <div className="relative p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-4 shadow-xl">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{rvt.entryConditionsTitle}</span>
                            <div className="p-2 rounded-xl bg-slate-800/80 text-amber-400">
                                <Calendar size={18} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm font-black text-white uppercase tracking-wider">
                                {rvt.depositPlusMonth}
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                {rvt.entryConditionsDesc}
                            </p>
                        </div>
                        <div className="pt-3 border-t border-slate-800/60 text-xs text-emerald-400 font-medium">
                            {rvt.depositCoversLastMonth}
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
                                {rvt.pixDetailsTitle}
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                                {rvt.pixBeneficiaryLabel} <strong className="text-slate-200">{pixBeneficiary}</strong>
                            </p>
                            <p className="text-xs text-slate-400">
                                {rvt.pixKeyLabel} <span className="font-mono text-emerald-400 font-bold text-sm">{pixKey}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            onClick={handleCopyPix}
                            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-950/40 cursor-pointer"
                        >
                            {copiedPix ? <Check size={16} /> : <Copy size={16} />}
                            <span>{copiedPix ? rvt.copiedPixBtn : rvt.copyPixBtn}</span>
                        </button>
                    </div>
                </div>

                {/* AS 12 REGRAS DE CONDUTA RESIDENCIAL */}
                <div id="secao-regras" className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-rose-500">
                                {rvt.mandatoryRuleAcceptanceTag}
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight mt-1">
                                {rvt.the12RulesTitle}
                            </h2>
                            <p className="text-xs text-slate-400 mt-1">
                                {rvt.the12RulesSubtitle}
                            </p>
                        </div>
                        <div className="flex flex-col sm:items-end gap-1.5 self-start sm:self-auto">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black uppercase text-slate-300">{rvt.rulesAcceptedLabel}</span>
                                <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${allRulesAccepted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                                    {acceptedCount} de {RULES_DATA.length} {allRulesAccepted ? rvt.allRulesAcceptedBadge : rvt.rulesAcceptedSuffix}
                                </span>
                            </div>
                            <div className="w-full sm:w-48 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                                <div
                                    className={`h-full transition-all duration-300 ${allRulesAccepted ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-rose-500'}`}
                                    style={{ width: `${(acceptedCount / RULES_DATA.length) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {RULES_DATA.map((rule, idx) => {
                            const isAccepted = !!acceptedRules[rule.id];
                            const ruleTitle = RULE_TITLES[currentLang]?.[idx] || rule.title;
                            const ruleDesc = currentLang === 'pt' ? rule.description : (t.rulesSection.rulesList[idx] || rule.description);

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
                                                        {ruleTitle}
                                                    </h3>
                                                    {rule.fine && (
                                                        <span className="inline-block mt-0.5 text-[11px] font-black text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-800/60">
                                                            {rule.fine}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div
                                                className={`w-7 h-7 rounded-xl border flex items-center justify-center transition-colors shrink-0 ${isAccepted
                                                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-950/40'
                                                    : 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                                                    }`}
                                            >
                                                <Check size={14} className="stroke-[3]" />
                                            </div>
                                        </div>

                                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                            {ruleDesc}
                                        </p>

                                        {/* LINK VISÍVEL E PROEMINENTE NA REGRA 1 PARA CADASTRO DE VISITAS */}
                                        {rule.id === 1 && (
                                            <div className="pt-2" onClick={e => e.stopPropagation()}>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setVisitorSuccess(false);
                                                        setIsVisitorModalOpen(true);
                                                    }}
                                                    className="w-full inline-flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-indigo-950/50 hover:scale-[1.02] active:scale-[0.98] border border-indigo-400/30 cursor-pointer"
                                                >
                                                    <UserPlus size={16} />
                                                    <span>Cadastrar Visita Autorizada</span>
                                                    <ArrowRight size={14} />
                                                </button>

                                                {authorizedVisitors.length > 0 && (
                                                    <div className="mt-2 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsVisitorModalOpen(true)}
                                                            className="text-[11px] text-indigo-300 hover:text-indigo-200 underline font-semibold transition-colors cursor-pointer"
                                                        >
                                                            Ver {authorizedVisitors.length} visita(s) cadastrada(s)
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-4 mt-4 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex flex-wrap gap-1.5 items-center">
                                            {rule.tags.map(tag => (
                                                <span
                                                    key={tag}
                                                    className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-400 border border-slate-700/50"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggleRule(rule.id);
                                            }}
                                            className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer ${isAccepted
                                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                                                : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:border-rose-500'
                                                }`}
                                        >
                                            <Check size={14} className={isAccepted ? 'text-emerald-400 stroke-[3]' : 'text-rose-400'} />
                                            <span>{isAccepted ? 'Regra Aceita ✓' : 'Aceitar Regra *'}</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* POLÍTICA DE MULTAS E SEGURANÇA */}
                <div className="p-8 rounded-[2.5rem] bg-gradient-to-r from-rose-950/40 via-slate-900 to-amber-950/30 border border-rose-500/30 shadow-2xl space-y-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-rose-600 text-white shadow-lg shadow-rose-900/50">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-black uppercase text-white tracking-tight">
                                {rvt.finesTableTitle}
                            </h3>
                            <p className="text-xs text-rose-300 font-semibold">
                                {rvt.finesTableSubtitle}
                            </p>
                        </div>
                    </div>

                    <p className="text-sm text-slate-200 leading-relaxed font-medium">
                        {rvt.finesPolicyText}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                        {rvt.fineCards.map((card, idx) => (
                            <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                                    {card.title}
                                </span>
                                <span className={`text-xl font-black ${card.color}`}>{card.value}</span>
                                <span className="text-[11px] text-slate-400 block">{card.note}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* LINK DE DESTAQUE PARA O GOOGLE FORMS */}
                <div className="p-8 rounded-[2.5rem] bg-slate-900 border border-amber-500/40 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-2 text-center md:text-left">
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">
                                {rvt.googleFormsCardTag}
                            </span>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                                {rvt.googleFormsCardTitle}
                            </h3>
                            <p className="text-xs text-slate-300 max-w-xl">
                                {rvt.googleFormsCardDesc}
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
                                <span>{rvt.googleFormsOpenBtn}</span>
                            </a>

                            <button
                                onClick={handleCopyFormUrl}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all border border-slate-700 cursor-pointer"
                                title="Copiar link do formulário"
                            >
                                {copiedFormUrl ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                                <span>{copiedFormUrl ? rvt.googleFormsCopiedBtn : rvt.googleFormsCopyBtn}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* FORMULÁRIO COMPLETO DE CADASTRO E ACEITE NO SITE */}
                <div className="p-8 sm:p-10 rounded-[2.5rem] bg-slate-900/60 border border-slate-800 space-y-8 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-6">
                        <div>
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-rose-500">
                                {rvt.formTag}
                            </span>
                            <h2 className="text-2xl font-black uppercase text-white tracking-tight mt-1">
                                {rvt.formTitle}
                            </h2>
                            <p className="text-xs text-slate-400 mt-1">
                                {rvt.formSubtitle}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowDetailedForm(!showDetailedForm)}
                            className="p-3 rounded-2xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
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
                                    {rvt.successTitle}
                                </h3>
                                <p className="text-sm text-slate-300 max-w-lg mx-auto">
                                    {rvt.successDesc}
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 max-w-md mx-auto text-left space-y-2">
                                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                                    <Lock size={15} /> {rvt.dashboardCreatedTitle}
                                </div>
                                <div className="text-xs text-slate-200">
                                    <span className="text-slate-400">E-mail:</span> <strong>{formData.email.trim().toLowerCase()}</strong>
                                </div>
                                <div className="text-xs text-slate-400 leading-relaxed">
                                    {rvt.dashboardCreatedDesc}
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 max-w-md mx-auto text-left text-xs text-slate-300 space-y-2">
                                <div className="font-bold text-amber-400 uppercase tracking-wider">{rvt.nextStepsTitle}</div>
                                <div>{rvt.nextStep1}</div>
                                <div>{rvt.nextStep2}</div>
                                <div>{rvt.nextStep3}</div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                                <button
                                    onClick={() => {
                                        window.location.hash = '';
                                        window.location.search = '?view=app';
                                        onBack();
                                    }}
                                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-rose-950/50 flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <span>{rvt.enterDashboardNowBtn}</span>
                                    <ArrowRight size={16} />
                                </button>
                                <button
                                    onClick={handleWhatsAppConfirm}
                                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-950/40 cursor-pointer"
                                >
                                    {rvt.confirmWhatsAppBtn}
                                </button>
                                <a
                                    href={googleFormsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider border border-slate-700 transition-all"
                                >
                                    Google Forms
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
                                            {rvt.labelFullName}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            placeholder={rvt.placeholderFullName}
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>

                                    {/* E-mail */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            {rvt.labelEmail}
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            placeholder={rvt.placeholderEmail}
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>

                                    {/* WhatsApp */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            {rvt.labelPhone}
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder={rvt.placeholderPhone}
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>

                                    {/* CPF */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            {rvt.labelCpf}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.cpf}
                                            onChange={e => setFormData({ ...formData, cpf: e.target.value })}
                                            placeholder={rvt.placeholderCpf}
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>

                                    {/* RG */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            {rvt.labelRg}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.rg}
                                            onChange={e => setFormData({ ...formData, rg: e.target.value })}
                                            placeholder={rvt.placeholderRg}
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>

                                    {/* Data de Nascimento */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            {rvt.labelBirthDate}
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.birth_date}
                                            onChange={e => setFormData({ ...formData, birth_date: e.target.value })}
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white"
                                        />
                                    </div>

                                    {/* Endereço de Origem */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            {rvt.labelOriginAddress}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.origin_address}
                                            onChange={e => setFormData({ ...formData, origin_address: e.target.value })}
                                            placeholder={rvt.placeholderOriginAddress}
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>

                                    {/* Endereço da Família */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            {rvt.labelFamilyAddress}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.family_address}
                                            onChange={e => setFormData({ ...formData, family_address: e.target.value })}
                                            placeholder={rvt.placeholderFamilyAddress}
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>

                                    {/* Tipo de Acomodação Pretendida */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            {rvt.labelDesiredRoom}
                                        </label>
                                        <select
                                            required
                                            value={formData.desired_room_type}
                                            onChange={e => setFormData({ ...formData, desired_room_type: e.target.value })}
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white cursor-pointer"
                                        >
                                            <option value="Quarto Individual">{rvt.roomOptions.single}</option>
                                            <option value="Suíte Independente">{rvt.roomOptions.suite}</option>
                                            <option value="Studio MoronaVila">{rvt.roomOptions.studio}</option>
                                            <option value="Apartamento MoronaVila">{rvt.roomOptions.apartment}</option>
                                        </select>
                                    </div>

                                    {/* Data Prevista de Entrada */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            {rvt.labelEntryDate}
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.entry_date}
                                            onChange={e => setFormData({ ...formData, entry_date: e.target.value })}
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white"
                                        />
                                    </div>

                                    {/* Profissão / Ocupação */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            {rvt.labelOccupation}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.occupation}
                                            onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                                            placeholder={rvt.placeholderOccupation}
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>

                                    {/* Empresa / Local de Trabalho */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            {rvt.labelCompany}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.company}
                                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                                            placeholder={rvt.placeholderCompany}
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>

                                    {/* Faculdade / Universidade */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            {rvt.labelUniversity}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.university}
                                            onChange={e => setFormData({ ...formData, university: e.target.value })}
                                            placeholder={rvt.placeholderUniversity}
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>

                                    {/* Curso / Formação */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            {rvt.labelCourse}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.course}
                                            onChange={e => setFormData({ ...formData, course: e.target.value })}
                                            placeholder={rvt.placeholderCourse}
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>

                                    {/* Contato de Emergência */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            {rvt.labelEmergencyName}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.emergency_contact_name}
                                            onChange={e => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                                            placeholder={rvt.placeholderEmergencyName}
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>

                                    {/* Telefone de Emergência */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            {rvt.labelEmergencyPhone}
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.emergency_contact_phone}
                                            onChange={e => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
                                            placeholder={rvt.placeholderEmergencyPhone}
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>

                                    {/* Instagram */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                            <Instagram size={14} className="text-rose-400" />
                                            <span>{rvt.labelInstagram}</span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">@</span>
                                            <input
                                                type="text"
                                                required
                                                value={formData.instagram}
                                                onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                                                placeholder={rvt.placeholderInstagram}
                                                className="w-full pl-9 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                            />
                                        </div>
                                    </div>

                                    {/* Facebook */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                            <Facebook size={14} className="text-blue-400" />
                                            <span>{rvt.labelFacebook}</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.facebook}
                                            onChange={e => setFormData({ ...formData, facebook: e.target.value })}
                                            placeholder={rvt.placeholderFacebook}
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>

                                    {/* Imagens dos Documentos de Identidade */}
                                    <div className="sm:col-span-2 lg:col-span-3 space-y-3 pt-3">
                                        <div className="border-t border-slate-800 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <div>
                                                <h4 className="text-xs font-black text-rose-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                                    <ImageIcon size={16} />
                                                    <span>{rvt.docsSectionTitle}</span>
                                                </h4>
                                                <p className="text-[11px] text-slate-400 mt-0.5">
                                                    {rvt.docsSectionDesc}
                                                </p>
                                            </div>
                                            <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-lg self-start sm:self-auto">
                                                {rvt.docsSectionBadge}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                            {/* Documento Frente */}
                                            <div className={`p-4 rounded-2xl bg-slate-950 border space-y-3 ${!docFrontFile && !docFrontPreview ? 'border-rose-500/30' : 'border-emerald-500/40'}`}>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                                        <span className="text-rose-400">*</span>
                                                        <span>{rvt.docFrontLabel}</span>
                                                        <span className="text-[10px] text-slate-500 font-normal">{rvt.docFrontHint}</span>
                                                    </span>
                                                    {docFrontPreview && (
                                                        <button
                                                            type="button"
                                                            onClick={handleRemoveDocFront}
                                                            className="text-slate-400 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                                                            title="Remover imagem"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>

                                                {docFrontPreview ? (
                                                    <div className="relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
                                                        <img
                                                            src={docFrontPreview}
                                                            alt="Frente do documento"
                                                            className="w-full h-36 object-cover object-center"
                                                        />
                                                        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                            <label className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer transition-colors">
                                                                {rvt.docChangeImage}
                                                                <input
                                                                    type="file"
                                                                    accept="image/*,.pdf"
                                                                    onChange={handleDocFrontSelect}
                                                                    className="hidden"
                                                                />
                                                            </label>
                                                        </div>
                                                        <div className="p-2 bg-slate-900/90 text-[10px] text-emerald-400 font-bold flex items-center gap-1.5">
                                                            <Check size={12} />
                                                            <span>{rvt.docFrontUploaded} ({docFrontFile?.name})</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-800 hover:border-rose-500/50 rounded-2xl cursor-pointer bg-slate-900/30 hover:bg-slate-900/50 transition-all text-center group">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-800 group-hover:bg-rose-500/10 text-slate-400 group-hover:text-rose-400 flex items-center justify-center transition-colors mb-2">
                                                            <Upload size={18} />
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
                                                            {rvt.docFrontClick}
                                                        </span>
                                                        <span className="text-[10px] text-slate-500 mt-1">
                                                            {rvt.docFrontTypeHint}
                                                        </span>
                                                        <input
                                                            type="file"
                                                            accept="image/*,.pdf"
                                                            onChange={handleDocFrontSelect}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                )}
                                            </div>

                                            {/* Documento Verso */}
                                            <div className={`p-4 rounded-2xl bg-slate-950 border space-y-3 ${!docBackFile && !docBackPreview ? 'border-rose-500/30' : 'border-emerald-500/40'}`}>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                                        <span className="text-rose-400">*</span>
                                                        <span>{rvt.docBackLabel}</span>
                                                        <span className="text-[10px] text-slate-500 font-normal">{rvt.docBackHint}</span>
                                                    </span>
                                                    {docBackPreview && (
                                                        <button
                                                            type="button"
                                                            onClick={handleRemoveDocBack}
                                                            className="text-slate-400 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                                                            title="Remover imagem"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>

                                                {docBackPreview ? (
                                                    <div className="relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
                                                        <img
                                                            src={docBackPreview}
                                                            alt="Verso do documento"
                                                            className="w-full h-36 object-cover object-center"
                                                        />
                                                        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                            <label className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer transition-colors">
                                                                {rvt.docChangeImage}
                                                                <input
                                                                    type="file"
                                                                    accept="image/*,.pdf"
                                                                    onChange={handleDocBackSelect}
                                                                    className="hidden"
                                                                />
                                                            </label>
                                                        </div>
                                                        <div className="p-2 bg-slate-900/90 text-[10px] text-emerald-400 font-bold flex items-center gap-1.5">
                                                            <Check size={12} />
                                                            <span>{rvt.docBackUploaded} ({docBackFile?.name})</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-800 hover:border-rose-500/50 rounded-2xl cursor-pointer bg-slate-900/30 hover:bg-slate-900/50 transition-all text-center group">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-800 group-hover:bg-rose-500/10 text-slate-400 group-hover:text-rose-400 flex items-center justify-center transition-colors mb-2">
                                                            <Upload size={18} />
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
                                                            {rvt.docBackClick}
                                                        </span>
                                                        <span className="text-[10px] text-slate-500 mt-1">
                                                            {rvt.docBackTypeHint}
                                                        </span>
                                                        <input
                                                            type="file"
                                                            accept="image/*,.pdf"
                                                            onChange={handleDocBackSelect}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Senha de Acesso ao Dashboard do Morador */}
                                    <div className="sm:col-span-2 lg:col-span-3 space-y-3 pt-3">
                                        <div className="border-t border-slate-800 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <div>
                                                <h4 className="text-xs font-black text-amber-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                                    <Lock size={16} />
                                                    <span>{rvt.passwordSectionTitle}</span>
                                                </h4>
                                                <p className="text-[11px] text-slate-400 mt-0.5">
                                                    {rvt.passwordSectionDesc}
                                                </p>
                                            </div>
                                            <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg self-start sm:self-auto">
                                                {rvt.passwordSectionBadge}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                            {/* Senha */}
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                                                    <span>{rvt.passwordCreateLabel}</span>
                                                    <span className="text-[10px] text-slate-500 font-normal">{rvt.passwordMinDigits}</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        required
                                                        minLength={6}
                                                        value={password}
                                                        onChange={e => setPassword(e.target.value)}
                                                        placeholder={rvt.passwordPlaceholder}
                                                        className="w-full px-4 py-3 pr-12 rounded-2xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
                                                        title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                                                    >
                                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Confirmar Senha */}
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                                                    <span>{rvt.passwordConfirmLabel}</span>
                                                    {password && confirmPassword && (
                                                        <span className={`text-[10px] font-bold ${password === confirmPassword ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                            {password === confirmPassword ? rvt.passwordMatch : rvt.passwordMismatch}
                                                        </span>
                                                    )}
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        required
                                                        minLength={6}
                                                        value={confirmPassword}
                                                        onChange={e => setConfirmPassword(e.target.value)}
                                                        placeholder={rvt.passwordConfirmPlaceholder}
                                                        className={`w-full px-4 py-3 rounded-2xl bg-slate-950 border focus:outline-none text-sm text-white placeholder-slate-600 ${confirmPassword && password !== confirmPassword ? 'border-rose-500' : 'border-slate-800 focus:border-amber-500'}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ACEITE DECLARATÓRIO DAS REGRAS */}
                                <div className={`p-6 rounded-3xl border transition-all duration-300 space-y-4 ${allRulesAccepted ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-950/60 border-amber-500/30'}`}>
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            id="checkAcceptAll"
                                            checked={acceptedAll}
                                            onChange={handleToggleAcceptAll}
                                            className="w-5 h-5 rounded mt-0.5 accent-rose-600 cursor-pointer"
                                        />
                                        <label htmlFor="checkAcceptAll" className="text-xs sm:text-sm text-slate-200 leading-relaxed cursor-pointer font-medium">
                                            <strong className="text-white block mb-1">
                                                {DECLARATION_TEXT[currentLang].title}
                                            </strong>
                                            {DECLARATION_TEXT[currentLang].body}
                                        </label>
                                    </div>

                                    {!allRulesAccepted && (
                                        <div className="text-[11px] text-amber-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pl-8 pt-1">
                                            <div className="flex items-center gap-1.5">
                                                <AlertCircle size={14} className="shrink-0" />
                                                <span>{rvt.warningPendingRulesPrefix}{acceptedCount} / {RULES_DATA.length} {rvt.warningPendingRulesSuffix}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const rulesElem = document.getElementById('secao-regras');
                                                    if (rulesElem) rulesElem.scrollIntoView({ behavior: 'smooth' });
                                                }}
                                                className="text-amber-300 underline font-bold cursor-pointer hover:text-amber-200 text-left"
                                            >
                                                {rvt.viewPendingRulesBtn}
                                            </button>
                                        </div>
                                    )}

                                    {allRulesAccepted && !acceptedAll && (
                                        <div className="text-[11px] text-rose-400 flex items-center gap-1.5 pl-8">
                                            <AlertCircle size={14} className="shrink-0" />
                                            <span>{rvt.declarationReminder}</span>
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
                                        <ExternalLink size={14} /> {rvt.preferGoogleFormsLink}
                                    </a>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !allRulesAccepted || !acceptedAll}
                                        className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 ${allRulesAccepted && acceptedAll && !isSubmitting
                                            ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/50 hover:scale-105 active:scale-95 cursor-pointer'
                                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                                            }`}
                                    >
                                        {isSubmitting ? (
                                            <span>{rvt.submitProcessing}</span>
                                        ) : (
                                            <>
                                                <span>{rvt.submitConfirm}</span>
                                                <Send size={16} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )
                    )}
                </div>

                {/* MODAL: CADASTRO DE VISITAS AUTORIZADAS */}
                {isVisitorModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
                        <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] space-y-6">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                                        <UserPlus size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-white uppercase tracking-tight">
                                            {rvt.visitorModalTitle}
                                        </h3>
                                        <p className="text-xs text-slate-400">
                                            {rvt.visitorModalSubtitle}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsVisitorModalOpen(false)}
                                    className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {visitorSuccess ? (
                                <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-200">
                                    <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                                        <BadgeCheck size={36} />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                                            Protocolo Gerado com Sucesso
                                        </span>
                                        <h4 className="text-2xl font-black text-white uppercase tracking-tight">
                                            {visitorProtocol}
                                        </h4>
                                        <p className="text-xs text-slate-300 max-w-md mx-auto">
                                            A visita <strong className="text-white">{visitorForm.visitorName}</strong> foi cadastrada como autorizada para o residente <strong className="text-white">{visitorForm.residentName || 'Morador'}</strong>.
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs text-slate-300 max-w-md mx-auto space-y-1.5">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Documento:</span>
                                            <span className="font-mono text-white">{visitorForm.visitorDoc}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Telefone:</span>
                                            <span className="font-mono text-white">{visitorForm.visitorPhone}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Relação:</span>
                                            <span className="text-white">{visitorForm.relationship}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Pernoite:</span>
                                            <span className="text-white">{visitorForm.overnight ? 'Sim (até 2 noites/sem)' : 'Não'}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={handleSendVisitorWhatsApp}
                                            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-950/40 cursor-pointer"
                                        >
                                            Enviar Comprovante no WhatsApp
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setVisitorSuccess(false);
                                                setVisitorForm({
                                                    residentName: currentUser?.name || '',
                                                    residentUnit: '',
                                                    visitorName: '',
                                                    visitorDoc: '',
                                                    visitorPhone: '',
                                                    relationship: 'Familiar',
                                                    daysPerWeek: '2 dias por semana',
                                                    overnight: false,
                                                    notes: '',
                                                    termsAccepted: false
                                                });
                                            }}
                                            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                                        >
                                            Cadastrar Outra Visita
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleVisitorSubmit} className="space-y-4">
                                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2.5">
                                        <Info size={16} className="shrink-0 mt-0.5" />
                                        <span>
                                            <strong>Lembrete de Segurança:</strong> {rvt.visitorSafetyNotice}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Morador Responsável */}
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                                                {rvt.visitorResidentNameLabel}
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={visitorForm.residentName}
                                                onChange={e => setVisitorForm({ ...visitorForm, residentName: e.target.value })}
                                                placeholder="Seu nome"
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                                            />
                                        </div>

                                        {/* Unidade / Quarto */}
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                                                {rvt.visitorResidentUnitLabel}
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={visitorForm.residentUnit}
                                                onChange={e => setVisitorForm({ ...visitorForm, residentUnit: e.target.value })}
                                                placeholder="Ex: Quarto 3, Suíte B"
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                                            />
                                        </div>

                                        {/* Nome do Visitante */}
                                        <div className="space-y-1.5 sm:col-span-2">
                                            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                                                {rvt.visitorNameLabel}
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={visitorForm.visitorName}
                                                onChange={e => setVisitorForm({ ...visitorForm, visitorName: e.target.value })}
                                                placeholder={rvt.visitorNamePlaceholder}
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                                            />
                                        </div>

                                        {/* Documento do Visitante */}
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                                                {rvt.visitorDocLabel}
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={visitorForm.visitorDoc}
                                                onChange={e => setVisitorForm({ ...visitorForm, visitorDoc: e.target.value })}
                                                placeholder={rvt.visitorDocPlaceholder}
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                                            />
                                        </div>

                                        {/* Telefone do Visitante */}
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                                                {rvt.visitorPhoneLabel}
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={visitorForm.visitorPhone}
                                                onChange={e => setVisitorForm({ ...visitorForm, visitorPhone: e.target.value })}
                                                placeholder={rvt.visitorPhonePlaceholder}
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                                            />
                                        </div>

                                        {/* Grau de Parentesco / Relação */}
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                                                {rvt.visitorRelationshipLabel}
                                            </label>
                                            <select
                                                value={visitorForm.relationship}
                                                onChange={e => setVisitorForm({ ...visitorForm, relationship: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                                            >
                                                <option value="Familiar">Familiar (Pais/Filhos/Irmãos/Parentes)</option>
                                                <option value="Cônjuge/Namorado(a)">Cônjuge / Namorado(a)</option>
                                                <option value="Amigo(a) Cadastrado">Amigo(a) Pré-Cadastrado</option>
                                                <option value="Colega de Trabalho/Estudo">Colega de Trabalho/Estudo</option>
                                            </select>
                                        </div>

                                        {/* Frequência */}
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                                                {rvt.visitorFrequencyLabel}
                                            </label>
                                            <select
                                                value={visitorForm.daysPerWeek}
                                                onChange={e => setVisitorForm({ ...visitorForm, daysPerWeek: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                                            >
                                                <option value="1 dia por semana">1 dia por semana</option>
                                                <option value="2 dias por semana">2 dias por semana (limite da casa)</option>
                                                <option value="Visita Pontual / Esporádica">Visita Pontual / Esporádica</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Pernoite Switch */}
                                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                                        <div>
                                            <span className="text-xs font-bold text-white block">
                                                {rvt.visitorOvernightLabel}
                                            </span>
                                            <span className="text-[11px] text-slate-400">
                                                {rvt.visitorOvernightSub}
                                            </span>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={visitorForm.overnight}
                                                onChange={e => setVisitorForm({ ...visitorForm, overnight: e.target.checked })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                        </label>
                                    </div>

                                    {/* Termo de Responsabilidade */}
                                    <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
                                        <input
                                            type="checkbox"
                                            id="checkVisitorTerms"
                                            required
                                            checked={visitorForm.termsAccepted}
                                            onChange={e => setVisitorForm({ ...visitorForm, termsAccepted: e.target.checked })}
                                            className="w-4 h-4 rounded mt-0.5 accent-indigo-600 cursor-pointer"
                                        />
                                        <label htmlFor="checkVisitorTerms" className="text-[11px] text-slate-300 leading-relaxed cursor-pointer">
                                            {rvt.visitorTermsDeclaration}
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                                        <button
                                            type="button"
                                            onClick={() => setIsVisitorModalOpen(false)}
                                            className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
                                        >
                                            {rvt.visitorCancelBtn}
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-indigo-950/40 cursor-pointer"
                                        >
                                            {rvt.visitorSubmitBtn}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Lista de Visitas Já Cadastradas */}
                            {authorizedVisitors.length > 0 && !visitorSuccess && (
                                <div className="pt-4 border-t border-slate-800 space-y-3">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        Visitas Atualmente Cadastradas ({authorizedVisitors.length})
                                    </span>
                                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                        {authorizedVisitors.map(v => (
                                            <div key={v.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                                                <div>
                                                    <div className="font-bold text-white flex items-center gap-1.5">
                                                        <span>{v.visitorName}</span>
                                                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40 font-normal">
                                                            {v.relationship}
                                                        </span>
                                                    </div>
                                                    <div className="text-[11px] text-slate-500">
                                                        Doc: {v.visitorDoc} • {v.daysPerWeek} {v.overnight ? '• Com pernoite' : ''}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                                                        {v.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* FOOTER INFORMATIVO */}
                <div className="pt-8 border-t border-slate-800/80 text-center space-y-3 pb-12 text-xs text-slate-500">
                    <p className="font-bold text-slate-400">
                        MoronaVila • Residência & Coliving Profissional
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
