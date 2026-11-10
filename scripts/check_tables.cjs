const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.supabase-vps2:ffff332788fcc1ae8a484930fd1e3272@76.13.168.223:15432/postgres',
  ssl: false
});

async function check() {
  await client.connect();

  // Check which schemas have room_media
  const tables = await client.query(`
    SELECT table_schema, table_name 
    FROM information_schema.tables 
    WHERE table_name = 'room_media';
  `);
  console.log('room_media tables in DB:', tables.rows);

  // Check RLS on storage.objects
  const rlsObjects = await client.query(`
    SELECT c.relname, c.relrowsecurity, c.relforcerowsecurity 
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'storage' AND c.relname = 'objects';
  `);
  console.log('storage.objects RLS status:', rlsObjects.rows);

  // Check public.room_media policies if exists
  const publicRoomMediaPolicies = await client.query(`
    SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
    FROM pg_policies 
    WHERE tablename = 'room_media' AND schemaname = 'public';
  `);
  console.log('public.room_media policies:', publicRoomMediaPolicies.rows);

  await client.end();
}

check().catch(console.error);

