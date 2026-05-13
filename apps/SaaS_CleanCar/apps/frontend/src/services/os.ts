import { api } from './api';
import { PorteVeiculo } from '@/types';

export interface OrdemServico {
    id: string;
    numero?: number;
    status: string;
    total_centavos: number;
    data: string;
    criado_em: string;
    placa?: string; // If flattened
    cliente: { nome: string; telefone?: string };
    veiculo: { modelo: string; placa: string };
}

export interface CreateOSDto {
    placa: string; // If simplified flow, but we want ID links
    // Backend expects:
    // id_cliente, id_veiculo (if existing) OR nested objects?
    // Let's look at Backend Controller/DTO.
    // The backend CreateOSDto (from memory/previous context) accepted:
    // placa (string), cliente (object), veiculo (object), itens (array).
    // It finds/creates client/vehicle.

    // To be safe and consistent with "Expansion", let's use the explicit IDs if we have them, 
    // BUT the backend `OrdensServicoService.create` logic was "Smart":
    // "Busca ou cria cliente pelo telefone/nome"
    // "Busca ou cria veículo pela placa".

    // Let's verify backend DTO to be sure.

    cliente: {
        nome: string;
        telefone: string;
    };
    veiculo: {
        placa: string;
        modelo: string;
        porte: PorteVeiculo;
    };
    itens: {
        id_servico: string;
        porte: PorteVeiculo;
        id_funcionario?: string;
    }[];
    prazo: string;
    observacoes?: string;
}

export const osService = {
    getAll: async () => {
        const res = await api.get<OrdemServico[]>('/ordens-servico');
        return res.data;
    },
    getById: async (id: string) => {
        const res = await api.get<OrdemServico>(`/ordens-servico/${id}`);
        return res.data;
    },
    create: async (data: CreateOSDto) => {
        const res = await api.post('/ordens-servico', data);
        return res.data;
    }
};
