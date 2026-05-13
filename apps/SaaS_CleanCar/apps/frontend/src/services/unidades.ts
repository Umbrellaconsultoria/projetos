import { api } from './api';

export interface Unidade {
    id: string;
    nome: string;
    endereco?: string;
    ativo: boolean;
}

export interface CreateUnidadeDto {
    nome: string;
    endereco?: string;
}

export interface UpdateUnidadeDto extends Partial<CreateUnidadeDto> {
    ativo?: boolean;
}

export const unidadesService = {
    getAll: async () => {
        const res = await api.get<Unidade[]>('/unidades');
        return res.data;
    },
    getById: async (id: string) => {
        const res = await api.get<Unidade>(`/unidades/${id}`);
        return res.data;
    },
    create: async (data: CreateUnidadeDto) => {
        const res = await api.post('/unidades', data);
        return res.data;
    },
    update: async (id: string, data: UpdateUnidadeDto) => {
        const res = await api.patch(`/unidades/${id}`, data);
        return res.data;
    }
};
