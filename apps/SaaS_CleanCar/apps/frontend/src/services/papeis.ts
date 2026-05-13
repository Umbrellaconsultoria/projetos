import { api } from './api';

export interface Papel {
    id: string;
    nome: string;
}

export const papeisService = {
    getAll: async () => {
        const res = await api.get<Papel[]>('/papeis');
        return res.data;
    }
};
