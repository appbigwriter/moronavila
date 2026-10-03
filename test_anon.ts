import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://supabase-control-tower-api.fbr.news';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzg5OTkwODc2LCJleHAiOjE5NDc2NzA4NzZ9.f2enmw8Mk0hWI6WcNfkZLGOl-qaqVzQBGt8qftDaR6k';

// Testar com schema public
const clientPublic = createClient(supabaseUrl, supabaseAnonKey, { db: { schema: 'public' } });
// Testar com schema custom_moronavila
const clientCustom = createClient(supabaseUrl, supabaseAnonKey, { db: { schema: 'custom_moronavila' } });

async function testAnon() {
    console.log('--- TESTANDO LEITURA ANONIMA NO SCHEMA PUBLIC ---');
    const { data: pubRooms, error: pubErr } = await clientPublic.from('rooms').select('*');
    console.log('Public rooms error:', pubErr);
    console.log('Public rooms count:', pubRooms?.length);
    if (pubRooms?.length) {
        console.log('Sample public room:', pubRooms[0]);
    }

    console.log('\n--- TESTANDO LEITURA ANONIMA NO SCHEMA CUSTOM_MORONAVILA ---');
    const { data: custRooms, error: custErr } = await clientCustom.from('rooms').select('*');
    console.log('Custom rooms error:', custErr);
    console.log('Custom rooms count:', custRooms?.length);
    if (custRooms?.length) {
        console.log('Sample custom room:', custRooms[0]);
    }
}

testAnon();
