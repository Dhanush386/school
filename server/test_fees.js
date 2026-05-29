const axios = require('axios');

async function testFees() {
  try {
    // login to get token
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      loginId: 'CASHIER001',
      password: 'password123'
    });
    const token = loginRes.data.token;

    // fetch fees
    const res = await axios.get('http://localhost:5000/api/fees?search=STU001', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Found fees:", res.data.data.length);
    console.log(JSON.stringify(res.data.data, null, 2));
  } catch (err) {
    console.error("Error:", err.response ? err.response.data : err.message);
  }
}

testFees();
