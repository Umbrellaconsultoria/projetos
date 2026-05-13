import axios from 'axios';

const API_URL = 'http://localhost:3000';

async function runValidation() {
    console.log('🚀 Starting API Validation Script...');

    try {
        // 1. Create Tenant (and Admin User + Default Unit)
        const tenantData = {
            nome_fantasia: 'Lava Jato Rápido ' + Date.now(),
            razao_social: 'Lava Jato SA',
            cnpj: '12345678000199',
            telefone: '11999999999',
            nome_usuario: 'Admin',
            email_usuario: `admin${Date.now()}@test.com`,
            senha_usuario: '123456'
        };

        console.log(`\n1. Creating Tenant... [${tenantData.nome_fantasia}]`);
        const createTenantRes = await axios.post(`${API_URL}/tenants`, tenantData);
        console.log('✅ Tenant Created:', createTenantRes.data.tenant.id);
        const { email_usuario, senha_usuario } = tenantData;

        // 2. Login
        console.log('\n2. Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: email_usuario,
            senha: senha_usuario
        });
        const token = loginRes.data.access_token;
        console.log('✅ Logged in. Token received.');

        const axiosAuth = axios.create({
            baseURL: API_URL,
            headers: { Authorization: `Bearer ${token}` }
        });

        // 3. Create Service
        console.log('\n3. Creating Service (Lavagem Simples)...');
        const createServiceRes = await axiosAuth.post('/servicos', {
            nome: 'Lavagem Simples',
            descricao: 'Lavagem externa',
            precos: [
                { porte: 'HATCH_SEDAN', valor_centavos: 3000 },
                { porte: 'MEDIO', valor_centavos: 4000 },
                { porte: 'GRANDE', valor_centavos: 5000 }
            ]
        });
        const serviceId = createServiceRes.data.id;
        console.log('✅ Service Created:', serviceId);

        // 4. Open Box (Fluxo Caixa)
        console.log('\n4. Opening Cash Register...');
        // Note: We don't send id_unidade, controller resolves to default 'Matriz'
        await axiosAuth.post('/financeiro/fluxo-caixa/abrir', {
            saldo_inicial_centavos: 10000 // R$ 100,00 troco
        });
        console.log('✅ Cash Register Opened.');

        // 5. Create OS (New Client/Vehicle)
        console.log('\n5. Creating Service Order...');
        const createOsRes = await axiosAuth.post('/ordens-servico', {
            placa: 'ABC-' + Math.floor(Math.random() * 10000),
            cliente: { nome: 'João Silva', telefone: '11988888888' },
            veiculo: { modelo: 'Fiat Uno', porte: 'HATCH_SEDAN' },
            itens: [
                { id_servico: serviceId, porte: 'HATCH_SEDAN' }
            ],
            prazo: '2023-12-31T18:00:00Z'
        });
        const os = createOsRes.data;
        console.log(`✅ OS Created: ${os.id} | Total: R$ ${os.total_centavos / 100}`);

        // 6. Generate PDF (Download check)
        console.log('\n6. Checking PDF Generation...');
        const pdfRes = await axiosAuth.get(`/ordens-servico/${os.id}/pdf`, { responseType: 'arraybuffer' });
        console.log(`✅ PDF Generated. Size: ${pdfRes.data.length} bytes.`);

        // 7. Pay OS
        console.log('\n7. Registering Payment...');
        // Need id_unidade from OS to pay
        const unidadeId = os.id_unidade;
        await axiosAuth.post('/financeiro/pagamentos', {
            id_ordem_servico: os.id,
            forma_pagamento: 'DINHEIRO',
            valor_centavos: os.total_centavos,
            id_unidade: unidadeId
        });
        console.log('✅ Payment Registered.');

        // 8. Close Box
        console.log('\n8. Closing Cash Register...');
        // Total expected = 10000 (start) + OS total
        const totalExpected = 10000 + os.total_centavos;
        await axiosAuth.post('/financeiro/fluxo-caixa/fechar', {
            total_informado_centavos: totalExpected,
            observacoes: 'Fechamento automático script'
        });
        console.log('✅ Cash Register Closed.');

        console.log('\n🎉 VALIDATION SUCCESSFUL! All steps completed.');

    } catch (error: any) {
        console.error('\n❌ VALIDATION FAILED');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
        process.exit(1);
    }
}

runValidation();
