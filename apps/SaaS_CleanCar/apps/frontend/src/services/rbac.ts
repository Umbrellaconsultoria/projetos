import { api } from './api';

export interface Permissao {
    id: string;
    chave: string;
    descricao?: string;
}

export interface Papel {
    id: string;
    nome: string;
    permissoes: { permissao: Permissao }[];
    _count?: { usuarios: number };
}

export interface CreatePapelDto {
    nome: string;
    permissoes: string[]; // Keys
}

export const rbacService = {
    getAllPermissions: async () => {
        const res = await api.get<Permissao[]>('/rbac/permissoes');
        return res.data;
    },
    getAllRoles: async () => {
        const res = await api.get<Papel[]>('/rbac/papeis');
        return res.data;
    },
    getRoleById: async (id: string) => {
        const res = await api.get<Papel>(`/rbac/papeis/${id}`);
        return res.data;
    },
    createRole: async (data: CreatePapelDto) => {
        const res = await api.post('/rbac/papeis', data);
        return res.data;
    },
    updateRole: async (id: string, data: CreatePapelDto) => {
        const res = await api.patch(`/rbac/papeis/${id}`, data);
        return res.data;
    },
    deleteRole: async (id: string) => {
        const res = await api.delete(`/rbac/papeis/${id}`);
        return res.data;
    }
};
