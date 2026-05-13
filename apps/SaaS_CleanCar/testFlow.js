// script to run directly on node to test the whole flow: login -> get token -> create employee
const axios = require('axios');

async function testWholeFlow() {
    try {
        console.log('1. Trying to login with admin@cleancar.com / admin');
        const loginResponse = await axios.post('http://localhost:3000/auth/login', {
            email: 'admin@cleancar.com',
            senha: 'admin'
        });

        console.log('Login success! Got Token.');
        const token = loginResponse.data.access_token;

        console.log('2. Trying to create employee...');
        const createResponse = await axios.post('http://localhost:3000/funcionarios', {
            nome: 'Test Employee from Node'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Employee Created successfully:', createResponse.data);
    } catch (err) {
        console.error('Flow failed.');
        if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Data:', err.response.data);
        } else {
            console.error(err.message);
        }
    }
}

testWholeFlow();
