async function testEndpoint() {
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'vramanarentals@gmail.com',
        password: 'ramana rentals'
      })
    });

    console.log('Status:', response.status);
    const text = await response.text();
    console.log('Response body:', text);
  } catch (e) {
    console.error('Error connecting to endpoint:', e.message);
  }
}

testEndpoint();
