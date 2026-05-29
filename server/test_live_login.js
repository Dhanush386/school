const axios = require('axios');

async function testLive() {
  try {
    const res = await axios.post('https://school-five-xi.vercel.app/api/auth/login', {
      loginId: 'STU1001',
      password: 'Dhanush@2006'
    });
    console.log("Success:", res.data);
  } catch (err) {
    console.error("Error:", err.response ? err.response.data : err.message);
  }
}

testLive();
