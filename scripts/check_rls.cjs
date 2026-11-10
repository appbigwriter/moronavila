const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.supabase-vps2:ffff332788fcc1ae8a484930fd1e3272@76.13.168.223:15432/postgres',
  ssl: false
});

async function check() {
  await client.connect();
  console.log('Connected to PostgreSQL database successfully!');

  // 1. Check storage.objects policies
  const storagePolicies = await client.query(`
    SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
    FROM pg_policies 
    WHERE tablename = 'objects' AND schemaname = 'storage';
  `);
  console.log('\n--- storage.objects policies ---');
  console.dir(storagePolicies.rows, { depth: null });

  // 2. Check storage.buckets policies
  const bucketPolicies = await client.query(`
    SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
    FROM pg_policies 
    WHERE tablename = 'buckets' AND schemaname = 'storage';
  `);
  console.log('\n--- storage.buckets policies ---');
  console.dir(bucketPolicies.rows, { depth: null });

  // 3. Check storage.buckets
  const buckets = await client.query(`
    SELECT id, name, public, file_size_limit, allowed_mime_types 
    FROM storage.buckets;
  `);
  console.log('\n--- storage.buckets ---');
  console.dir(buckets.rows, { depth: null });

  // 4. Check room_media policies
  const roomMediaPolicies = await client.query(`
    SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
    FROM pg_policies 
    WHERE tablename = 'room_media';
  `);
  console.log('\n--- room_media policies ---');
  console.dir(roomMediaPolicies.rows, { depth: null });

  await client.end();
}

check().catch(console.error);
