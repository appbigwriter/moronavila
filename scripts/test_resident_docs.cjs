const { createClient } = require('@supabase/supabase-js');

const url = 'https://supabase-control-tower-api.fbr.news';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3ODk5OTA4NzYsImV4cCI6MTk0NzY3MDg3Nn0.PfG5J9CrRA-R1smzXMQBoEA-rbNNLx671XxUocNuqlg';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzg5OTkwODc2LCJleHAiOjE5NDc2NzA4NzZ9.f2enmw8Mk0hWI6WcNfkZLGOl-qaqVzQBGt8qftDaR6k';

const adminClient = createClient(url, serviceRoleKey);
const anonClient = createClient(url, anonKey);

async function test() {
  const testBuffer = Buffer.from('test document');
  const testPath = `test-${Date.now()}.txt`;
  
  console.log('\nTesting upload to resident-documents with anon client...');
  const { data: docData, error: docErr } = await anonClient.storage.from('resident-documents').upload(testPath, testBuffer, { contentType: 'text/plain' });
  console.log('resident-documents anon upload:', docData, docErr ? 'Error: ' + docErr.message : 'SUCCESS');
  
  if (!docErr) {
    await anonClient.storage.from('resident-documents').remove([testPath]);
  }
}

test().catch(console.error);

