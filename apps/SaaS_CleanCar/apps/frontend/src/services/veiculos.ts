import { api } from './api';
import { Veiculo, PorteVeiculo } from '../types';

export const veiculosService = {
    getAll: async () => {
        const res = await api.get<Veiculo[]>('/veiculos');
        return res.data;
    },
    getById: async (id: string) => {
        const res = await api.get<Veiculo>(`/veiculos/${id}`);
        return res.data;
    },
    create: async (data: { id_cliente: string; placa: string; modelo: string; porte: PorteVeiculo; observacoes?: string }) => {
        const res = await api.post<Veiculo>('/veiculos', data);
        return res.data;
    },
    update: async (id: string, data: Partial<Veiculo>) => {
        const res = await api.patch<Veiculo>(`/veiculos/${id}`, data);
        return res.data;
    },
    delete: async (id: string) => {
        await api.delete(`/veiculos/${id}`);
    }
};
