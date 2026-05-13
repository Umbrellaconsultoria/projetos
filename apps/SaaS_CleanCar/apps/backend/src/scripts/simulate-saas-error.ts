const axios = require('axios');

async function main() {
    try {
        console.log("Fazendo login...");
        const loginRes = await axios.post('http://localhost:3333/auth/login', {
            email: 'admin1771464712694@test.com',
            senha: '123456'
        });

        const token = loginRes.data.access_token;
        console.log("Token obtido com sucesso!");
        const payloadBase64 = token.split('.')[1];
        const payloadJson = Buffer.from(payloadBase64, 'base64').toString();
        console.log("Payload do token:", payloadJson);

        console.log("Buscando tenants...");
        const res = await axios.get('http://localhost:3333/saas/tenants', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Tenants:", res.data.length);

        console.log("Buscando faturas...");
        const res2 = await axios.get('http://localhost:3333/saas/faturas', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Faturas:", res2.data.length);

    } catch (err: any) {
        if (!err.response && err.cause) {
            console.error("ERRO CONEXAO:", err.cause);
        } else {
            console.error("ERRO:", err.response?.status, err.response?.data);
        }
    }
}

main();
