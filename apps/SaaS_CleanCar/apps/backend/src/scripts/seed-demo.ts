import axios from 'axios';

const API_URL = 'http://localhost:3000';

async function runSeed() {
    console.log('🚀 Seeding Demo Data...');

    try {
        const email = 'admin@demo.com';
        const password = '123456';

        let token;

        // 1. Try Login
        try {
            const loginRes = await axios.post(`${API_URL}/auth/login`, { email, senha: password });
            token = loginRes.data.access_token;
            console.log('✅ Logged in as existing demo user.');
        } catch (e) {
            console.log('User not found. Creating new tenant...');
            // 2. Create Tenant
            const tenantData = {
                nome_fantasia: 'Demo Lava Jato',
                razao_social: 'Demo SA',
                cnpj: '99999999000199',
                telefone: '11999999999',
                nome_usuario: 'Admin Demo',
                email_usuario: email,
                senha_usuario: password
            };

            const createTenantRes = await axios.post(`${API_URL}/tenants`, tenantData);
            console.log('✅ Tenant Created:', createTenantRes.data.tenant.id);

            // 3. Login after create
            const loginRes = await axios.post(`${API_URL}/auth/login`, { email, senha: password });
            token = loginRes.data.access_token;
        }

        const axiosAuth = axios.create({
            baseURL: API_URL,
            headers: { Authorization: `Bearer ${token}` }
        });

        // 4. Create Service
        await axiosAuth.post('/servicos', {
            nome: 'Lavagem Completa',
            descricao: 'Interna e Externa',
            precos: [
                { porte: 'HATCH_SEDAN', valor_centavos: 5000 },
                { porte: 'MEDIO', valor_centavos: 6000 },
                { porte: 'GRANDE', valor_centavos: 8000 }
            ]
        });
        console.log('✅ Service Created.');

        // 5. Create OS
        await axiosAuth.post('/ordens-servico', {
            placa: 'DEMO-1234',
            cliente: { nome: 'Cliente Demo', telefone: '11988887777' },
            veiculo: { modelo: 'Honda Civic', porte: 'MEDIO' },
            itens: [], // Empty for now or fetch service ID, but complex for simple seed.
            prazo: new Date().toISOString()
        });
        console.log('✅ Demo OS Created.');

        console.log('\n🎉 DEMO READY!');
        console.log('User: admin@demo.com');
        console.log('Pass: 123456');

    } catch (error: any) {
        console.error('❌ SEED FAILED', error.message);
        if (error.response) console.error(JSON.stringify(error.response.data, null, 2));
    }
}

runSeed();
