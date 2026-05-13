const axios = require('axios');

async function testOSDetails() {
    try {
        console.log('Logging in...');
        const loginRes = await axios.post('http://localhost:3000/auth/login', {
            email: 'admin@cleancar.com',
            senha: 'admin'
        }).catch(err => {
            console.log('Admin login failed, trying admin123...');
            return axios.post('http://localhost:3000/auth/login', {
                email: 'admin@cleancar.com',
                senha: 'admin123'
            });
        });

        const token = loginRes.data.access_token;
        console.log('Got token.');

        // Get all OS to find a valid ID
        const listRes = await axios.get('http://localhost:3000/ordens-servico', {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!listRes.data || listRes.data.length === 0) {
            console.log('No OS found in DB.');
            return;
        }

        const firstOS = listRes.data[0];
        console.log(`Fetching details for OS ${firstOS.id}...`);

        const detailRes = await axios.get(`http://localhost:3000/ordens-servico/${firstOS.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('OS Details response itens:');
        console.log(JSON.stringify(detailRes.data.itens, null, 2));

    } catch (e) {
        console.error('Error:', e.response?.data || e.message);
    }
}

testOSDetails();
