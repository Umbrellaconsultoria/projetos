import axios from 'axios';
import { randomUUID } from 'crypto';

const API_URL = 'http://localhost:3000';

// Helpers
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function runIntegrationTests() {
    console.log('🧪 INICIANDO TESTES DE INTEGRAÇÃO (Backend)...');

    // Identificador único para este teste
    const testId = randomUUID().substring(0, 8);
    const email = `test-${testId}@cleancar.com`;
    const password = 'password123';

    let token = '';
    let tenantId = '';
    let unidadeId = '';
    let servicoId = '';
    let osId = '';

    try {
        // 1. Setup Environment (Tenant & User)
        console.log(`\n1. [SETUP] Criando Tenant de Teste (${email})...`);
        const tenantRes = await axios.post(`${API_URL}/tenants`, {
            nome_fantasia: `Tenant Test ${testId}`,
            razao_social: `Testes Ltda ${testId}`,
            cnpj: '00000000000191',
            telefone: '11999999999',
            nome_usuario: 'Tester Admin',
            email_usuario: email,
            senha_usuario: password
        });
        tenantId = tenantRes.data.tenant.id;

        // Login
        const loginRes = await axios.post(`${API_URL}/auth/login`, { email, senha: password });
        token = loginRes.data.access_token;
        const api = axios.create({
            baseURL: API_URL,
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('   ✅ Tenant e Login OK');

        // 2. Setup Master Data (Services)
        console.log('\n2. [DADOS MESTRES] Criando Serviço...');
        const servicoRes = await api.post('/servicos', {
            nome: 'Lavagem Teste',
            descricao: 'Serviço de Teste Integrado',
            precos: [{ porte: 'MEDIO', valor_centavos: 5000 }]
        });
        servicoId = servicoRes.data.id;
        console.log('   ✅ Serviço Criado OK');

        // 3. Financeiro - Abertura de Caixa
        console.log('\n3. [FINANCEIRO] Abrindo Caixa...');
        // Obter unidade padrão (assumindo que o tenant criado já tem uma unidade matriz)
        // Como o endpoint de abertura resolve a unidade automaticamente, não precisamos passar ID se o usuário tiver acesso.
        const caixaRes = await api.post('/financeiro/caixa/abrir', {
            saldo_inicial_centavos: 10000 // R$ 100,00
        });
        console.log('   ✅ Caixa Aberto OK (Saldo Inicial: R$ 100,00)');

        // 4. Operacional - Ciclo de Vida da OS
        console.log('\n4. [OPERACIONAL] Fluxo da Ordem de Serviço...');

        // 4.1 Criar OS
        const osRes = await api.post('/ordens-servico', {
            placa: 'TEST-9999',
            cliente: { nome: 'Cliente Teste', telefone: '11999999999' },
            veiculo: { modelo: 'Carro Teste', porte: 'MEDIO' },
            itens: [{ id_servico: servicoId }],
            prazo: new Date().toISOString()
        });
        osId = osRes.data.id;
        console.log(`   ✅ OS Criada: #${osRes.data.numero}`);

        // 4.2 Iniciar Execução
        await api.patch(`/ordens-servico/${osId}/status`, { status: 'EM_EXECUCAO' });
        console.log('   ✅ Status -> EM EXECUÇÃO');

        // 4.3 Finalizar Execução
        await api.patch(`/ordens-servico/${osId}/status`, { status: 'FINALIZADA' });
        console.log('   ✅ Status -> FINALIZADA');

        // 5. Financeiro - Recebimento
        console.log('\n5. [FINANCEIRO] Recebimento...');
        const pgtoRes = await api.post('/financeiro/pagamentos', {
            id_os: osId,
            metodo: 'DINHEIRO',
            valor_centavos: 5000 // Valor do serviço criado
        });
        console.log('   ✅ Pagamento Registrado OK');

        // Verificar status da OS (deve ser PAGA se a lógica fosse automática, mas é manual por enquanto, verificamos o saldo)
        // Verificar Saldo do Caixa
        const saldoRes = await api.get('/financeiro/caixa/status');
        const saldoAtual = saldoRes.data.saldo_atual_centavos;

        if (saldoAtual !== 15000) { // 10000 (Inicial) + 5000 (Venda)
            throw new Error(`Saldo incorreto! Esperado: 15000, Atual: ${saldoAtual}`);
        }
        console.log('   ✅ Saldo Verificado: R$ 150,00 (Correto)');

        // 6. Fechamento de Caixa
        console.log('\n6. [FINANCEIRO] Fechando Caixa...');
        const fechamentoRes = await api.post('/financeiro/caixa/fechar', {
            saldo_final_informado_centavos: 15000
        });

        if (fechamentoRes.data.diferenca_centavos !== 0) {
            throw new Error(`Diferença de caixa detectada! ${fechamentoRes.data.diferenca_centavos}`);
        }
        console.log('   ✅ Caixa Fechado sem diferenças.');

        console.log('\n🎉 SUCESSO! Todos os testes de integração passaram.');

    } catch (error: any) {
        console.error('\n❌FALHA NO TESTE:');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
        process.exit(1);
    }
}

runIntegrationTests();
