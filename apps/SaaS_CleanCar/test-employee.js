const axios = require('axios');

async function testCreate() {
    try {
        console.log('Logging in to get token...');
        const loginRes = await axios.post('http://localhost:3000/auth/login', {
            email: 'admin@cleancar.com',
            senha: 'admin'
        });
        const token = loginRes.data.access_token;
        console.log('Token acquired. Creating employee...');

        const res = await axios.post('http://localhost:3000/funcionarios', {
            nome: 'Funcionario Teste Script'
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('Success:', res.data);
    } catch (error) {
        console.error('Error Status:', error.response?.status);
        console.error('Error Data:', error.response?.data);
    }
}

testCreate();
