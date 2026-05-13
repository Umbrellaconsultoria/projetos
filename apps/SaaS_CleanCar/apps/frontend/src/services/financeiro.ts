import { api } from './api';

export interface CaixaStatus {
    status: 'ABERTO' | 'FECHADO';
    saldo_atual_centavos: number;
    faturamento_pix_centavos: number;
    faturamento_cartao_centavos: number;
    faturamento_outros_centavos: number;
    faturamento_total_centavos: number;
    aberto_em?: string;
}

export const financeiroService = {
    getCaixaStatus: async () => {
        const res = await api.get<CaixaStatus>('/financeiro/fluxo-caixa/hoje');
        return res.data;
    },
    abrirCaixa: async (saldo_inicial_centavos: number) => {
        const res = await api.post('/financeiro/fluxo-caixa/abrir', { saldo_inicial_centavos });
        return res.data;
    },
    fecharCaixa: async (total_informado_centavos: number) => {
        const res = await api.post('/financeiro/fluxo-caixa/fechar', { total_informado_centavos });
        return res.data;
    },
    registrarPagamento: async (data: { id_ordem_servico: string; forma_pagamento: string; valor_centavos: number; id_unidade: string }) => {
        const res = await api.post('/financeiro/pagamentos', data);
        return res.data;
    },
    getFaturamentoPeriodo: async (dataInicio: string, dataFim: string) => {
        const res = await api.get(`/financeiro/fluxo-caixa/periodo?data_inicio=${dataInicio}&data_fim=${dataFim}`);
        return res.data;
    }
};
