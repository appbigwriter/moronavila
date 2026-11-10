const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.supabase-vps2:ffff332788fcc1ae8a484930fd1e3272@76.13.168.223:15432/postgres',
  ssl: false
});

async function applyPolicies() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL successfully!');

    // 1. Garantir que os buckets existem e são públicos
    await client.query(`
      INSERT INTO storage.buckets (id, name, public)
      VALUES ('room-media', 'room-media', true)
      ON CONFLICT (id) DO UPDATE SET public = true;

      INSERT INTO storage.buckets (id, name, public)
      VALUES ('resident-documents', 'resident-documents', true)
      ON CONFLICT (id) DO UPDATE SET public = true;
    `);
    console.log('Buckets checked and marked as public!');

    // 2. Criar ou recriar políticas RLS para room-media em storage.objects
    await client.query(`
      DROP POLICY IF EXISTS "Allow public select from room-media" ON storage.objects;
      CREATE POLICY "Allow public select from room-media" 
      ON storage.objects FOR SELECT 
      TO anon, authenticated, public 
      USING (bucket_id = 'room-media');

      DROP POLICY IF EXISTS "Allow public insert to room-media" ON storage.objects;
      CREATE POLICY "Allow public insert to room-media" 
      ON storage.objects FOR INSERT 
      TO anon, authenticated, public 
      WITH CHECK (bucket_id = 'room-media');

      DROP POLICY IF EXISTS "Allow public update to room-media" ON storage.objects;
      CREATE POLICY "Allow public update to room-media" 
      ON storage.objects FOR UPDATE 
      TO anon, authenticated, public 
      USING (bucket_id = 'room-media')
      WITH CHECK (bucket_id = 'room-media');

      DROP POLICY IF EXISTS "Allow public delete from room-media" ON storage.objects;
      CREATE POLICY "Allow public delete from room-media" 
      ON storage.objects FOR DELETE 
      TO anon, authenticated, public 
      USING (bucket_id = 'room-media');
    `);
    console.log('Policies for room-media applied successfully!');

    // 3. Criar ou recriar políticas RLS para resident-documents em storage.objects
    await client.query(`
      DROP POLICY IF EXISTS "Allow public select from resident-documents" ON storage.objects;
      CREATE POLICY "Allow public select from resident-documents" 
      ON storage.objects FOR SELECT 
      TO anon, authenticated, public 
      USING (bucket_id = 'resident-documents');

      DROP POLICY IF EXISTS "Allow public insert to resident-documents" ON storage.objects;
      CREATE POLICY "Allow public insert to resident-documents" 
      ON storage.objects FOR INSERT 
      TO anon, authenticated, public 
      WITH CHECK (bucket_id = 'resident-documents');

      DROP POLICY IF EXISTS "Allow public update to resident-documents" ON storage.objects;
      CREATE POLICY "Allow public update to resident-documents" 
      ON storage.objects FOR UPDATE 
      TO anon, authenticated, public 
      USING (bucket_id = 'resident-documents')
      WITH CHECK (bucket_id = 'resident-documents');

      DROP POLICY IF EXISTS "Allow public delete from resident-documents" ON storage.objects;
      CREATE POLICY "Allow public delete from resident-documents" 
      ON storage.objects FOR DELETE 
      TO anon, authenticated, public 
      USING (bucket_id = 'resident-documents');
    `);
    console.log('Policies for resident-documents applied successfully!');

    // 4. Garantir permissões e política RLS na tabela public.room_media
    await client.query(`
      GRANT ALL ON TABLE public.room_media TO anon, authenticated, postgres, service_role;
      
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies 
          WHERE schemaname = 'public' AND tablename = 'room_media' AND policyname = 'Public Full Access room_media'
        ) THEN
          CREATE POLICY "Public Full Access room_media" 
          ON public.room_media FOR ALL 
          TO anon, authenticated, public 
          USING (true) WITH CHECK (true);
        END IF;
      END
      $$;
    `);
    console.log('Table public.room_media permissions and RLS policy applied!');

    // 5. Verificar políticas ativas em storage.objects
    const activePolicies = await client.query(`
      SELECT policyname, cmd, roles 
      FROM pg_policies 
      WHERE schemaname = 'storage' AND tablename = 'objects';
    `);
    console.log('\nActive storage.objects policies now:');
    console.dir(activePolicies.rows, { depth: null });

  } catch (err) {
    console.error('Error applying policies:', err);
  } finally {
    await client.end();
  }
}

applyPolicies();

