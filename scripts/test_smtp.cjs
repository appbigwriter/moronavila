const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mail.facebrasil.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: (process.env.SMTP_SECURE || 'true').toLowerCase() === 'true', // true for 465
  auth: {
    user: process.env.SMTP_USER || 'appsextou@facebrasil.com',
    pass: process.env.SMTP_PASS || 'liberdade2026'
  },
  tls: {
    rejectUnauthorized: false // avoid self-signed or domain mismatch issues
  }
});

async function testSMTP() {
  console.log('Verifying SMTP transporter...');
  try {
    await transporter.verify();
    console.log('✅ SMTP Server is ready to take our messages!');
  } catch (err) {
    console.error('❌ SMTP verification failed:', err);
  }
}

testSMTP();
