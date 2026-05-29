const axios = require('axios');

async function trigger() {
  let success = false;
  while (!success) {
    try {
      console.log('Hitting URL...');
      const res = await axios.get('https://school-five-xi.vercel.app/api/fix-stu1001');
      console.log(res.data);
      if (res.data && res.data.success) {
        success = true;
        console.log('Successfully reset password on LIVE database!');
      } else {
        await new Promise(r => setTimeout(r, 5000));
      }
    } catch (err) {
      console.log('Error hitting URL:', err.response ? err.response.data : err.message);
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}

trigger();
