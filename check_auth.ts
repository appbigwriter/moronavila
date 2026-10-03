import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://supabase-control-tower-api.fbr.news';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function listUsers() {
    console.log('--- RESIDENTS TABLE ---');
    const { data: residents, error: resErr } = await supabase.from('residents').select('*');
    if (resErr) {
        console.error('Error fetching residents:', resErr);
    } else {
        console.log(`Found ${residents?.length} residents:`);
        residents?.forEach(r => {
            console.log(`ID: ${r.id} | Name: ${r.name} | Email: ${r.email} | Role: ${r.role} | Status: ${r.status} | Auth ID: ${r.auth_id}`);
        });
    }

    console.log('\n--- AUTH USERS (Admin API) ---');
    try {
        const { data: authUsers, error: authErr } = await supabase.auth.admin.listUsers();
        if (authErr) {
            console.error('Error listing auth users:', authErr);
        } else {
            console.log(`Found ${authUsers?.users?.length} auth users:`);
            authUsers?.users?.forEach(u => {
                console.log(`ID: ${u.id} | Email: ${u.email} | Confirmed: ${u.email_confirmed_at ? 'Yes' : 'No'} | Created: ${u.created_at}`);
            });
        }
    } catch (e) {
        console.error('Auth admin exception:', e);
    }
}

listUsers();
