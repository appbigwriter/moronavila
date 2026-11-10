const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.supabase-vps2:ffff332788fcc1ae8a484930fd1e3272@76.13.168.223:15432/postgres',
  ssl: false
});

async function check() {
  await client.connect();

  const tables = await client.query(`
    SELECT c.relname, c.relrowsecurity 
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind = 'r'
    ORDER BY c.relname;
  `);
  console.log('Public tables RLS status:');
  for (const t of tables.rows) {
    const policies = await client.query(`
      SELECT policyname, cmd, roles 
      FROM pg_policies 
      WHERE schemaname = 'public' AND tablename = $1;
    `, [t.relname]);
    console.log(`- ${t.relname}: RLS=${t.relrowsecurity}, policies count=${policies.rows.length}`);
    if (t.relrowsecurity && policies.rows.length === 0) {
      console.log(`  ⚠️ WARNING: ${t.relname} has RLS enabled but ZERO policies!`);
    }
  }

  await client.end();
}

check().catch(console.error);

