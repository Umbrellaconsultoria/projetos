import { api } from './api';
import { Cliente } from '../types';

export const clientesService = {
    getAll: async () => {
        const res = await api.get<Cliente[]>('/clientes');
        return res.data;
    },
    getById: async (id: string) => {
        const res = await api.get<Cliente>(`/clientes/${id}`);
        return res.data;
    },
    create: async (data: { nome: string; telefone?: string }) => {
        const res = await api.post<Cliente>('/clientes', data);
        return res.data;
    },
    update: async (id: string, data: Partial<Cliente>) => {
        const res = await api.patch<Cliente>(`/clientes/${id}`, data);
        return res.data;
    },
    delete: async (id: string) => {
        await api.delete(`/clientes/${id}`);
    }
};
