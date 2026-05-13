import { api } from './api';
import { PorteVeiculo } from '@/types';
import { Servico } from './servicos';

export interface ComboPreco {
    id?: string;
    porte: PorteVeiculo;
    valor_centavos: number;
}

export interface ComboItem {
    id?: string;
    id_servico: string;
    servico?: Servico;
}

export interface Combo {
    id: string;
    nome: string;
    percentual_marketing?: number;
    ativo: boolean;
    precos: ComboPreco[];
    itens: ComboItem[];
}

export interface CreateComboDto {
    nome: string;
    percentual_marketing?: number;
    itens_ids: string[];
    precos: {
        porte: PorteVeiculo;
        valor_centavos: number;
    }[];
}

export interface UpdateComboDto extends Partial<CreateComboDto> {
    ativo?: boolean;
}

export const combosService = {
    getAll: async () => {
        const res = await api.get<Combo[]>('/combos');
        return res.data;
    },
    getById: async (id: string) => {
        const res = await api.get<Combo>(`/combos/${id}`);
        return res.data;
    },
    create: async (data: CreateComboDto) => {
        const res = await api.post('/combos', data);
        return res.data;
    },
    update: async (id: string, data: UpdateComboDto) => {
        const res = await api.patch(`/combos/${id}`, data);
        return res.data;
    }
};
