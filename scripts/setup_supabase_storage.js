const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.supabase-vps2:Super1404@76.13.168.223:15432/postgres',
  ssl: false
});

async function run() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL successfully!');

    // 1. Adicionar colunas faltantes na tabela residents
    const alterQuery = `
      ALTER TABLE public.residents ADD COLUMN IF NOT EXISTS facebook text;
      ALTER TABLE public.residents ADD COLUMN IF NOT EXISTS document_front_url text;
      ALTER TABLE public.residents ADD COLUMN IF NOT EXISTS document_back_url text;
      ALTER TABLE public.residents ADD COLUMN IF NOT EXISTS document_urls jsonb DEFAULT '[]'::jsonb;
      ALTER TABLE public.residents ADD COLUMN IF NOT EXISTS desired_room_type text;
    `;
    await client.query(alterQuery);
    console.log('Columns added or already exist in public.residents!');

    // 2. Configurar políticas de RLS para o bucket resident-documents no storage.objects
    const storagePolicyQuery = `
      DO $$
      BEGIN
        -- Insert policy
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies 
          WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Allow public insert to resident-documents'
        ) THEN
          CREATE POLICY "Allow public insert to resident-documents" 
          ON storage.objects FOR INSERT 
          TO anon, authenticated 
          WITH CHECK (bucket_id = 'resident-documents');
        END IF;

        -- Select policy
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies 
          WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Allow public select from resident-documents'
        ) THEN
          CREATE POLICY "Allow public select from resident-documents" 
          ON storage.objects FOR SELECT 
          TO anon, authenticated, public 
          USING (bucket_id = 'resident-documents');
        END IF;

        -- Update policy
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies 
          WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Allow public update to resident-documents'
        ) THEN
          CREATE POLICY "Allow public update to resident-documents" 
          ON storage.objects FOR UPDATE 
          TO anon, authenticated 
          USING (bucket_id = 'resident-documents');
        END IF;

        -- Mesmas policies para room-media
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies 
          WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Allow public insert to room-media'
        ) THEN
          CREATE POLICY "Allow public insert to room-media" 
          ON storage.objects FOR INSERT 
          TO anon, authenticated 
          WITH CHECK (bucket_id = 'room-media');
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_policies 
          WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Allow public select from room-media'
        ) THEN
          CREATE POLICY "Allow public select from room-media" 
          ON storage.objects FOR SELECT 
          TO anon, authenticated, public 
          USING (bucket_id = 'room-media');
        END IF;
      END
      $$;
    `;
    await client.query(storagePolicyQuery);
    console.log('Storage policies configured successfully!');

    // 3. Checar colunas da tabela residents
    const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'residents' AND table_schema = 'public'
      ORDER BY ordinal_position;
    `);
    console.log('All residents columns:', res.rows.map(r => r.column_name));
  } catch (err) {
    console.error('Error running migrations:', err);
  } finally {
    await client.end();
  }
}

run();
