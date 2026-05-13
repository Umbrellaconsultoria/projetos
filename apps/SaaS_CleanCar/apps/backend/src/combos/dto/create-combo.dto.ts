import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, ValidateNested, IsBoolean, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PorteVeiculo } from '@prisma/client';

export class CreateComboPrecoDto {
    @IsEnum(PorteVeiculo)
    porte: PorteVeiculo;

    @IsNumber()
    @Min(0)
    valor_centavos: number;
}

export class CreateComboDto {
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsNumber()
    @IsOptional()
    percentual_marketing?: number;

    @IsArray()
    @IsString({ each: true })
    itens_ids: string[]; // List of Service IDs

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateComboPrecoDto)
    precos: CreateComboPrecoDto[];
}

export class UpdateComboDto extends CreateComboDto {
    @IsBoolean()
    @IsOptional()
    ativo?: boolean;
}
