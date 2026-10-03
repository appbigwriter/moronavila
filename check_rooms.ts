import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://supabase-control-tower-api.fbr.news';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabaseSchema = process.env.VITE_SUPABASE_SCHEMA || 'custom_moronavila';

console.log('Testing Supabase Connection...');
console.log('URL:', supabaseUrl);
console.log('Schema:', supabaseSchema);

const supabase = createClient(supabaseUrl, supabaseKey, {
    db: { schema: supabaseSchema }
});

async function test() {
    try {
        console.log('\n--- ROOMS ---');
        const { data: rooms, error: roomsError } = await supabase.from('rooms').select('*');
        if (roomsError) {
            console.error('Error fetching rooms:', roomsError);
        } else {
            console.log(`Found ${rooms?.length} rooms:`);
            console.log(JSON.stringify(rooms, null, 2));
        }

        console.log('\n--- RENTAL CONDITIONS ---');
        const { data: conditions, error: condError } = await supabase.from('rental_conditions').select('*');
        if (condError) {
            console.error('Error fetching conditions:', condError);
        } else {
            console.log('Conditions:', JSON.stringify(conditions, null, 2));
        }

        console.log('\n--- PROPERTY DESCRIPTION ---');
        const { data: desc, error: descError } = await supabase.from('property_description').select('*');
        if (descError) {
            console.error('Error fetching property_description:', descError);
        } else {
            console.log('Desc:', JSON.stringify(desc, null, 2));
        }
    } catch (e) {
        console.error('Exception:', e);
    }
}

test();
