import React, { useState, useEffect } from 'react';
import {
    ShieldCheck, ArrowLeft, ExternalLink, Copy, Check, AlertTriangle,
    Users, Ban, Shirt, DollarSign, Calendar, Clock, Volume2, Package,
    Coffee, Camera, Lock, FileText, Send, Sparkles, CheckCircle2,
    Home, Phone, Mail, User, Info, AlertCircle, HeartHandshake,
    Printer, ChevronDown, ChevronUp, UserPlus, X, ArrowRight,
    UserCheck, BadgeCheck, Instagram, Facebook, Upload, Trash2,
    Image as ImageIcon, Plug, Flame
} from 'lucide-react';
import { Resident, UserRole } from '../types';
import { createResident, uploadResidentDocument } from '../lib/database';

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

        const protocol = `VPR-VIS-${Math.floor(1000 + Math.random() * 9000)}`;
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
        const text = `*CADASTRO DE VISITA AUTORIZADA - VOUPRURIO*%0A` +
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

        if (!acceptedAll) {
            setSubmitError('É obrigatório declarar ciência e aceitar todas as 12 Regras de Conduta Residencial para concluir seu cadastro.');
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
                internet_active: false,
                rent_value: 900,
                cleaning_fee: 60
            });

            setSubmitSuccess(true);
        } catch (err: any) {
            console.error('Erro ao cadastrar candidato no Supabase:', err);
            setSubmitError(err.message || 'Erro ao gravar cadastro no banco de dados. Por favor, verifique os dados ou fale com a administração pelo WhatsApp.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleWhatsAppConfirm = () => {
        const text = `*NOVO CADASTRO & ACEITE DE REGRAS - VOUPRURIO*%0A%0A` +
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
            `_Declaro que li e aceito integralmente todas as 12 Regras de Conduta Residencial VouPruRio e as condições financeiras (Depósito Caução + Mês Corrente)._`;
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
                        <button
                            onClick={() => {
                                setVisitorSuccess(false);
                                setIsVisitorModalOpen(true);
                            }}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-indigo-950/30 cursor-pointer"
                            title="Cadastrar visitante autorizado"
                        >
                            <UserPlus size={14} />
                            <span className="hidden sm:inline">Cadastrar Visita</span>
                        </button>

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
                            className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold transition-all cursor-pointer"
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
                                Depósito + Mês Corrente
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Para entrada na casa é necessário 1 mês de aluguel como depósito + mês corrente à entrada.
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
                            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-950/40 cursor-pointer"
                        >
                            {copiedPix ? <Check size={16} /> : <Copy size={16} />}
                            <span>{copiedPix ? 'Chave Copiada!' : 'Copiar Chave PIX'}</span>
                        </button>
                    </div>
                </div>

                {/* AS 12 REGRAS DE CONDUTA RESIDENCIAL */}
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-rose-500">
                                Termos Obrigatórios
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight mt-1">
                                As 12 Regras de Conduta Residencial
                            </h2>
                        </div>
                        <div className="flex items-center gap-3 self-start sm:self-auto">
                            <button
                                onClick={handleToggleAll}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 transition-all cursor-pointer"
                            >
                                <CheckCircle2 size={16} className={acceptedAll ? 'text-emerald-400' : 'text-slate-500'} />
                                <span>{acceptedAll ? 'Desmarcar Todas' : 'Marcar Todas como Lidas'}</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {RULES_DATA.map((rule) => {
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
                                                        <span className="inline-block mt-0.5 text-[11px] font-black text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-800/60">
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
                <div className="p-8 rounded-[2.5rem] bg-gradient-to-r from-rose-950/40 via-slate-900 to-amber-950/30 border border-rose-500/30 shadow-2xl space-y-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-rose-600 text-white shadow-lg shadow-rose-900/50">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-black uppercase text-white tracking-tight">
                                Tabela e Aplicação de Multas por Infração
                            </h3>
                            <p className="text-xs text-rose-300 font-semibold">
                                Segurança e monitoramento eletrônico 24 horas por dia em todas as áreas comuns
                            </p>
                        </div>
                    </div>

                    <p className="text-sm text-slate-200 leading-relaxed font-medium">
                        "Os valores de multas aplicadas por infrações ao regulamento da casa serão anexados à fatura do mês subsequente e pagos diretamente via internet."
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                        {/* Multa Fumo e Álcool */}
                        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                                Fumo & Bebidas Alcoólicas
                            </span>
                            <span className="text-xl font-black text-rose-400">R$ 20,00</span>
                            <span className="text-[11px] text-slate-400 block">por infração registrada</span>
                        </div>

                        {/* Multa Silêncio & TV/Som */}
                        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                                Silêncio / Som ou TV Alto
                            </span>
                            <span className="text-xl font-black text-purple-400">R$ 20,00</span>
                            <span className="text-[11px] text-slate-400 block">por infração em qualquer horário</span>
                        </div>

                        {/* Multa Roupa no quarto / Lavanderia */}
                        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                                Roupa no quarto / Peso lavanderia
                            </span>
                            <span className="text-xl font-black text-amber-400">R$ 20,00</span>
                            <span className="text-[11px] text-slate-400 block">por infração registrada</span>
                        </div>

                        {/* Multa Cozinha Suja */}
                        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                                Deixar cozinha / louça suja
                            </span>
                            <span className="text-xl font-black text-rose-400">R$ 20,00</span>
                            <span className="text-[11px] text-slate-400 block">por infração sumária</span>
                        </div>

                        {/* Multa Armários Individuais */}
                        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                                Louça/Pertence fora do armário
                            </span>
                            <span className="text-xl font-black text-cyan-400">R$ 10,00</span>
                            <span className="text-[11px] text-slate-400 block">por infração (item recolhido)</span>
                        </div>

                        {/* Multa Quarto Alheio */}
                        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                                Entrada em quarto/banheiro alheio
                            </span>
                            <span className="text-xl font-black text-red-500">R$ 50,00</span>
                            <span className="text-[11px] text-slate-400 block">por infração registrada</span>
                        </div>

                        {/* Multa Lounge, Churrasqueira & Área Externa */}
                        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                                Lounge, Churrasqueira & Externa
                            </span>
                            <span className="text-xl font-black text-rose-400">R$ 20,00</span>
                            <span className="text-[11px] text-slate-400 block">por infração / danos / sujeira</span>
                        </div>

                        {/* Reposição / Mau Uso de Eletrodomésticos */}
                        <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block">
                                Eletrodomésticos Compartilhados
                            </span>
                            <span className="text-xl font-black text-amber-300">Cobrança Total</span>
                            <span className="text-[11px] text-slate-400 block">mau uso integral / rateio se técnico</span>
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
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all border border-slate-700 cursor-pointer"
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
                                    Aceite & Cadastro Registrados com Sucesso!
                                </h3>
                                <p className="text-sm text-slate-300 max-w-lg mx-auto">
                                    Seus dados foram recebidos e seu aceite às 12 Regras de Conduta Residencial VouPruRio foi confirmado.
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
                                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-950/40 cursor-pointer"
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
                                            CPF *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.cpf}
                                            onChange={e => setFormData({ ...formData, cpf: e.target.value })}
                                            placeholder="000.000.000-00"
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>

                                    {/* RG */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            RG / Órgão Emissor *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.rg}
                                            onChange={e => setFormData({ ...formData, rg: e.target.value })}
                                            placeholder="00.000.000-0 DETRAN"
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>

                                    {/* Data de Nascimento */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            Data de Nascimento *
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
                                            Endereço Anterior / Cidade de Origem *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.origin_address}
                                            onChange={e => setFormData({ ...formData, origin_address: e.target.value })}
                                            placeholder="Rua, Número, Bairro, Cidade - UF"
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>

                                    {/* Endereço da Família */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            Endereço da Família / Responsáveis *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.family_address}
                                            onChange={e => setFormData({ ...formData, family_address: e.target.value })}
                                            placeholder="Cidade e Bairro onde moram pais/familiares"
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>

                                    {/* Tipo de Acomodação Pretendida */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            Acomodação Pretendida *
                                        </label>
                                        <select
                                            required
                                            value={formData.desired_room_type}
                                            onChange={e => setFormData({ ...formData, desired_room_type: e.target.value })}
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white cursor-pointer"
                                        >
                                            <option value="Quarto Individual">Quarto Individual (R$ 960/mês)</option>
                                            <option value="Suíte Independente">Suíte Independente</option>
                                            <option value="Studio MoronaVila">Studio MoronaVila</option>
                                            <option value="Apartamento MoronaVila">Apartamento Completo MoronaVila</option>
                                        </select>
                                    </div>

                                    {/* Data Prevista de Entrada */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            Data Prevista de Entrada *
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
                                            Profissão / Ocupação Atual *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.occupation}
                                            onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                                            placeholder="Ex: Engenheiro, Médico, Advogado, Autônomo"
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>

                                    {/* Empresa / Local de Trabalho */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            Empresa / Empregador *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.company}
                                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                                            placeholder="Nome da empresa ou 'Autônomo' / 'Concursado'"
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>

                                    {/* Faculdade / Universidade */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            Faculdade / Universidade
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.university}
                                            onChange={e => setFormData({ ...formData, university: e.target.value })}
                                            placeholder="Ex: UERJ, UFRJ, Estácio (se aplicável)"
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>

                                    {/* Curso / Formação */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            Curso / Área de Formação
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.course}
                                            onChange={e => setFormData({ ...formData, course: e.target.value })}
                                            placeholder="Ex: Medicina, Direito, Computação"
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>

                                    {/* Contato de Emergência */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            Contato de Emergência (Nome) *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.emergency_contact_name}
                                            onChange={e => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                                            placeholder="Nome do familiar ou responsável"
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>

                                    {/* Telefone de Emergência */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                            Telefone de Emergência *
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.emergency_contact_phone}
                                            onChange={e => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
                                            placeholder="(21) 98888-8888"
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>

                                    {/* Instagram */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                            <Instagram size={14} className="text-rose-400" />
                                            <span>Instagram (URL ou @) *</span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">@</span>
                                            <input
                                                type="text"
                                                required
                                                value={formData.instagram}
                                                onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                                                placeholder="seuperfil ou link"
                                                className="w-full pl-9 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                            />
                                        </div>
                                    </div>

                                    {/* Facebook */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                            <Facebook size={14} className="text-blue-400" />
                                            <span>Facebook (URL ou Nome) *</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.facebook}
                                            onChange={e => setFormData({ ...formData, facebook: e.target.value })}
                                            placeholder="facebook.com/seuperfil ou nome"
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-rose-500 focus:outline-none text-sm text-white placeholder-slate-600"
                                        />
                                    </div>

                                    {/* Imagens dos Documentos de Identidade */}
                                    <div className="sm:col-span-2 lg:col-span-3 space-y-3 pt-3">
                                        <div className="border-t border-slate-800 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <div>
                                                <h4 className="text-xs font-black text-rose-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                                    <ImageIcon size={16} />
                                                    <span>Imagens do Documento de Identidade (RG ou CNH) * Obrigatório</span>
                                                </h4>
                                                <p className="text-[11px] text-slate-400 mt-0.5">
                                                    É obrigatório anexar fotos legíveis da frente (com foto) e do verso do seu documento de identificação
                                                </p>
                                            </div>
                                            <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-lg self-start sm:self-auto">
                                                Obrigatório anexar ambos os lados
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                            {/* Documento Frente */}
                                            <div className={`p-4 rounded-2xl bg-slate-950 border space-y-3 ${!docFrontFile && !docFrontPreview ? 'border-rose-500/30' : 'border-emerald-500/40'}`}>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                                        <span className="text-rose-400">*</span>
                                                        <span>Frente do Documento</span>
                                                        <span className="text-[10px] text-slate-500 font-normal">(com foto)</span>
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
                                                                Trocar Imagem
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
                                                            <span>Frente carregada ({docFrontFile?.name})</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-800 hover:border-rose-500/50 rounded-2xl cursor-pointer bg-slate-900/30 hover:bg-slate-900/50 transition-all text-center group">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-800 group-hover:bg-rose-500/10 text-slate-400 group-hover:text-rose-400 flex items-center justify-center transition-colors mb-2">
                                                            <Upload size={18} />
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
                                                            Clique para enviar a Frente
                                                        </span>
                                                        <span className="text-[10px] text-slate-500 mt-1">
                                                            RG com foto ou CNH
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
                                                        <span>Verso do Documento</span>
                                                        <span className="text-[10px] text-slate-500 font-normal">(ou CNH completa)</span>
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
                                                                Trocar Imagem
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
                                                            <span>Verso carregado ({docBackFile?.name})</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-800 hover:border-rose-500/50 rounded-2xl cursor-pointer bg-slate-900/30 hover:bg-slate-900/50 transition-all text-center group">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-800 group-hover:bg-rose-500/10 text-slate-400 group-hover:text-rose-400 flex items-center justify-center transition-colors mb-2">
                                                            <Upload size={18} />
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
                                                            Clique para enviar o Verso
                                                        </span>
                                                        <span className="text-[10px] text-slate-500 mt-1">
                                                            Verso do RG ou comprovante
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
                                            Declaro que li, compreendi e aceito integralmente todas as <strong className="text-amber-400">12 Regras de Conduta Residencial VouPruRio</strong>, incluindo as multas aplicáveis por infração (fumo/álcool: R$ 20,00; silêncio/TV alta: R$ 20,00; lavar/passar roupa fora do padrão: R$ 20,00; cozinha suja: R$ 20,00; louça fora do armário: R$ 10,00; quartos alheios: R$ 50,00; lounge/churrasqueira/área externa: R$ 20,00; e cobrança total por mau uso de eletrodomésticos compartilhados), as condições de pagamento do aluguel (R$ 960,00 ou R$ 860,00 promocional até 10/11), pagamento antecipado até o 5º dia útil via PIX para Sergio Oswaldo de Castro, cobrança de multas no mês subsequente, necessidade de aviso prévio de 30 dias para saída e quitação do último mês através do depósito caução.
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
                                            ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/50 hover:scale-105 active:scale-95 cursor-pointer'
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
                                            Cadastro de Visita Autorizada
                                        </h3>
                                        <p className="text-xs text-slate-400">
                                            Regra 1: Familiares ou convidados cadastrados (máx. 2 dias/semana)
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
                                            <strong>Lembrete de Segurança:</strong> Não é permitido receber crianças ou animais de estimação. O visitante entra obrigatoriamente pelo interfone recebido pelo morador e não fica na casa sem ele.
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Morador Responsável */}
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                                                Nome do Morador *
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
                                                Unidade / Quarto *
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
                                                Nome Completo do Visitante *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={visitorForm.visitorName}
                                                onChange={e => setVisitorForm({ ...visitorForm, visitorName: e.target.value })}
                                                placeholder="Nome completo de quem vai visitar"
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                                            />
                                        </div>

                                        {/* Documento do Visitante */}
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                                                CPF ou RG do Visitante *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={visitorForm.visitorDoc}
                                                onChange={e => setVisitorForm({ ...visitorForm, visitorDoc: e.target.value })}
                                                placeholder="000.000.000-00"
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                                            />
                                        </div>

                                        {/* Telefone do Visitante */}
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                                                WhatsApp do Visitante *
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={visitorForm.visitorPhone}
                                                onChange={e => setVisitorForm({ ...visitorForm, visitorPhone: e.target.value })}
                                                placeholder="(21) 99999-9999"
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                                            />
                                        </div>

                                        {/* Grau de Parentesco / Relação */}
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                                                Parentesco ou Relação
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
                                                Frequência (Máx. 2 dias/sem)
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
                                                Haverá pernoite na visita?
                                            </span>
                                            <span className="text-[11px] text-slate-400">
                                                Permitido no máximo até 2 noites por semana
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
                                            Declaro que o visitante está ciente e cumprirá todas as regras da propriedade (silêncio, proibição de álcool e fumo, sem pets e sem crianças), que será recebido por mim via interfone e que não permanecerá no imóvel sem minha presença.
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                                        <button
                                            type="button"
                                            onClick={() => setIsVisitorModalOpen(false)}
                                            className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-indigo-950/40 cursor-pointer"
                                        >
                                            Salvar & Autorizar Visita
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
