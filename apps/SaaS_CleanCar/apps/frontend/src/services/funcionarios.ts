import { api } from './api';

export interface Funcionario {
    id: string;
    nome: string;
    ativo: boolean;
    criado_em: string;
}

export const funcionariosService = {
    findAll: async (): Promise<Funcionario[]> => {
        const { data } = await api.get('/funcionarios');
        return data;
    },

    create: async (dto: any): Promise<Funcionario> => {
        console.log('FRONTEND ENVIANDO', dto);
        const { data } = await api.post('/funcionarios', dto);
        console.log('FRONTEND RECEBEU', data);
        return data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/funcionarios/${id}`);
    },

    getById: async (id: string): Promise<Funcionario> => {
        const { data } = await api.get(`/funcionarios/${id}`);
        return data;
    },

    update: async (id: string, dto: Partial<Funcionario>): Promise<Funcionario> => {
        const { data } = await api.patch(`/funcionarios/${id}`, dto);
        return data;
    },

    getProductivity: async (data?: string): Promise<any[]> => {
        const { data: report } = await api.get('/funcionarios/relatorios/produtividade', {
            params: { data }
        });
        return report;
    }
};
