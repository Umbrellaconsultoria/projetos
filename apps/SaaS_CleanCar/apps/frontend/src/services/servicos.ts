import { api } from './api';
import { PorteVeiculo } from '@/types';

export interface ServicoPreco {
    id?: string;
    porte: PorteVeiculo;
    valor_centavos: number;
}

export interface Servico {
    id: string;
    nome: string;
    descricao?: string;
    ativo: boolean;
    pontos: number;
    precos: ServicoPreco[];
}

export interface CreateServicoDto {
    nome: string;
    descricao?: string;
    pontos?: number;
    precos: {
        porte: PorteVeiculo;
        valor_centavos: number;
    }[];
}

export interface UpdateServicoDto extends Partial<CreateServicoDto> { }

export const servicosService = {
    getAll: async () => {
        const res = await api.get<Servico[]>('/servicos');
        return res.data;
    },
    getById: async (id: string) => {
        const res = await api.get<Servico>(`/servicos/${id}`);
        return res.data;
    },
    create: async (data: CreateServicoDto) => {
        const res = await api.post('/servicos', data);
        return res.data;
    },
    update: async (id: string, data: UpdateServicoDto) => {
        const res = await api.patch(`/servicos/${id}`, data);
        return res.data;
    },
    delete: async (id: string) => {
        const res = await api.delete(`/servicos/${id}`);
        return res.data;
    }
};
