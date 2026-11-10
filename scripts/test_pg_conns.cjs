const { Client } = require('pg');

const attempts = [
  'postgresql://postgres.supabase-vps2:Super1404@76.13.168.223:15432/postgres',
  'postgresql://postgres:Super1404@76.13.168.223:15432/postgres',
  'postgresql://postgres.supabase-vps2:ffff332788fcc1ae8a484930fd1e3272@76.13.168.223:15432/postgres',
  'postgresql://postgres:ffff332788fcc1ae8a484930fd1e3272@76.13.168.223:15432/postgres',
  'postgresql://supabase_admin:Super1404@76.13.168.223:15432/postgres',
  'postgresql://supabase_admin:ffff332788fcc1ae8a484930fd1e3272@76.13.168.223:15432/postgres'
];

async function tryConnect() {
  for (const conn of attempts) {
    const masked = conn.replace(/:[^:@]+@/, ':***@');
    try {
      const client = new Client({ connectionString: conn, ssl: false, connectionTimeoutMillis: 3000 });
      await client.connect();
      console.log('SUCCESS with:', masked);
      await client.end();
      return conn;
    } catch (err) {
      console.log('Failed', masked, err.message);
    }
  }
}

tryConnect().catch(console.error);

