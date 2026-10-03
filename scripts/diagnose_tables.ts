import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const url = process.env.VITE_SUPABASE_URL || 'https://supabase-control-tower-api.fbr.news';
const anonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const schema = process.env.VITE_SUPABASE_SCHEMA || 'custom_moronavila';

console.log('=== DIAGNÓSTICO SUPABASE CONTROL TOWER ===');
console.log('URL:', url);
console.log('Schema:', schema);

const tables = [
  'rooms',
  'residents',
  'payments',
  'maintenance_requests',
  'complaints',
  'notices',
  'calendar_events',
  'property_description'
];

async function checkTable(table, key, roleName) {
  try {
    const res = await fetch(`${url}/rest/v1/${table}?select=*&limit=3`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Accept-Profile': schema,
        'Content-Profile': schema
      }
    });
    const body = await res.text();
    console.log(`[${roleName}] Tabela '${table}': Status ${res.status}`);
    if (res.status !== 200) {
      console.log(`  -> Erro: ${body}`);
    } else {
      try {
        const json = JSON.parse(body);
        console.log(`  -> OK (${json.length} registros retornados)`);
      } catch {
        console.log(`  -> Body: ${body.substring(0, 100)}`);
      }
    }
  } catch (err) {
    console.log(`[${roleName}] Tabela '${table}': Exception ${err.message}`);
  }
}

async function run() {
  console.log('\n--- Testando com ANON KEY (Usado pelo Frontend) ---');
  for (const t of tables) {
    await checkTable(t, anonKey, 'ANON');
  }

  console.log('\n--- Testando com SERVICE ROLE KEY (Backend) ---');
  for (const t of tables) {
    await checkTable(t, serviceKey, 'SERVICE_ROLE');
  }
}

run();
