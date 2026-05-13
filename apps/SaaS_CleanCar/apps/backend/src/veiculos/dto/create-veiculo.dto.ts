import { IsString, IsNotEmpty, IsOptional, IsEnum, Matches } from 'class-validator';
import { PorteVeiculo } from '@prisma/client';

export class CreateVeiculoDto {
    @IsString()
    @IsNotEmpty()
    id_cliente: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^[A-Z]{3}[0-9][0-9A-Z][0-9]{2}$/, { message: 'Placa inválida (Mercosul ou Antiga)' })
    placa: string; // Simplified regex, can be improved

    @IsString()
    @IsNotEmpty()
    modelo: string;

    @IsEnum(PorteVeiculo)
    @IsNotEmpty()
    porte: PorteVeiculo;

    @IsString()
    @IsOptional()
    observacoes?: string;
}
