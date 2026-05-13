import { IsString, IsNotEmpty, IsNumber, IsEnum, Min } from 'class-validator';
import { FormaPagamento } from '@prisma/client';

export class RegistrarPagamentoDto {
    @IsString()
    @IsNotEmpty()
    id_ordem_servico: string;

    @IsEnum(FormaPagamento)
    @IsNotEmpty()
    forma_pagamento: FormaPagamento;

    @IsNumber()
    @Min(1)
    valor_centavos: number;

    @IsString()
    @IsNotEmpty()
    id_unidade: string; // Necessário saber a unidade explicitamente ou via contexto do usuário (se vinculado a 1 unidade). 
    // No Controller, se o usuário tiver unidade padrão, podemos usar. Mas para segurança, melhor vir no body ou ser inferido se user for admin de tenant? 
    // Vamos pedir no body por enquanto, ou inferir da OS.
    // Melhor: Inferir da OS para consistência. Vou remover daqui e buscar da OS no service?
    // Sim, o pagamento deve ser na unidade da OS.
}
