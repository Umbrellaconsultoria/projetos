import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, Min, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { PorteVeiculo } from '@prisma/client';

export class CreateServicoPrecoDto {
    @IsEnum(PorteVeiculo)
    porte: PorteVeiculo;

    @IsNumber()
    @Min(0)
    valor_centavos: number;
}

export class CreateServicoDto {
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsString()
    @IsOptional()
    descricao?: string;

    @IsNumber()
    @IsOptional()
    @Min(0)
    pontos?: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateServicoPrecoDto)
    precos: CreateServicoPrecoDto[];
}
