const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.supabase-vps2:ffff332788fcc1ae8a484930fd1e3272@76.13.168.223:15432/postgres',
  ssl: false
});

async function check() {
  await client.connect();

  const viewDef = await client.query(`
    SELECT viewname, definition 
    FROM pg_views 
    WHERE schemaname = 'public' AND viewname = 'room_media';
  `);
  console.log('public.room_media definition:', viewDef.rows);

  const activePolicies = await client.query(`
    SELECT policyname, cmd, roles 
    FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects';
  `);
  console.log('\nActive storage.objects policies:');
  console.dir(activePolicies.rows, { depth: null });

  await client.end();
}

check().catch(console.error);

