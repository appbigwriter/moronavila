import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://supabase-control-tower-api.fbr.news';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncAdminAuth() {
    console.log('--- ATUALIZANDO / SINCRONIZANDO ADMINS ---');
    
    // Lista de administradores para garantir no Auth
    const admins = [
        { email: 'sergio@fbr.news', name: 'Sergio Castro', pass: 'Super1404@@@' },
        { email: 'sergio@facebrasil.com', name: 'Sergio Castro', pass: 'Super1404@@@' },
        { email: 'lenapscastro@gmail.com', name: 'Lena Castro', pass: 'Super1404@@@' }
    ];

    for (const adm of admins) {
        console.log(`\nVerificando ${adm.email}...`);
        
        // 1. Verificar se existe no Auth
        const { data: usersData } = await supabase.auth.admin.listUsers();
        let user = (usersData?.users as any[])?.find(u => u.email?.toLowerCase() === adm.email.toLowerCase());

        if (!user) {
            console.log(`Criando usuário no Auth: ${adm.email}`);
            const { data: createData, error: createErr } = await supabase.auth.admin.createUser({
                email: adm.email,
                password: adm.pass,
                email_confirm: true,
                user_metadata: { name: adm.name }
            });
            if (createErr) {
                console.error(`Erro ao criar ${adm.email}:`, createErr);
                continue;
            }
            user = createData.user;
        } else {
            console.log(`Atualizando senha e confirmando e-mail de ${adm.email}...`);
            const { data: updData, error: updErr } = await supabase.auth.admin.updateUserById(user.id, {
                password: adm.pass,
                email_confirm: true
            });
            if (updErr) {
                console.error(`Erro ao atualizar senha de ${adm.email}:`, updErr);
            } else {
                console.log(`Senha atualizada com sucesso para ${adm.email}!`);
            }
        }

        // 2. Vincular auth_id na tabela residents
        if (user) {
            const { data: resData } = await supabase
                .from('residents')
                .select('*')
                .eq('email', adm.email)
                .maybeSingle();

            if (resData) {
                console.log(`Vinculando auth_id ${user.id} ao registro de residente ID ${resData.id}...`);
                await supabase
                    .from('residents')
                    .update({ auth_id: user.id, role: 'Administrador', status: 'Ativo' })
                    .eq('id', resData.id);
            } else {
                console.log(`Inserindo residente na tabela: ${adm.name}`);
                await supabase.from('residents').insert({
                    auth_id: user.id,
                    name: adm.name,
                    email: adm.email,
                    role: 'Administrador',
                    status: 'Ativo',
                    entry_date: new Date().toISOString().split('T')[0]
                });
            }
        }
    }

    console.log('\n--- SINCRONIZAÇÃO CONCLUÍDA ---');
}

syncAdminAuth();
