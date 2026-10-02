import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ VITE_SUPABASE_URL ou chaves do Supabase não encontradas no .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    db: { schema: process.env.VITE_SUPABASE_SCHEMA || 'custom_moronavila' }
});

async function createOrPromoteAdmin() {
    const args = process.argv.slice(2);
    const emailArg = args[0] || 'admin@moronavila.com.br';
    const passwordArg = args[1] || 'moronaAdmin2026!';
    const nameArg = args[2] || 'Administrador MoronaVila';
    const phoneArg = args[3] || '21981900803';

    console.log(`\n🚀 Criando / Promovendo Administrador Root...`);
    console.log(`📧 E-mail: ${emailArg}`);
    console.log(`👤 Nome: ${nameArg}`);

    try {
        // 1. Tenta criar usuário no Supabase Auth
        let authId: string | null = null;
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: emailArg,
            password: passwordArg
        });

        if (signUpError) {
            console.log(`ℹ️ Auth SignUp (${signUpError.message}). Verificando registro existente...`);
        } else if (signUpData.user) {
            authId = signUpData.user.id;
            console.log(`✅ Usuário criado no Supabase Auth com ID: ${authId}`);
        }

        // 2. Upsert na tabela residents com role Administrador
        const residentPayload: any = {
            name: nameArg,
            email: emailArg,
            phone: phoneArg,
            role: 'Administrador',
            status: 'Ativo',
            habilitado: true,
            entry_date: new Date().toISOString().split('T')[0],
            internet_active: true
        };

        if (authId) {
            residentPayload.auth_id = authId;
        }

        const { data: resident, error: residentError } = await supabase
            .from('residents')
            .upsert(residentPayload, { onConflict: 'email' })
            .select()
            .single();

        if (residentError) {
            throw residentError;
        }

        console.log(`\n🎉 Administrador Root configurado com sucesso!`);
        console.log(`-----------------------------------------------`);
        console.log(`Login:    ${emailArg}`);
        console.log(`Senha:    ${passwordArg}`);
        console.log(`Perfil:   Administrador (Acesso total)`);
        console.log(`-----------------------------------------------\n`);
    } catch (err: any) {
        console.error(`❌ Erro ao configurar Administrador:`, err?.message || err);
    }
}

createOrPromoteAdmin();
