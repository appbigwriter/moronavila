const { createClient } = require('@supabase/supabase-js');

const url = 'https://supabase-control-tower-api.fbr.news';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3ODk5OTA4NzYsImV4cCI6MTk0NzY3MDg3Nn0.PfG5J9CrRA-R1smzXMQBoEA-rbNNLx671XxUocNuqlg';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzg5OTkwODc2LCJleHAiOjE5NDc2NzA4NzZ9.f2enmw8Mk0hWI6WcNfkZLGOl-qaqVzQBGt8qftDaR6k';

const adminClient = createClient(url, serviceRoleKey);
const anonClient = createClient(url, anonKey);

async function test() {
  console.log('Testing Supabase with Admin and Anon keys...');

  // 1. List buckets with admin client
  const { data: buckets, error: bErr } = await adminClient.storage.listBuckets();
  console.log('\nBuckets (admin):', buckets, bErr ? 'Error: ' + bErr.message : '');

  // 2. Test upload to room-media using anon client (which is what frontend uses)
  const testBuffer = Buffer.from('test image content');
  const testPath = `test-${Date.now()}.txt`;
  console.log('\nTesting upload to room-media with anon client...');
  const { data: upData, error: upErr } = await anonClient.storage.from('room-media').upload(testPath, testBuffer, { contentType: 'text/plain' });
  console.log('Anon upload result:', upData, upErr ? 'Error: ' + upErr.message : 'SUCCESS');

  if (!upErr) {
    // cleanup
    await anonClient.storage.from('room-media').remove([testPath]);
  }

  // 3. Test insert into room_media table with anon client
  console.log('\nTesting insert into room_media with anon client...');
  // Let's get a room ID first
  const { data: rooms } = await anonClient.from('rooms').select('id').limit(1);
  const roomId = rooms?.[0]?.id || '62a5d1b4-2ac3-42d6-8c7b-765f530c0d6a';
  
  const { data: insertData, error: insertErr } = await anonClient.from('room_media').insert({
    room_id: roomId,
    url: 'https://example.com/test.jpg',
    type: 'image',
    storage_path: 'test-path'
  }).select().single();
  console.log('Anon insert result:', insertData, insertErr ? 'Error: ' + insertErr.message : 'SUCCESS');

  if (insertData?.id) {
    // cleanup
    await adminClient.from('room_media').delete().eq('id', insertData.id);
  }
}

test().catch(console.error);

