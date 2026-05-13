import { api } from './api';

export interface Usuario {
    id: string;
    nome: string;
    email: string;
    papeis: { papel: { id: string; nome: string } }[];
}

export interface CreateUsuarioDto {
    nome: string;
    email: string;
    senha: string;
    telefone?: string;
    papeisIds?: string[];
}

export const usuariosService = {
    getAll: async () => {
        const res = await api.get<Usuario[]>('/usuarios');
        return res.data;
    },
    create: async (data: CreateUsuarioDto) => {
        const res = await api.post('/usuarios', data);
        return res.data;
    },
    getById: async (id: string) => {
        const res = await api.get<Usuario>(`/usuarios/${id}`);
        return res.data;
    },
    update: async (id: string, data: Partial<CreateUsuarioDto>) => {
        const res = await api.patch(`/usuarios/${id}`, data);
        return res.data;
    }
};
