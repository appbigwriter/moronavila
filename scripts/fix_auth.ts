import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const url = process.env.VITE_SUPABASE_URL || 'https://supabase-control-tower-api.fbr.news';
const anonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAnon = createClient(url, anonKey);
const supabaseAdmin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

async function diagnose() {
  const email = 'sergio@fbr.news';
  const password = 'Super1404@@@';

  console.log(`\n🔍 Diagnosticando Auth para: ${email}...`);

  // 1. Testar Login com Anon
  const { data: signInData, error: signInError } = await supabaseAnon.auth.signInWithPassword({ email, password });
  console.log('Anon signInWithPassword:', { user: signInData?.user?.id, error: signInError?.message });

  // 2. Listar usuários via Admin API
  const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  if (listError) {
    console.log('Admin listUsers error:', listError.message);
  } else {
    const user = listData.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    console.log('Found user in Auth:', user ? {
      id: user.id,
      email: user.email,
      email_confirmed_at: user.email_confirmed_at,
      last_sign_in_at: user.last_sign_in_at
    } : 'NOT FOUND');

    if (user) {
      console.log('🔄 Atualizando senha e confirmando e-mail via Admin API...');
      const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
        password: password,
        email_confirm: true
      });
      console.log('Admin updateUserById:', { user: updateData?.user?.id, error: updateError?.message });

      // Testar novamente login
      const { data: testLogin, error: testError } = await supabaseAnon.auth.signInWithPassword({ email, password });
      console.log('✅ Novo teste de login após confirmar:', { user: testLogin?.user?.id, error: testError?.message });
    } else {
      console.log('➕ Criando usuário já confirmado via Admin API...');
      const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });
      console.log('Admin createUser:', { user: createData?.user?.id, error: createError?.message });
    }
  }
}

diagnose();
