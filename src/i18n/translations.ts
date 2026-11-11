import { Language, TranslationData } from './types';

export const TRANSLATIONS: Record<Language, TranslationData> = {
    pt: {
        langLabel: 'Português',
        flag: '🇧🇷',
        nav: {
            units: 'Unidades',
            amenities: 'Comodidades',
            location: 'Localização',
            vacancies: 'Disponíveis',
            comparison: 'Custo-Benefício',
            rules: 'Regras',
            scheduleVisit: 'Agendar Visita',
            residentAccess: 'Residentes',
            accessPrefix: 'Acesso de',
            whatsapp: 'WhatsApp'
        },
        hero: {
            addressBadge: 'Rua Torres Homem, 886 • Vila Isabel',
            silenceBadge: 'Silêncio Garantido',
            organizedBadge: 'Casa Organizada',
            noGuarantorBadge: 'Sem Fiador',
            title: 'Seu quarto independente, sem as dores de um apartamento',
            subtitle: 'Entrada própria, mobiliado e sem fiador na Rua Torres Homem, Vila Isabel. Para quem trabalha e quer voltar para casa e descansar.',
            viewUnitsCta: 'Ver Unidades a partir de',
            mapCta: 'Mapa da Região',
            stats: {
                downtownTime: '20 min',
                downtownLabel: 'Até o Centro',
                uerjTime: '11 min',
                uerjLabel: 'A pé do HUPE / UERJ',
                metroTime: '16 min',
                metroLabel: 'A pé do Metrô Maracanã',
                zeroBureaucracy: 'Zero',
                zeroBureaucracyLabel: 'Fiador ou Burocracia'
            }
        },
        unitsSection: {
            tag: 'Nossas Unidades',
            titlePrefix: 'Moradia independente a partir de',
            subtitle: 'Uma residência para profissionais: quem trabalha fora e quer voltar para uma casa tranquila. Todas as unidades são mobiliadas, sem fiador e com contrato pensado para quem quer ficar.',
            promoBadge: 'Promoção de lançamento',
            promoText: 'Feche até 10/11 e pague R$ 100 a menos por mês durante 6 meses, em qualquer unidade.',
            perMonth: '/mês',
            coupleText: 'Casal',
            forPromoMonths: 'Por 6 meses • contratos até 10/11',
            viewAvailableCta: 'Ver Unidades Disponíveis',
            reserveRenovatedCta: 'Reservar Unidade em Renovação',
            upToTwoPeople: 'até 2 pessoas'
        },
        products: [
            {
                id: 'quarto-individual',
                name: 'Quarto Individual',
                audience: 'Para 1 pessoa ou casal',
                promise: 'Seu quarto e seu banheiro, só seus, numa casa silenciosa.',
                features: ['Banheiro privativo (fora do quarto)', 'Mobiliado', 'Cozinha compartilhada com armário individual']
            },
            {
                id: 'suite-independente',
                name: 'Suíte Independente',
                audience: 'Para 1 pessoa ou casal',
                promise: 'Sua porta, sua rotina. Ninguém passa pelo seu quarto.',
                features: ['Entrada independente', 'Banheiro na suíte', 'Mobiliada', 'Cozinha compartilhada com armário individual']
            },
            {
                id: 'studio',
                name: 'Studio',
                audience: 'Para profissionais ou casais sem filhos',
                promise: 'Seu primeiro lar a dois: mobiliado e sem fiador.',
                features: ['Cozinha e banheiro próprios', 'Mobiliado', 'Até 2 pessoas']
            },
            {
                id: 'apartamento',
                name: 'Apartamento MoronaVila',
                audience: 'Para casais ou quem trabalha de casa',
                promise: 'Um apartamento completo sem condomínio, IPTU ou fiador.',
                features: ['Quarto e sala', 'Cozinha e banheiro próprios', 'Mobiliado', 'Até 2 pessoas']
            }
        ],
        amenitiesSection: {
            tag: 'Estrutura Completa',
            title: 'Tudo pronto para você viver com conforto',
            subtitle: 'Conheça nossos espaços compartilhados, planejados para produtividade e descanso.'
        },
        locationSection: {
            tag: 'Localização Privilegiada',
            title: 'No coração de Vila Isabel, perto de tudo',
            subtitle: 'Fácil acesso a universidades, hospitais, metrô e principais vias do Rio de Janeiro.'
        },
        vacanciesSection: {
            tag: 'Disponíveis Agora',
            titlePrefix: 'Escolha sua',
            titleHighlight: 'Unidade',
            subtitle: 'Unidades mobiliadas, silenciosas e prontas para morar, com Wi-Fi, IPTU e limpeza das áreas comuns inclusos e acesso livre às áreas comuns. Mude-se rápido: sem fiador, com caução simples.',
            noVacanciesTitle: 'Consulte Próximas Vagas',
            noVacanciesText: 'Estamos com alta procura para o período. Fale conosco no WhatsApp para entrar na lista de espera prioritária.',
            waitingListCta: 'Entrar na Lista de Espera',
            viewDetailsCta: 'Ver Detalhes & Fotos',
            perMonth: '/mês',
            individual: 'Individual',
            shared: 'Compartilhado',
            suiteBadge: 'Suíte',
            forecastTitle: 'Previsão de Disponibilidade',
            forecastSubtitle: 'Unidades em fase final de reparos ou em desocupação programada — reserve antecipadamente para a data de liberação.',
            forecastEmptyText: 'No momento não há unidades em finalização de reparos ou desocupação programada.',
            finishingRepairsLabel: 'Finalizando reparos',
            vacatingUntilLabel: 'Em desocupação até',
            releaseDateLabel: 'Liberação prevista:',
            availableOnSiteLabel: 'Disponível no site em:'
        },
        comparisonSection: {
            tag: 'Transparência Financeira',
            title: 'Morar Sozinho vs. Viver na Moronavila',
            subtitle: 'Veja como a MoronaVila elimina custos ocultos, burocracias e o estresse de montar uma casa do zero.',
            traditional: {
                title: 'Aluguel Tradicional',
                type: 'Apê / Kitnet Convencional',
                rentIptu: 'Aluguel + IPTU',
                condo: 'Condomínio',
                electricity: 'Energia Elétrica',
                waterGas: 'Água e Gás',
                internet: 'Internet Fibra',
                furniture: 'Compra de Móveis & Eletros',
                guarantor: 'Exigência de Fiador',
                note: '*Contratos longos de 30 meses, multas rescisórias pesadas e despesas variáveis imprevisíveis.'
            },
            moronavila: {
                title: 'Na MoronaVila',
                subtitle: 'Aluguel fixo, sem surpresas',
                furnishedUnit: 'Unidade Mobiliada',
                noCondoIptu: 'Condomínio & IPTU',
                electricityWater: 'Luz & Água',
                wifi: 'Wi-Fi Alta Velocidade',
                kitchen: 'Cozinha Compartilhada Equipada & Gás',
                cleaning: 'Limpeza de Áreas Comuns',
                intercom: 'Interfone Individual na Unidade',
                guarantor: 'Sem Fiador / Caução Simples',
                chooseRoomCta: 'Escolher Minha Vaga',
                meterNote: '*A partir de janeiro de 2027, luz e água por medidor individual, sem rateio. Nos studios e no apartamento, que têm cozinha própria, o gás é do residente.',
                included: 'Incluso',
                noFee: 'Não tem',
                flexible: '100% Flexível'
            }
        },
        rulesSection: {
            tag: 'Convivência & Harmonia',
            title: 'Silêncio garantido. Casa organizada.',
            subtitle: 'Aqui a convivência é feita de confiança, consideração e respeito. Você recebe quem ama, e sabe que seu vizinho também só recebe gente conhecida.',
            rulesList: [
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
            ],
            cctvNote: 'Casa monitorada por câmeras 24h. Regras claras, iguais para todos: infrações comprovadas geram multa automática no próximo vencimento.',
            rulesAndRegisterCta: 'Regras e Cadastro de Residentes',
            googleFormsCta: 'Formulário Google Forms'
        },
        faqSection: {
            tag: 'Dúvidas Frequentes',
            title: 'Perguntas & Respostas',
            items: [
                {
                    q: 'Preciso de fiador ou comprovação de renda complexa?',
                    a: 'Não. Aqui na MoronaVila não exigimos fiador nem seguro-fiança. Trabalhamos com depósito caução simples de 1 mês e análise cadastral direta, rápida e desburocratizada.'
                },
                {
                    q: 'O que está incluso no valor do aluguel?',
                    a: 'O valor anunciado inclui a unidade 100% mobiliada, Wi-Fi de fibra de alta velocidade, IPTU, uso das áreas comuns (cozinha equipada, lavanderia, sala de estudos e lounge externo) e limpeza semanal das partes compartilhadas.'
                },
                {
                    q: 'Posso receber visitas no meu quarto?',
                    a: 'Visitas são restritas a familiares ou pessoas cadastradas previamente na administração, no limite de até 2 dias por semana, preservando o descanso e a tranquilidade de todos os residentes.'
                },
                {
                    q: 'Qual o tempo mínimo de contrato?',
                    a: 'Oferecemos contratos flexíveis a partir de 3 ou 6 meses, com renovação automática e aviso prévio simples de 30 dias para saída, sem as multas abusivas do mercado tradicional.'
                }
            ]
        },
        contactSection: {
            title: 'Pronto para Conhecer?',
            subtitle: 'Tire suas dúvidas imediatamente com nosso Agente Virtual ou fale com nosso atendimento no WhatsApp para agendar uma visita.',
            formNameLabel: 'Como prefere ser chamado?',
            formNamePlaceholder: 'Seu nome completo',
            formPhoneLabel: 'Telefone (WhatsApp)',
            formPhonePlaceholder: '(21) 99999-9999',
            formEmailLabel: 'Seu melhor E-mail',
            formEmailPlaceholder: 'seu@email.com',
            startChatCta: 'Iniciar Atendimento',
            whatsappConsultantCta: 'Falar com Consultor no WhatsApp',
            chatPlaceholder: 'Digite sua dúvida aqui...'
        },
        roomModal: {
            availability: 'Disponibilidade',
            capacityLabel: 'Capacidade',
            individual: '1 Pessoa (Individual)',
            shared: 'Vagas (Compartilhado)',
            bathroomLabel: 'Banheiro',
            privateSuite: 'Privativo (Suíte)',
            sharedBathroom: 'Compartilhado',
            entryLabel: 'Entrada',
            entryDetails: 'Sem fiador • caução de 1 mês',
            includedLabel: 'Inclusos',
            includedDetails: 'Wi-Fi, IPTU e limpeza das áreas comuns',
            descTitle: 'Descrição da Acomodação',
            defaultDesc: 'Quarto confortável, ventilado e silencioso, ideal para quem busca praticidade no dia a dia da Vila Isabel.',
            furnitureTitle: 'Mobiliário',
            furnitureDefault: 'Acomodação mobiliada com cama, armário e escrivaninha.',
            whatsappCta: 'Agendar Visita no WhatsApp',
            simulateCta: 'Simular Entrada & Reserva',
            newBadge: 'Novo',
            goodBadge: 'Bom',
            fairBadge: 'Regular'
        },
        simulatorModal: {
            title: 'Simulador de Entrada & Reserva',
            step1Title: '1. Data Prevista de Entrada',
            entryDateLabel: 'Quando você pretende se mudar?',
            step2Title: '2. Resumo de Valores Transparentes',
            monthlyRent: 'Aluguel do Mês',
            securityDeposit: 'Depósito Caução (Quita o último mês)',
            depositTransparencyText: 'O caução quita o último mês de permanencia do residente. Sem necessidade de fiador.',
            proRataRuleNote: 'Entrada até o dia 15: aluguel proporcional aos dias restantes do mês corrente. Após o dia 15: equivalente a 15 dias (50%).',
            halfMonthBadge: 'Equivalente a 15 dias (entrada após dia 15)',
            proRataDaysSuffix: 'dias proporcionais no mês',
            unitCleaningFee: 'Taxa de Limpeza da Unidade',
            unitCleaningFeeNote: 'Valor variável conforme a unidade selecionada',
            cleaningFee: 'Depósito Chaves e Danos',
            keysDamageNote: 'Só será devolvido se as chaves e o imóvel forem entregues em perfeitas condições.',
            totalToMoveIn: 'Total para Entrada',
            agreeCta: 'Estou de Acordo com as Condições',
            preRegisterTitle: 'Pré-Cadastro de Residente',
            preRegisterSubtitle: 'Preencha seus dados para solicitar reserva na acomodação selecionada.',
            successTitle: 'Reserva Solicitada com Sucesso!',
            successText: 'Seu pré-cadastro foi recebido. Nossa equipe entrará em contato via WhatsApp para confirmar os detalhes!',
            backToHome: 'Voltar ao Início'
        },
        footer: {
            desc: 'Residência para profissionais em Vila Isabel, Rio de Janeiro. Unidades independentes, mobiliadas e sem fiador.',
            addressTitle: 'Endereço',
            addressLine1: 'Rua Torres Homem, 886 - Vila Isabel',
            addressLine2: 'Rio de Janeiro - RJ • CEP 20551-075',
            rulesLink: 'Regras e cadastro de residentes',
            formsLink: 'Link Google Forms',
            loginBtn: 'Login de Residentes',
            dashboardBtn: 'Acessar Meu Dashboard',
            rights: 'MoronaVila. Todos os direitos reservados.'
        }
    },
    en: {
        langLabel: 'English',
        flag: '🇺🇸',
        nav: {
            units: 'Units',
            amenities: 'Amenities',
            location: 'Location',
            vacancies: 'Available',
            comparison: 'Value & Costs',
            rules: 'House Rules',
            scheduleVisit: 'Schedule Visit',
            residentAccess: 'Residents',
            accessPrefix: 'Access for',
            whatsapp: 'WhatsApp'
        },
        hero: {
            addressBadge: '886 Torres Homem St • Vila Isabel',
            silenceBadge: 'Guaranteed Quietness',
            organizedBadge: 'Organized Living',
            noGuarantorBadge: 'No Guarantor Needed',
            title: 'Your independent private room, without the headache of an apartment',
            subtitle: 'Private entrance, fully furnished, no Brazilian guarantor needed in Vila Isabel, Rio de Janeiro. For professionals who want to come home and truly rest.',
            viewUnitsCta: 'Explore Units starting at',
            mapCta: 'Neighborhood Map',
            stats: {
                downtownTime: '20 min',
                downtownLabel: 'To Downtown Rio',
                uerjTime: '11 min',
                uerjLabel: 'Walking to UERJ / Hospital',
                metroTime: '16 min',
                metroLabel: 'Walking to Maracanã Subway',
                zeroBureaucracy: 'Zero',
                zeroBureaucracyLabel: 'Bureaucracy or Red Tape'
            }
        },
        unitsSection: {
            tag: 'Our Accommodations',
            titlePrefix: 'Independent living starting from',
            subtitle: 'A quiet residence tailored for working professionals and researchers. All units are furnished, require no guarantor, and offer straightforward, transparent agreements.',
            promoBadge: 'Launch Promotion',
            promoText: 'Sign up by Nov 10th and get R$ 100 off per month for 6 months on any room or apartment.',
            perMonth: '/mo',
            coupleText: 'Couples',
            forPromoMonths: 'For 6 months • contracts signed by Nov 10th',
            viewAvailableCta: 'Browse Available Units',
            reserveRenovatedCta: 'Pre-Book Renovated Room',
            upToTwoPeople: 'up to 2 people'
        },
        products: [
            {
                id: 'quarto-individual',
                name: 'Single Private Room',
                audience: 'For 1 person or couple',
                promise: 'Your own private room and bathroom in a peaceful house.',
                features: ['Private bathroom (outside bedroom)', 'Fully furnished', 'Shared kitchen with dedicated private pantry locker']
            },
            {
                id: 'suite-independente',
                name: 'Independent Suite',
                audience: 'For 1 person or couple',
                promise: 'Your own door, your own schedule. Total privacy.',
                features: ['Independent street/hall entrance', 'En-suite private bathroom', 'Fully furnished', 'Shared kitchen with dedicated locker']
            },
            {
                id: 'studio',
                name: 'Studio Apartment',
                audience: 'For professionals or couples without children',
                promise: 'Your complete starter home: furnished with no guarantor needed.',
                features: ['Private kitchen & private bathroom', 'Fully furnished', 'Capacity up to 2 people']
            },
            {
                id: 'apartamento',
                name: 'MoronaVila Full Flat',
                audience: 'For couples or remote workers',
                promise: 'A full apartment without building condo fees, municipal tax, or co-signers.',
                features: ['Bedroom & living room', 'Private kitchen and bathroom', 'Fully furnished', 'Capacity up to 2 people']
            }
        ],
        amenitiesSection: {
            tag: 'Full Infrastructure',
            title: 'Designed for comfort, study and real relaxation',
            subtitle: 'Explore our shared facilities built for productivity, cleanliness and high security.'
        },
        locationSection: {
            tag: 'Strategic Location',
            title: 'In the heart of Vila Isabel, close to everything',
            subtitle: 'Easy access to major universities (UERJ, UFRJ), hospitals, subway lines, Maracanã stadium and Rio downtown.'
        },
        vacanciesSection: {
            tag: 'Available Right Now',
            titlePrefix: 'Choose Your',
            titleHighlight: 'Room or Flat',
            subtitle: 'Furnished, quiet and move-in ready. Includes high-speed Wi-Fi, property tax and shared-area professional cleaning. Move in fast: no guarantor, simple security deposit.',
            noVacanciesTitle: 'Inquire for Upcoming Openings',
            noVacanciesText: 'We are currently experiencing high demand. Chat with our team on WhatsApp to join our priority waiting list.',
            waitingListCta: 'Join the Priority Waitlist',
            viewDetailsCta: 'View Photos & Details',
            perMonth: '/month',
            individual: 'Single',
            shared: 'Shared',
            suiteBadge: 'En-Suite',
            forecastTitle: 'Availability Forecast',
            forecastSubtitle: 'Units currently finishing repairs or scheduled for upcoming vacancy — reserve ahead for the release date.',
            forecastEmptyText: 'There are currently no units scheduled for repairs completion or upcoming vacancy.',
            finishingRepairsLabel: 'Finishing repairs',
            vacatingUntilLabel: 'Vacating until',
            releaseDateLabel: 'Expected release:',
            availableOnSiteLabel: 'Available on site:'
        },
        comparisonSection: {
            tag: 'Financial Transparency',
            title: 'Renting Alone vs. Living at MoronaVila',
            subtitle: 'See how MoronaVila eliminates hidden bills, endless bureaucracy and the stress of setting up a home from scratch.',
            traditional: {
                title: 'Traditional Apartment Rental',
                type: 'Conventional Flat / Studio in Rio',
                rentIptu: 'Rent + Property Tax (IPTU)',
                condo: 'Building Maintenance Fee (Condomínio)',
                electricity: 'Electricity Bill',
                waterGas: 'Water & Cooking Gas',
                internet: 'Fiber Internet Contract',
                furniture: 'Buying Furniture & Appliances',
                guarantor: 'Brazilian Co-Signer (Fiador)',
                note: '*30-month rigid contracts, steep termination penalties and unpredictable monthly utility hikes.'
            },
            moronavila: {
                title: 'At MoronaVila',
                subtitle: 'Fixed monthly fee, zero surprises',
                furnishedUnit: 'Move-in Ready Furnished Unit',
                noCondoIptu: 'Building Fee & Property Tax',
                electricityWater: 'Power & Water',
                wifi: 'High-Speed Fiber Wi-Fi',
                kitchen: 'Equipped Shared Kitchen & Gas',
                cleaning: 'Common Areas Professional Cleaning',
                intercom: 'Individual Softphone/Intercom in Unit',
                guarantor: 'No Brazilian Guarantor / 1-Month Deposit',
                chooseRoomCta: 'Choose My Room',
                meterNote: '*Starting Jan 2027, individual room electric meters with no shared bill splitting. Studios/flats with private kitchens manage their own cylinder gas.',
                included: 'Included',
                noFee: 'Zero / None',
                flexible: '100% Flexible'
            }
        },
        rulesSection: {
            tag: 'Community & Harmony',
            title: 'Guaranteed quietness. Organized home.',
            subtitle: 'Here coexistence is built on trust, consideration and mutual respect. You welcome family and friends with peace of mind knowing the house is safe and orderly.',
            rulesList: [
                '1. Visits are restricted to resident family members or pre-authorized registered visitors (max. 2 days/week). For safety reasons, no children or pets are allowed. All visitors must be registered beforehand.',
                '2. Smoking and drinking alcoholic beverages are strictly prohibited anywhere inside the property (R$ 20.00 fine per infraction).',
                '3. Ironing clothes inside bedrooms is not permitted (designated space in the study/living room), nor washing clothes in bedroom sinks/bathrooms. Laundry machine use is scheduled with administration, limited to once per week without exceeding capacity (R$ 20.00 fine).',
                '4. Rent covers from the 1st to the last day of each month, paid in advance by the 5th business day via PIX or bank transfer to Sergio Oswaldo de Castro.',
                '5. Vacating requires at least 30 days prior written notice via WhatsApp/Email. The security deposit settles the final month of stay.',
                '6. Loud TV or music is strictly forbidden at any hour of the day or night (R$ 20.00 fine per infraction).',
                '7. Deliveries must be received directly by residents at the entrance, with unit numbers included on shipping labels for intercom notification.',
                '8. Dishes, glasses, cutlery and groceries must be stored in designated individual kitchen lockers; left-out items are collected (R$ 10.00 fine).',
                '9. Shared kitchen must be cleaned immediately after use; security cameras will register unattended messes with a R$ 20.00 fine.',
                '10. Residents are strictly prohibited from entering other residents private bedrooms or bathrooms (R$ 50.00 fine).',
                '11. Shared electrical appliances and kitchen utensils must be used with care; repairs caused by technical wear are shared by all residents, while issues caused by misuse registered on security cameras are billed 100% to the responsible resident.',
                '12. Residents using the barbecue grill, lounge or outdoor garden area are responsible for full cleaning right after use and accountable for any damages (R$ 20.00 fine).'
            ],
            cctvNote: '24/7 security camera monitoring in all common areas. Clear, equal rules for all: proven infractions generate an automatic fine on the subsequent invoice.',
            rulesAndRegisterCta: 'House Rules & Resident Registration',
            googleFormsCta: 'Alternative Google Forms'
        },
        faqSection: {
            tag: 'Frequently Asked Questions',
            title: 'Questions & Answers',
            items: [
                {
                    q: 'Do I need a Brazilian co-signer (fiador) or complicated credit check?',
                    a: 'No! At MoronaVila we welcome foreign students, researchers and domestic professionals without requiring a local guarantor or expensive rental insurance. We only require a simple 1-month security deposit and straightforward identity verification.'
                },
                {
                    q: 'What is included in the monthly price?',
                    a: 'Your rate includes a fully furnished private room, high-speed fiber Wi-Fi, property taxes, use of all shared amenities (fully stocked kitchen, study lounge, laundry area, garden) and weekly professional cleaning of common areas.'
                },
                {
                    q: 'Can I bring overnight guests?',
                    a: 'Guests must be family members or pre-registered visitors via our resident portal, with a maximum limit of up to 2 nights per week, ensuring silence and tranquility for everyone living in the house.'
                },
                {
                    q: 'What is the minimum lease term?',
                    a: 'We offer flexible agreement lengths starting from 3 or 6 months with simple 30-day notice to vacate, completely avoiding the rigid 30-month contracts common across Rio de Janeiro.'
                }
            ]
        },
        contactSection: {
            title: 'Ready to Move In or Visit?',
            subtitle: 'Ask questions instantly with our AI Virtual Concierge or message our team directly on WhatsApp to schedule an in-person or video tour.',
            formNameLabel: 'What is your name?',
            formNamePlaceholder: 'Your full name',
            formPhoneLabel: 'Phone / WhatsApp',
            formPhonePlaceholder: '+1 (555) 000-0000 or phone',
            formEmailLabel: 'Your primary E-mail',
            formEmailPlaceholder: 'yourname@example.com',
            startChatCta: 'Start Instant Chat',
            whatsappConsultantCta: 'Chat with Us on WhatsApp',
            chatPlaceholder: 'Type your question here...'
        },
        roomModal: {
            availability: 'Availability',
            capacityLabel: 'Capacity',
            individual: '1 Person (Private Room)',
            shared: 'Slots (Shared Room)',
            bathroomLabel: 'Bathroom',
            privateSuite: 'En-Suite Private Bathroom',
            sharedBathroom: 'Shared Bathroom',
            entryLabel: 'Move-in Condition',
            entryDetails: 'No guarantor needed • 1-month deposit',
            includedLabel: 'Included',
            includedDetails: 'High-speed Wi-Fi, property tax and common area cleaning',
            descTitle: 'Room Description',
            defaultDesc: 'Comfortable, well-ventilated, quiet private accommodation, perfect for focus and rest in Rio de Janeiro.',
            furnitureTitle: 'Furnishings & Inventory',
            furnitureDefault: 'Furnished with bed, mattress, wardrobe locker and study desk.',
            whatsappCta: 'Book a Viewing on WhatsApp',
            simulateCta: 'Simulate Move-in & Reserve',
            newBadge: 'Brand New',
            goodBadge: 'Good Condition',
            fairBadge: 'Standard'
        },
        simulatorModal: {
            title: 'Move-in & Reservation Simulator',
            step1Title: '1. Anticipated Move-in Date',
            entryDateLabel: 'When do you plan to move in?',
            step2Title: '2. Transparent Fee Breakdown',
            monthlyRent: 'First Month Rent',
            securityDeposit: 'Security Deposit (Settles the final month)',
            depositTransparencyText: 'The security deposit settles the resident\'s final month of stay. No guarantor required.',
            proRataRuleNote: 'Move-in by the 15th: pro-rated for the remaining days of the current month. After the 15th: 15-day equivalent (50%).',
            halfMonthBadge: '15-day equivalent (move-in after the 15th)',
            proRataDaysSuffix: 'pro-rated days this month',
            unitCleaningFee: 'Unit Cleaning Fee',
            unitCleaningFeeNote: 'Variable fee depending on the selected unit',
            cleaningFee: 'Keys & Damage Deposit',
            keysDamageNote: 'Refundable only if the keys and the property are returned in perfect condition.',
            totalToMoveIn: 'Total to Move In',
            agreeCta: 'I Agree with these Terms',
            preRegisterTitle: 'Resident Application Form',
            preRegisterSubtitle: 'Complete your information to request a reservation in the selected accommodation.',
            successTitle: 'Reservation Request Submitted!',
            successText: 'Your application has been received. Our management team will reach out via WhatsApp/Email shortly!',
            backToHome: 'Return to Homepage'
        },
        footer: {
            desc: 'Professional residence and coliving in Vila Isabel, Rio de Janeiro. Fully furnished private units with zero bureaucracy.',
            addressTitle: 'Address',
            addressLine1: '886 Torres Homem Street - Vila Isabel',
            addressLine2: 'Rio de Janeiro - RJ, Brazil • Postal Code 20551-075',
            rulesLink: 'House rules & resident application',
            formsLink: 'Google Forms alternative link',
            loginBtn: 'Resident Portal Login',
            dashboardBtn: 'Go to Resident Dashboard',
            rights: 'MoronaVila. All rights reserved.'
        }
    },
    es: {
        langLabel: 'Español',
        flag: '🇪🇸',
        nav: {
            units: 'Unidades',
            amenities: 'Comodidades',
            location: 'Ubicación',
            vacancies: 'Disponibles',
            comparison: 'Coste-Beneficio',
            rules: 'Reglas de la Casa',
            scheduleVisit: 'Agendar Visita',
            residentAccess: 'Residentes',
            accessPrefix: 'Acceso de',
            whatsapp: 'WhatsApp'
        },
        hero: {
            addressBadge: 'Rua Torres Homem, 886 • Vila Isabel',
            silenceBadge: 'Silencio Garantizado',
            organizedBadge: 'Casa Organizada',
            noGuarantorBadge: 'Sin Avalista',
            title: 'Tu habitación independiente, sin los dolores de cabeza de un apartamento',
            subtitle: 'Entrada propia, amueblado y sin necesidad de avalista en Vila Isabel, Río de Janeiro. Para quienes trabajan y desean volver a casa a descansar con tranquilidad.',
            viewUnitsCta: 'Ver Unidades a partir de',
            mapCta: 'Mapa del Barrio',
            stats: {
                downtownTime: '20 min',
                downtownLabel: 'Al Centro de Río',
                uerjTime: '11 min',
                uerjLabel: 'A pie de la UERJ / Hospital',
                metroTime: '16 min',
                metroLabel: 'A pie del Metro Maracaná',
                zeroBureaucracy: 'Cero',
                zeroBureaucracyLabel: 'Aval o Burocracia'
            }
        },
        unitsSection: {
            tag: 'Nuestras Unidades',
            titlePrefix: 'Vivienda independiente a partir de',
            subtitle: 'Una residencia tranquila para profesionales, investigadores y estudiantes. Todas las unidades están amuebladas, no requieren avalista y cuentan con contratos directos y claros.',
            promoBadge: 'Promoción de lanzamiento',
            promoText: 'Firma hasta el 10/11 y paga R$ 100 menos al mes durante 6 meses en cualquier unidad.',
            perMonth: '/mes',
            coupleText: 'Pareja',
            forPromoMonths: 'Por 6 meses • contratos hasta el 10/11',
            viewAvailableCta: 'Ver Unidades Disponibles',
            reserveRenovatedCta: 'Reservar Unidad Renovada',
            upToTwoPeople: 'hasta 2 personas'
        },
        products: [
            {
                id: 'quarto-individual',
                name: 'Habitación Individual',
                audience: 'Para 1 persona o pareja',
                promise: 'Tu habitación y tu baño, solo tuyos, en una casa tranquila y silenciosa.',
                features: ['Baño privado (fuera del cuarto)', 'Totalmente amueblado', 'Cocina compartida con armario individual con llave']
            },
            {
                id: 'suite-independente',
                name: 'Suite Independiente',
                audience: 'Para 1 persona o pareja',
                promise: 'Tu puerta privada, tu rutina. Nadie pasa por tu habitación.',
                features: ['Entrada independiente', 'Baño dentro de la suite', 'Totalmente amueblada', 'Cocina compartida con armario individual con llave']
            },
            {
                id: 'studio',
                name: 'Estudio / Studio',
                audience: 'Para profesionales o parejas sin hijos',
                promise: 'Tu primer hogar independiente: amueblado y sin avalista.',
                features: ['Cocina y baño propios', 'Totalmente amueblado', 'Hasta 2 personas']
            },
            {
                id: 'apartamento',
                name: 'Apartamento MoronaVila',
                audience: 'Para parejas o teletrabajadores',
                promise: 'Un piso completo sin gastos de comunidad, IBI o avalista.',
                features: ['Dormitorio y salón', 'Cocina y baño propios', 'Totalmente amueblado', 'Hasta 2 personas']
            }
        ],
        amenitiesSection: {
            tag: 'Infraestructura Completa',
            title: 'Todo listo para vivir con máximo confort',
            subtitle: 'Descubre nuestras áreas compartidas diseñadas para el estudio, la tranquilidad y el descanso.'
        },
        locationSection: {
            tag: 'Ubicación Estratégica',
            title: 'En el corazón de Vila Isabel, cerca de todo',
            subtitle: 'Conexión rápida con universidades (UERJ, UFRJ), hospitales, metro Maracaná y el centro de Río de Janeiro.'
        },
        vacanciesSection: {
            tag: 'Disponibles Ahora',
            titlePrefix: 'Elige tu',
            titleHighlight: 'Alojamiento',
            subtitle: 'Habitaciones y estudios amueblados, silenciosos y listos para entrar a vivir. Incluye Wi-Fi de alta velocidad, impuestos y limpieza semanal de zonas comunes. Mudanza ágil: sin avalista, con fianza simple de 1 mes.',
            noVacanciesTitle: 'Consulta Próximas Vacantes',
            noVacanciesText: 'Tenemos alta demanda para este período. Escríbenos por WhatsApp para entrar en la lista de espera prioritaria.',
            waitingListCta: 'Entrar en Lista de Espera',
            viewDetailsCta: 'Ver Detalles y Fotos',
            perMonth: '/mes',
            individual: 'Individual',
            shared: 'Compartido',
            suiteBadge: 'Suite Privada',
            forecastTitle: 'Previsión de Disponibilidad',
            forecastSubtitle: 'Unidades en fase final de reparaciones o en desocupación programada — reserva con antelación para su fecha de liberación.',
            forecastEmptyText: 'En este momento no hay unidades en finalización de reparaciones ni en desocupación programada.',
            finishingRepairsLabel: 'Finalizando reparaciones',
            vacatingUntilLabel: 'En desocupación hasta',
            releaseDateLabel: 'Liberación prevista:',
            availableOnSiteLabel: 'Disponible en la web:'
        },
        comparisonSection: {
            tag: 'Transparencia Financiera',
            title: 'Alquilar Solo vs. Vivir en Moronavila',
            subtitle: 'Comprueba cómo MoronaVila elimina costes ocultos, fianzas bancarias excesivas y el estrés de montar un piso desde cero.',
            traditional: {
                title: 'Alquiler Tradicional',
                type: 'Piso / Estudio Convencional en Río',
                rentIptu: 'Alquiler + IBI (IPTU)',
                condo: 'Gastos de Comunidad (Condomínio)',
                electricity: 'Factura de Electricidad',
                waterGas: 'Agua y Gas',
                internet: 'Contrato de Fibra Óptica',
                furniture: 'Compra de Muebles y Electrodomésticos',
                guarantor: 'Exigencia de Avalista Brasileño',
                note: '*Contratos rígidos de 30 meses, penalizaciones costosas por cancelación y facturas imprevistas.'
            },
            moronavila: {
                title: 'En MoronaVila',
                subtitle: 'Cuota fija y clara, sin sorpresas',
                furnishedUnit: 'Unidad Totalmente Amueblada',
                noCondoIptu: 'Comunidad e Impuestos (IPTU)',
                electricityWater: 'Luz y Agua',
                wifi: 'Wi-Fi Fibra Alta Velocidad',
                kitchen: 'Cocina Compartida Equipada y Gas',
                cleaning: 'Limpieza de Áreas Comunes',
                intercom: 'Interfono Individual en la Unidad',
                guarantor: 'Sin Avalista / Fianza Simple de 1 Mes',
                chooseRoomCta: 'Elegir Mi Habitación',
                meterNote: '*A partir de enero de 2027, electricidad y agua por contador individualizado sin reparto. En los estudios y apartamento con cocina propia, el gas es a cargo del residente.',
                included: 'Incluido',
                noFee: 'Cero / Sin Gastos',
                flexible: '100% Flexible'
            }
        },
        rulesSection: {
            tag: 'Convivencia y Armonía',
            title: 'Silencio garantizado. Casa organizada.',
            subtitle: 'Aquí la convivencia se basa en la confianza, consideración y respeto mutuo. Puedes recibir a las personas que quieres con la seguridad de que tus vecinos también son profesionales responsables.',
            rulesList: [
                '1. Visitas restringidas a familiares del residente o personas previamente autorizadas (máx. 2 días/semana). Por motivos de seguridad no se admiten niños ni mascotas. Toda visita debe registrarse con antelación.',
                '2. Está terminantemente prohibido fumar o consumir bebidas alcohólicas en cualquier área de la propiedad (multa de R$ 20,00 por infracción).',
                '3. Prohibido planchar ropa en los dormitorios (espacio habilitado en la sala para ello) y lavar ropa en los lavabos del cuarto. El uso de la lavandería se agenda con la administración, con límite de 1 lavado semanal sin exceder el peso de la lavadora (multa de R$ 20,00).',
                '4. El alquiler corresponde del día 1 al último día de cada mes, abonado por anticipado hasta el 5º día hábil vía PIX o transferencia bancaria a Sergio Oswaldo de Castro.',
                '5. La desocupación del inmueble requiere preaviso por escrito vía WhatsApp/Email con al menos 30 días de anticipación. El depósito de fianza salda el último mes de estancia.',
                '6. Queda prohibido el uso de música o televisión a volumen alto a cualquier hora del día o de la noche (multa de R$ 20,00 por infracción).',
                '7. Los pedidos y paquetería deben ser recibidos directamente por los residentes en la entrada, indicando el número de habitación como complemento para aviso por interfono.',
                '8. Vajilla, vasos, cubiertos y alimentos personales deben guardarse en los armarios individuales con llave en la cocina; los utensilios fuera de lugar serán recogidos (multa de R$ 10,00).',
                '9. La cocina compartida debe dejarse completamente limpia tras su uso; las cámaras de seguridad registrarán el incumplimiento con multa de R$ 20,00.',
                '10. Queda terminantemente prohibido entrar u ocupar habitaciones o baños de otros residentes (multa de R$ 50,00).',
                '11. Los electrodomésticos y utensilios compartidos deben utilizarse con cuidado; averías por desgaste técnico se prorratean entre todos los residentes, mientras que daños por mal uso registrados en cámaras se cobran al 100% al residente responsable.',
                '12. Los residentes que utilicen el salón social, la barbacoa y la zona exterior ajardinada son responsables de la limpieza completa tras su uso y de cualquier daño ocasionado (multa de R$ 20,00).'
            ],
            cctvNote: 'Casa monitorizada por cámaras de seguridad 24 horas al día. Normas claras e iguales para todos: las infracciones comprobadas generan multa en el recibo siguiente.',
            rulesAndRegisterCta: 'Normas y Registro de Residentes',
            googleFormsCta: 'Formulario Google Forms Alternativo'
        },
        faqSection: {
            tag: 'Preguntas Frecuentes',
            title: 'Preguntas & Respuestas',
            items: [
                {
                    q: '¿Necesito un avalista brasileño (fiador) o historial bancario local?',
                    a: '¡No! En MoronaVila acogemos a profesionales, investigadores y nómadas digitales de todo el mundo sin exigir fiador ni costosos seguros de alquiler. Solo requerimos una fianza simple de 1 mes y comprobación básica de identidad.'
                },
                {
                    q: '¿Qué incluye el precio mensual?',
                    a: 'El valor mensual incluye la habitación 100% amueblada, Wi-Fi fibra de alta velocidad, impuestos municipales, uso libre de zonas comunes (cocina completa, sala de estudio, lavandería y jardín con barbacoa) y limpieza semanal de partes compartidas.'
                },
                {
                    q: '¿Puedo recibir visitas en mi habitación?',
                    a: 'Las visitas se limitan a familiares o visitas previamente registradas en la administración, con un máximo de 2 noches por semana, preservando la tranquilidad y descanso de todos los residentes de la casa.'
                },
                {
                    q: '¿Cuál es el tiempo mínimo de estancia?',
                    a: 'Ofrecemos contratos flexibles a partir de 3 o 6 meses con preaviso sencillo de 30 días para marcharte, evitando los contratos rígidos de 30 meses habituales en Río de Janeiro.'
                }
            ]
        },
        contactSection: {
            title: '¿Listo para Conocer tu Próxima Habitación?',
            subtitle: 'Resuelve tus dudas al instante con nuestro Asistente Virtual o escríbenos por WhatsApp para coordinar una visita presencial o videollamada.',
            formNameLabel: '¿Cómo prefieres que te llamemos?',
            formNamePlaceholder: 'Tu nombre completo',
            formPhoneLabel: 'Teléfono / WhatsApp',
            formPhonePlaceholder: '+34 o tu prefijo y número',
            formEmailLabel: 'Tu correo electrónico principal',
            formEmailPlaceholder: 'tucorreo@ejemplo.com',
            startChatCta: 'Iniciar Consulta Online',
            whatsappConsultantCta: 'Hablar con Asesor en WhatsApp',
            chatPlaceholder: 'Escribe tu consulta aquí...'
        },
        roomModal: {
            availability: 'Disponibilidad',
            capacityLabel: 'Capacidad',
            individual: '1 Persona (Habitación Individual)',
            shared: 'Plazas (Habitación Compartida)',
            bathroomLabel: 'Baño',
            privateSuite: 'Baño Privado en Suite',
            sharedBathroom: 'Baño Compartido',
            entryLabel: 'Condiciones de Entrada',
            entryDetails: 'Sin avalista • fianza simple de 1 mes',
            includedLabel: 'Servicios Incluidos',
            includedDetails: 'Wi-Fi fibra, impuestos y limpieza de zonas comunes',
            descTitle: 'Descripción del Alojamiento',
            defaultDesc: 'Habitación luminosa, ventilada y silenciosa, ideal para descansar y concentrarse en el día a día de Río de Janeiro.',
            furnitureTitle: 'Mobiliario Incluido',
            furnitureDefault: 'Alojamiento amueblado con cama, colchón, armario con llave y escritorio de trabajo.',
            whatsappCta: 'Agendar Visita por WhatsApp',
            simulateCta: 'Simular Entrada y Reservar',
            newBadge: 'Nuevo',
            goodBadge: 'Muy Bueno',
            fairBadge: 'Estándar'
        },
        simulatorModal: {
            title: 'Simulador de Entrada y Reserva',
            step1Title: '1. Fecha Prevista de Llegada',
            entryDateLabel: '¿Cuándo tienes previsto mudarte?',
            step2Title: '2. Desglose Transparente de Costes',
            monthlyRent: 'Alquiler del Primer Mes',
            securityDeposit: 'Depósito de Fianza (Salda el último mes)',
            depositTransparencyText: 'La fianza salda el último mes de permanencia del residente. Sin necesidad de avalista.',
            proRataRuleNote: 'Entrada hasta el día 15: proporcional a los días restantes del mes en curso. Después del día 15: equivalente a 15 días (50%).',
            halfMonthBadge: 'Equivalente a 15 días (entrada tras el día 15)',
            proRataDaysSuffix: 'días proporcionales este mes',
            unitCleaningFee: 'Tasa de Limpieza de la Unidad',
            unitCleaningFeeNote: 'Importe variable según la unidad seleccionada',
            cleaningFee: 'Depósito de Llaves y Daños',
            keysDamageNote: 'Solo se devolverá si las llaves y el inmueble se entregan en perfectas condiciones.',
            totalToMoveIn: 'Total para Entrar a Vivir',
            agreeCta: 'Estoy de Acuerdo con las Condiciones',
            preRegisterTitle: 'Pre-Registro de Residente',
            preRegisterSubtitle: 'Completa tus datos para solicitar la reserva en la habitación seleccionada.',
            successTitle: '¡Solicitud de Reserva Enviada!',
            successText: 'Tu pre-registro ha sido recibido correctamente. Nuestro equipo se pondrá en contacto contigo por WhatsApp para formalizar la reserva.',
            backToHome: 'Volver a la Página Principal'
        },
        footer: {
            desc: 'Residencia para profesionales en Vila Isabel, Río de Janeiro. Habitaciones y estudios independientes, amueblados y sin avalista.',
            addressTitle: 'Dirección',
            addressLine1: 'Rua Torres Homem, 886 - Vila Isabel',
            addressLine2: 'Río de Janeiro - RJ, Brasil • CP 20551-075',
            rulesLink: 'Reglas de la casa y registro de residentes',
            formsLink: 'Enlace alternativo Google Forms',
            loginBtn: 'Acceso para Residentes',
            dashboardBtn: 'Ir a Mi Panel de Residente',
            rights: 'MoronaVila. Todos los derechos reservados.'
        }
    }
};

