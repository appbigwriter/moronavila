const { createClient } = require('@supabase/supabase-js');
const { Client } = require('pg');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

console.log('Testing Supabase Client...');
console.log('URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('\n--- 1. Supabase Client: select id, name, email, status, habilitado from residents ---');
    const { data, error } = await supabase.from('residents').select('id, name, email, status, habilitado');
    if (error) {
        console.error('Supabase Error:', error);
    } else {
        console.log(`Found ${data.length} residents in Supabase:`);
        data.forEach(r => console.log(`- [${r.status}] ${r.name} <${r.email}> (habilitado: ${r.habilitado})`));
    }

    console.log('\n--- 2. Supabase Auth Users ---');
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) {
        console.error('Auth Error:', authError);
    } else {
        console.log(`Found ${authData?.users?.length || 0} users in auth.users:`);
        authData?.users?.forEach(u => console.log(`- Auth: ${u.email} (id: ${u.id}, confirmed: ${u.email_confirmed_at})`));
    }

    console.log('\n--- 3. Direct Postgres Check (if reachable) ---');
    if (process.env.DATABASE_URL) {
        const pgClient = new Client({ connectionString: process.env.DATABASE_URL });
        try {
            await pgClient.connect();
            const res1 = await pgClient.query('SELECT id, name, email, status, habilitado FROM custom_moronavila.residents LIMIT 10');
            console.log(`custom_moronavila.residents (${res1.rows.length} rows):`, res1.rows);
            const res2 = await pgClient.query('SELECT id, name, email, status, habilitado FROM public.residents LIMIT 10');
            console.log(`public.residents (${res2.rows.length} rows):`, res2.rows);
            await pgClient.end();
        } catch (pgErr) {
            console.log('Postgres connection note:', pgErr.message);
        }
    }
}

check();
