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
            console.log(`ℹ️ Auth: ${signUpError.message}`);
        } else if (signUpData?.user) {
            authId = signUpData.user.id;
            console.log(`✅ Usuário verificado no Supabase Auth com ID: ${authId}`);
        }

        // Tentar obter authId caso já exista
        if (!authId) {
            try {
                const { data: signInData } = await supabase.auth.signInWithPassword({
                    email: emailArg,
                    password: passwordArg
                });
                if (signInData?.user) {
                    authId = signInData.user.id;
                    console.log(`✅ Autenticado com sucesso no Supabase Auth! User ID: ${authId}`);
                }
            } catch (signInErr: any) {
                console.log(`ℹ️ Login check: ${signInErr?.message || ''}`);
            }
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

        let residentRes = await supabase
            .from('residents')
            .upsert(residentPayload, { onConflict: 'email' })
            .select()
            .maybeSingle();

        // Fallback para schema public se custom_moronavila não estiver exposto no PostgREST
        if (residentRes.error) {
            console.log(`⚠️ Tentando gravar no schema padrão... Detalhe: ${residentRes.error.message}`);
            const defaultClient = createClient(supabaseUrl, serviceRoleKey);
            residentRes = await defaultClient
                .from('residents')
                .upsert(residentPayload, { onConflict: 'email' })
                .select()
                .maybeSingle();
        }

        if (residentRes.error) {
            console.error(`❌ Erro no banco de dados (${residentRes.error.code}): ${residentRes.error.message}`);
            console.log(`💡 Dica: Execute o SQL abaixo diretamente no PostgreSQL do Control Tower para garantir o perfil:`);
            console.log(`\nUPDATE ${process.env.VITE_SUPABASE_SCHEMA || 'custom_moronavila'}.residents SET role = 'Administrador', status = 'Ativo', habilitado = true WHERE email = '${emailArg}';\n`);
        } else {
            console.log(`\n🎉 Administrador Root configurado com sucesso!`);
            console.log(`-----------------------------------------------`);
            console.log(`Login:    ${emailArg}`);
            console.log(`Senha:    ${passwordArg}`);
            console.log(`Perfil:   Administrador (Acesso total)`);
            console.log(`-----------------------------------------------\n`);
        }
    } catch (err: any) {
        console.error(`❌ Erro ao configurar Administrador:`, err?.message || err);
    }
}

createOrPromoteAdmin();
