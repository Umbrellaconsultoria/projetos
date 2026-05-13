export enum PorteVeiculo {
    HATCH_SEDAN = 'HATCH_SEDAN',
    MEDIO = 'MEDIO',
    GRANDE = 'GRANDE',
}

export const PorteLabel = {
    [PorteVeiculo.HATCH_SEDAN]: 'Hatch / Sedan Pequeno',
    [PorteVeiculo.MEDIO]: 'Médio (SUV / Pick-up P)',
    [PorteVeiculo.GRANDE]: 'Grande (Pick-up G / Van)',
};

export interface Cliente {
    id: string;
    nome: string;
    telefone?: string;
    veiculos?: Veiculo[];
    criado_em?: string;
}

export interface Veiculo {
    id: string;
    id_cliente: string;
    placa: string;
    modelo: string;
    porte: PorteVeiculo;
    observacoes?: string;
}
