const supabaseUrl = 'https://supabase-control-tower-api.fbr.news';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzg5OTkwODc2LCJleHAiOjE5NDc2NzA4NzZ9.f2enmw8Mk0hWI6WcNfkZLGOl-qaqVzQBGt8qftDaR6k';

async function testHeaders() {
    const endpoints = ['rooms', 'rental_conditions', 'property_description'];

    for (const ep of endpoints) {
        console.log(`\n================= TESTANDO ${ep} =================`);
        
        // Teste 1: Padrão (Sem Accept-Profile)
        try {
            const res1 = await fetch(`${supabaseUrl}/rest/v1/${ep}?select=*`, {
                headers: {
                    'apikey': supabaseAnonKey,
                    'Authorization': `Bearer ${supabaseAnonKey}`,
                    'Accept': 'application/json'
                }
            });
            console.log(`[Sem Accept-Profile] Status: ${res1.status} ${res1.statusText}`);
            if (res1.ok) {
                const data = await res1.json();
                console.log(`[Sem Accept-Profile] Data count: ${Array.isArray(data) ? data.length : 1}`);
            } else {
                console.log(`[Sem Accept-Profile] Body:`, await res1.text());
            }
        } catch (e) {
            console.error('[Sem Accept-Profile] Fetch error:', e);
        }

        // Teste 2: Com Accept-Profile: public
        try {
            const res2 = await fetch(`${supabaseUrl}/rest/v1/${ep}?select=*`, {
                headers: {
                    'apikey': supabaseAnonKey,
                    'Authorization': `Bearer ${supabaseAnonKey}`,
                    'Accept': 'application/json',
                    'Accept-Profile': 'public'
                }
            });
            console.log(`[Com Accept-Profile: public] Status: ${res2.status} ${res2.statusText}`);
            if (!res2.ok) {
                console.log(`[Com Accept-Profile: public] Body:`, await res2.text());
            }
        } catch (e) {
            console.error('[Com Accept-Profile: public] Fetch error:', e);
        }

        // Teste 3: Com Accept-Profile: custom_moronavila
        try {
            const res3 = await fetch(`${supabaseUrl}/rest/v1/${ep}?select=*`, {
                headers: {
                    'apikey': supabaseAnonKey,
                    'Authorization': `Bearer ${supabaseAnonKey}`,
                    'Accept': 'application/json',
                    'Accept-Profile': 'custom_moronavila'
                }
            });
            console.log(`[Com Accept-Profile: custom_moronavila] Status: ${res3.status} ${res3.statusText}`);
            if (!res3.ok) {
                console.log(`[Com Accept-Profile: custom_moronavila] Body:`, await res3.text());
            }
        } catch (e) {
            console.error('[Com Accept-Profile: custom_moronavila] Fetch error:', e);
        }
    }
}

testHeaders();
