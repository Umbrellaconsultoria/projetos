import { api } from './api';

export interface CreateTenantDto {
    nome_fantasia: string;
    razao_social?: string;
    cnpj?: string;
    telefone?: string;
    nome_usuario: string;
    email_usuario: string;
    senha_usuario: string;
}

export const tenantsService = {
    create: async (data: CreateTenantDto) => {
        const res = await api.post('/tenants', data);
        return res.data;
    }
};
