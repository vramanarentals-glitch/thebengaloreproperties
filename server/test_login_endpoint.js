import dotenv from 'dotenv';
dotenv.config();

async function testEndpoint() {
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD || 'test_password';
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    console.log('Status:', response.status);
    const text = await response.text();
    console.log('Response body:', text);
  } catch (e) {
    console.error('Error connecting to endpoint:', e.message);
  }
}

testEndpoint();
