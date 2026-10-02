-- =====================================================================================
-- MIGRAÇÃO COMPLETA: MoronaVila -> Novo Banco de Dados (Schema custom_moronavila)
-- Project ID: 0fcc4832-7f91-432b-b3d7-65e84082c590
-- Slug: moronavila
-- Template: custom_base (v1.0.0)
-- Target: vps1 / Easypanel
-- =====================================================================================

-- 1. EXTENSÕES BÁSICAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CRIAÇÃO DO SCHEMA EXCLUSIVO
CREATE SCHEMA IF NOT EXISTS custom_moronavila;

-- Configura search_path para a sessão atual
SET search_path TO custom_moronavila, public;

-- =====================================================================================
-- 3. TABELAS DE GOVERNANÇA / BASE DO TEMPLATE (custom_moronavila)
-- =====================================================================================

CREATE TABLE IF NOT EXISTS custom_moronavila.entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL DEFAULT '0fcc4832-7f91-432b-b3d7-65e84082c590'::uuid,
    owner_id UUID NULL,
    entity_type TEXT NOT NULL,
    name TEXT NOT NULL,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS custom_moronavila.entity_relations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL DEFAULT '0fcc4832-7f91-432b-b3d7-65e84082c590'::uuid,
    source_id UUID NOT NULL,
    target_id UUID NOT NULL,
    relation_type TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS custom_moronavila.records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL DEFAULT '0fcc4832-7f91-432b-b3d7-65e84082c590'::uuid,
    collection TEXT NOT NULL,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS custom_moronavila.files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL DEFAULT '0fcc4832-7f91-432b-b3d7-65e84082c590'::uuid,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL DEFAULT 0,
    mime_type TEXT NOT NULL DEFAULT 'application/octet-stream',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS custom_moronavila.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL DEFAULT '0fcc4832-7f91-432b-b3d7-65e84082c590'::uuid,
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS custom_moronavila.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL DEFAULT '0fcc4832-7f91-432b-b3d7-65e84082c590'::uuid,
    user_id UUID NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id UUID NULL,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS custom_moronavila.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL DEFAULT '0fcc4832-7f91-432b-b3d7-65e84082c590'::uuid,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- =====================================================================================
-- 4. TABELAS DE DOMÍNIO DO MORONAVILA (custom_moronavila)
-- =====================================================================================

-- ── 4.1 ROOMS (Quartos e Cômodos) ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS custom_moronavila.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'Quarto',
    capacity INT NOT NULL DEFAULT 1,
    occupied INT NOT NULL DEFAULT 0,
    rent_value NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    cleaning_fee NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    extras_value NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    description TEXT,
    suite BOOLEAN NOT NULL DEFAULT false,
    is_common_area BOOLEAN NOT NULL DEFAULT false,
    is_blocked_for_repairs BOOLEAN NOT NULL DEFAULT false,
    availability_status TEXT NOT NULL DEFAULT 'Disponível',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ── 4.2 RESIDENTS (Moradores, Candidatos e Administradores) ──────────────────────────
CREATE TABLE IF NOT EXISTS custom_moronavila.residents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID UNIQUE, -- Vínculo com auth.users se aplicável
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    photo_url TEXT,
    instagram TEXT,
    role TEXT NOT NULL DEFAULT 'Morador', -- 'Administrador' ou 'Morador'
    status TEXT NOT NULL DEFAULT 'Ativo', -- 'Ativo', 'Inativo', 'Candidato'
    habilitado BOOLEAN NOT NULL DEFAULT true,
    motivo_bloqueio TEXT,
    entry_date DATE,
    birth_date DATE,
    cpf TEXT,
    rg TEXT,
    document_number TEXT,
    origin_address TEXT,
    family_address TEXT,
    work_address TEXT,
    room_id UUID REFERENCES custom_moronavila.rooms(id) ON DELETE SET NULL,
    bed_identifier TEXT,
    rent_value NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    cleaning_fee NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    extras_value NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    mac_address TEXT,
    mac_address_pc TEXT,
    internet_active BOOLEAN NOT NULL DEFAULT false,
    internet_renewal_date DATE,
    softphone_extension TEXT,
    softphone_enabled BOOLEAN NOT NULL DEFAULT true,
    softphone_display_name TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    occupation TEXT,
    company TEXT,
    university TEXT,
    course TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ── 4.3 DEVICES (Dispositivos Wi-Fi dos Moradores) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS custom_moronavila.devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resident_id UUID REFERENCES custom_moronavila.residents(id) ON DELETE CASCADE,
    device_type TEXT NOT NULL CHECK (device_type IN ('Celular', 'Computador', 'Outro')),
    mac_address TEXT NOT NULL,
    ip_address TEXT,
    connected_time TEXT,
    bandwidth_usage NUMERIC(10,2),
    status TEXT NOT NULL DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Ativo', 'Bloqueado')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ── 4.4 FURNITURE (Móveis e Itens dos Quartos) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS custom_moronavila.furniture (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES custom_moronavila.rooms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    condition TEXT NOT NULL DEFAULT 'Bom',
    purchase_date DATE,
    serial_number TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ── 4.5 ROOM MEDIA (Fotos e Vídeos dos Quartos) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS custom_moronavila.room_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES custom_moronavila.rooms(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'image',
    storage_path TEXT,
    is_marketing BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ── 4.6 PAYMENTS (Financeiro e Mensalidades) ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS custom_moronavila.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resident_id UUID REFERENCES custom_moronavila.residents(id) ON DELETE SET NULL,
    month TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    due_date DATE NOT NULL,
    payment_date DATE,
    status TEXT NOT NULL DEFAULT 'Pendente', -- 'Pago', 'Pendente', 'Atrasado'
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ── 4.7 MAINTENANCE REQUESTS (Chamados de Reparos / Kanban) ─────────────────────────
CREATE TABLE IF NOT EXISTS custom_moronavila.maintenance_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    room_id UUID REFERENCES custom_moronavila.rooms(id) ON DELETE SET NULL,
    requested_by UUID REFERENCES custom_moronavila.residents(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'Aberto', -- 'Aberto', 'Em Andamento', 'Resolvido'
    photo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ── 4.8 COMPLAINTS (Reclamações / Sugestões) ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS custom_moronavila.complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resident_id UUID REFERENCES custom_moronavila.residents(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Em Análise',
    is_anonymous BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ── 4.9 NOTICES & COMMENTS (Mural de Avisos) ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS custom_moronavila.notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Normal',
    author_id UUID REFERENCES custom_moronavila.residents(id) ON DELETE CASCADE,
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    is_general BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS custom_moronavila.notice_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notice_id UUID REFERENCES custom_moronavila.notices(id) ON DELETE CASCADE,
    resident_id UUID REFERENCES custom_moronavila.residents(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ── 4.10 CALENDAR (Agenda de Eventos e Participantes) ───────────────────────────────
CREATE TABLE IF NOT EXISTS custom_moronavila.calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    location TEXT,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS custom_moronavila.calendar_event_residents (
    event_id UUID REFERENCES custom_moronavila.calendar_events(id) ON DELETE CASCADE,
    resident_id UUID REFERENCES custom_moronavila.residents(id) ON DELETE CASCADE,
    PRIMARY KEY (event_id, resident_id)
);

-- ── 4.11 LAUNDRY SCHEDULES (Agendamento Inteligente de Lavanderia) ───────────────────
CREATE TABLE IF NOT EXISTS custom_moronavila.laundry_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resident_id UUID REFERENCES custom_moronavila.residents(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'Agendado' CHECK (status IN ('Agendado', 'Concluído', 'Cancelado')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ── 4.12 PROPERTY DESCRIPTION (Conteúdo da Landing Page Pública) ────────────────────
CREATE TABLE IF NOT EXISTS custom_moronavila.property_description (
    id TEXT PRIMARY KEY DEFAULT 'default',
    main_text TEXT,
    main_media TEXT[] DEFAULT ARRAY[]::TEXT[],
    gallery_media TEXT[] DEFAULT ARRAY[]::TEXT[],
    rooms_text TEXT,
    location_text TEXT,
    location_media TEXT[] DEFAULT ARRAY[]::TEXT[],
    amenities_text TEXT,
    rules_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ── 4.13 RENTAL CONDITIONS (Condições de Locação, Caução e Pró-Rata) ────────────────
CREATE TABLE IF NOT EXISTS custom_moronavila.rental_conditions (
    id TEXT PRIMARY KEY DEFAULT 'default',
    deposit_months INTEGER DEFAULT 1,
    cleaning_fee_fixed NUMERIC(10,2) DEFAULT 150.00,
    pro_rata_enabled BOOLEAN DEFAULT true,
    rules_summary TEXT,
    calculation_instructions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ── 4.14 RESIDENT MESSAGES (Inbox de Mensagens / Softphone) ─────────────────────────
CREATE TABLE IF NOT EXISTS custom_moronavila.resident_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resident_id UUID NOT NULL REFERENCES custom_moronavila.residents(id) ON DELETE CASCADE,
    channel TEXT NOT NULL CHECK (channel IN ('note', 'voice', 'package')),
    category TEXT NOT NULL DEFAULT 'general' CHECK (
        category IN ('payment', 'maintenance', 'cleaning', 'admin', 'internet', 'softphone', 'package', 'voice', 'general')
    ),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    read_at TIMESTAMPTZ NULL,
    resolved_at TIMESTAMPTZ NULL,
    related_entity_type TEXT NULL,
    related_entity_id TEXT NULL,
    metadata JSONB NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS resident_messages_resident_created_idx
    ON custom_moronavila.resident_messages (resident_id, created_at DESC);

CREATE INDEX IF NOT EXISTS resident_messages_resident_channel_idx
    ON custom_moronavila.resident_messages (resident_id, channel, read_at, resolved_at);

-- =====================================================================================
-- 5. PERMISSÕES & GRANTS (Supabase Roles: anon, authenticated, service_role)
-- =====================================================================================

GRANT USAGE ON SCHEMA custom_moronavila TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA custom_moronavila TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA custom_moronavila TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA custom_moronavila TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA custom_moronavila GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA custom_moronavila GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA custom_moronavila GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- =====================================================================================
-- 6. POLÍTICAS DE ROW LEVEL SECURITY (RLS)
-- =====================================================================================

ALTER TABLE custom_moronavila.entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_moronavila.entity_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_moronavila.records ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_moronavila.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_moronavila.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_moronavila.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_moronavila.events ENABLE ROW LEVEL SECURITY;

ALTER TABLE custom_moronavila.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_moronavila.residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_moronavila.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_moronavila.furniture ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_moronavila.room_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_moronavila.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_moronavila.maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_moronavila.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_moronavila.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_moronavila.notice_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_moronavila.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_moronavila.calendar_event_residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_moronavila.laundry_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_moronavila.property_description ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_moronavila.rental_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_moronavila.resident_messages ENABLE ROW LEVEL SECURITY;

-- Políticas de Acesso Geral Controladas
CREATE POLICY "Public Read Rooms" ON custom_moronavila.rooms FOR SELECT USING (true);
CREATE POLICY "Full Access Rooms" ON custom_moronavila.rooms FOR ALL USING (true);

CREATE POLICY "Public Read PropertyDesc" ON custom_moronavila.property_description FOR SELECT USING (true);
CREATE POLICY "Full Access PropertyDesc" ON custom_moronavila.property_description FOR ALL USING (true);

CREATE POLICY "Public Read RentalConditions" ON custom_moronavila.rental_conditions FOR SELECT USING (true);
CREATE POLICY "Full Access RentalConditions" ON custom_moronavila.rental_conditions FOR ALL USING (true);

CREATE POLICY "Full Access Residents" ON custom_moronavila.residents FOR ALL USING (true);
CREATE POLICY "Full Access Devices" ON custom_moronavila.devices FOR ALL USING (true);
CREATE POLICY "Full Access Furniture" ON custom_moronavila.furniture FOR ALL USING (true);
CREATE POLICY "Full Access RoomMedia" ON custom_moronavila.room_media FOR ALL USING (true);
CREATE POLICY "Full Access Payments" ON custom_moronavila.payments FOR ALL USING (true);
CREATE POLICY "Full Access Maintenance" ON custom_moronavila.maintenance_requests FOR ALL USING (true);
CREATE POLICY "Full Access Complaints" ON custom_moronavila.complaints FOR ALL USING (true);
CREATE POLICY "Full Access Notices" ON custom_moronavila.notices FOR ALL USING (true);
CREATE POLICY "Full Access NoticeComments" ON custom_moronavila.notice_comments FOR ALL USING (true);
CREATE POLICY "Full Access CalendarEvents" ON custom_moronavila.calendar_events FOR ALL USING (true);
CREATE POLICY "Full Access CalendarResidents" ON custom_moronavila.calendar_event_residents FOR ALL USING (true);
CREATE POLICY "Full Access Laundry" ON custom_moronavila.laundry_schedules FOR ALL USING (true);
CREATE POLICY "Full Access Messages" ON custom_moronavila.resident_messages FOR ALL USING (true);

CREATE POLICY "Full Access Governance Entities" ON custom_moronavila.entities FOR ALL USING (true);
CREATE POLICY "Full Access Governance Records" ON custom_moronavila.records FOR ALL USING (true);
CREATE POLICY "Full Access Governance Files" ON custom_moronavila.files FOR ALL USING (true);
CREATE POLICY "Full Access Governance Settings" ON custom_moronavila.settings FOR ALL USING (true);
CREATE POLICY "Full Access Governance AuditLogs" ON custom_moronavila.audit_logs FOR ALL USING (true);
CREATE POLICY "Full Access Governance Events" ON custom_moronavila.events FOR ALL USING (true);

-- =====================================================================================
-- 7. CARGA DE DADOS INICIAIS (SEED & RESTORE DO MORONAVILA)
-- =====================================================================================

-- ── 7.1 CÔMODOS & QUARTOS
INSERT INTO custom_moronavila.rooms (id, name, capacity, occupied, rent_value, description, suite, created_at, updated_at, type, cleaning_fee, extras_value, is_common_area, availability_status) VALUES
('19535d39-de6f-4acd-bbfc-2ba817be7257', 'Quarto A', 1, 0, 900.00, 'Quarto individual confortável e bem iluminado.', false, now(), now(), 'Quarto', 80.00, 0.00, false, 'Disponível'),
('2b523237-b456-4d4b-8eb2-1f561efe9c57', 'Quarto B', 1, 0, 900.00, 'Quarto individual com armário e mesa de estudos.', false, now(), now(), 'Quarto', 80.00, 0.00, false, 'Disponível'),
('c4a3d74d-104d-49d4-a04b-6b439c0251ee', 'Quarto C', 1, 0, 900.00, 'Quarto individual amplo e silencioso.', false, now(), now(), 'Quarto', 80.00, 0.00, false, 'Disponível'),
('944f5427-482b-4597-9e5a-680a20188ee6', 'Quarto D', 1, 0, 900.00, 'Quarto individual com ótima ventilação natural.', false, now(), now(), 'Quarto', 80.00, 0.00, false, 'Disponível'),
('c1e7a552-0cba-46f6-b36d-f5a3a79ca0c3', 'Quarto E', 4, 0, 550.00, 'Quarto compartilhado amplo com camas individuais.', false, now(), now(), 'Quarto', 60.00, 0.00, false, 'Disponível'),
('ad0636b3-cbd1-454e-9dbc-214512a1e59e', 'Quarto F', 4, 0, 550.00, 'Quarto compartilhado para 4 pessoas com armários individuais.', false, now(), now(), 'Quarto', 60.00, 0.00, false, 'Disponível'),
('bfafb383-e2c0-48a6-9408-05474258b286', 'Quarto G', 4, 0, 550.00, 'Quarto compartilhado espaçoso e arejado.', false, now(), now(), 'Quarto', 80.00, 0.00, false, 'Disponível'),
('97c71d2e-1dc4-46c1-a32c-4796f6160cf6', 'Quarto H', 1, 0, 900.00, 'Quarto privativo individual no pavimento superior.', false, now(), now(), 'Quarto', 80.00, 0.00, false, 'Disponível'),
('33333333-3333-3333-3333-333333333333', 'Cozinha/Comum', 0, 0, 0.00, 'Área social e cozinha compartilhada da casa.', false, now(), now(), 'Cozinha', 0.00, 0.00, true, 'Disponível')
ON CONFLICT (id) DO NOTHING;

-- ── 7.2 MORADORES & ADMINISTRADORES INICIAIS
INSERT INTO custom_moronavila.residents (id, name, email, phone, role, status, entry_date, birth_date, origin_address, work_address, internet_active, softphone_enabled, created_at, updated_at, instagram, photo_url) VALUES 
('49858e88-bb1f-4315-afb8-e5835e9aabda', 'Sergio Castro', 'sergio@facebrasil.com', '21983245000', 'Administrador', 'Ativo', '2026-03-05', '1962-12-20', 'Rua Torres Homem, 886', 'Rua Torres Homem, 886', true, true, now(), now(), 'sergiomvj', NULL),
('da3164d8-6cda-4c26-8a74-22a380a6f8cf', 'Lena Castro', 'lenapscastro@gmail.com', '21981900803', 'Administrador', 'Ativo', '2026-03-04', '1962-08-30', 'Rua Torres Homem, 886', 'Rua Torres Homem, 886', true, true, now(), now(), 'lenapscastro', NULL)
ON CONFLICT (id) DO NOTHING;

-- ── 7.3 DESCRIÇÃO DA PROPRIEDADE (LANDING PAGE)
INSERT INTO custom_moronavila.property_description (
    id, main_text, main_media, gallery_media, rooms_text, location_text, amenities_text, rules_text
) VALUES (
    'default',
    'Conforto e Praticidade para sua Vida Acadêmica e Profissional
A MoronaVila oferece o ambiente ideal para quem busca foco nos estudos e tranquilidade no dia a dia, com infraestrutura completa e localização privilegiada na Vila Isabel.',
    ARRAY['/fotos/vprimage11_entrada.jpg']::TEXT[],
    ARRAY['/fotos/vprimage10_cozinha.jpg', '/fotos/vprimage3_saladeestudos.jpg', '/fotos/vprimage9_areaexterna.jpg']::TEXT[],
    'Nossas acomodações foram pensadas para o máximo aproveitamento de espaço e conforto. Cada quarto é entregue 100% mobiliado e pronto para morar, em uma casa com áreas comuns amplas e equipadas.',
    'Localizada estrategicamente na Rua Torres Homem 886, a 300m do Shopping Boulevard, 100m da Praça Sete e próxima de centros universitários (UERJ, HUPE).',
    'Internet de alta velocidade, cozinha compartilhada totalmente equipada, sala de estudos/coworking, lavanderia e limpeza semanal das áreas comuns inclusas no valor do aluguel.',
    'Prezamos pela convivência harmoniosa. Silêncio após as 22h, respeito aos espaços comuns e colaboração mútua são os pilares da nossa comunidade.'
) ON CONFLICT (id) DO UPDATE SET
    main_text = EXCLUDED.main_text,
    main_media = EXCLUDED.main_media,
    gallery_media = EXCLUDED.gallery_media,
    rooms_text = EXCLUDED.rooms_text,
    location_text = EXCLUDED.location_text,
    amenities_text = EXCLUDED.amenities_text,
    rules_text = EXCLUDED.rules_text,
    updated_at = now();

-- ── 7.4 CONDIÇÕES DE ALUGUEL
INSERT INTO custom_moronavila.rental_conditions (
    id, deposit_months, cleaning_fee_fixed, pro_rata_enabled, rules_summary, calculation_instructions
) VALUES (
    'default',
    1,
    150.00,
    true,
    'O caução é devolvido ao final do contrato ou quita o último mês conforme vistoria. Sem necessidade de fiador.',
    'Informe a data prevista de entrada para simular os valores do seu primeiro mês de estadia.'
) ON CONFLICT (id) DO UPDATE SET
    deposit_months = EXCLUDED.deposit_months,
    cleaning_fee_fixed = EXCLUDED.cleaning_fee_fixed,
    pro_rata_enabled = EXCLUDED.pro_rata_enabled,
    rules_summary = EXCLUDED.rules_summary,
    calculation_instructions = EXCLUDED.calculation_instructions,
    updated_at = now();

-- =====================================================================================
-- MIGRAÇÃO CONCLUÍDA COM SUCESSO NO SCHEMA custom_moronavila!
-- =====================================================================================
