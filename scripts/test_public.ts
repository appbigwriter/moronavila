import { createClient } from '@supabase/supabase-js';

const url = 'https://supabase-control-tower-api.fbr.news';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3ODk5OTA4NzYsImV4cCI6MTk0NzY3MDg3Nn0.PfG5J9CrRA-R1smzXMQBoEA-rbNNLx671XxUocNuqlg';

async function testPublic() {
  const client = createClient(url, serviceKey);
  const tables = ['rooms', 'residents', 'payments', 'maintenance_requests', 'complaints', 'notices', 'calendar_events', 'property_description'];
  
  console.log('Testando tabelas no schema public atual:');
  for (const t of tables) {
    const { data, error } = await client.from(t).select('*').limit(1);
    console.log(`Tabela public.${t}:`, error ? `❌ ${error.message}` : `✅ OK (${data?.length} itens)`);
  }
}

testPublic();
