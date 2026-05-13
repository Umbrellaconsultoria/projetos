import { IsString, IsNotEmpty, IsOptional, ValidateNested, IsDateString, IsEnum, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { PorteVeiculo } from '@prisma/client';

class CreateClienteOsDto {
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsString()
    @IsOptional()
    telefone?: string;
}

class CreateVeiculoOsDto {
    @IsString()
    @IsNotEmpty()
    modelo: string;

    @IsEnum(PorteVeiculo)
    @IsNotEmpty()
    porte: PorteVeiculo;
}

class ItemServicoDto {
    @IsString()
    @IsNotEmpty()
    id_servico: string;

    @IsEnum(PorteVeiculo)
    @IsNotEmpty()
    porte: PorteVeiculo;

    @IsString()
    @IsOptional()
    id_funcionario?: string;
}

export class CreateOrdemServicoDto {
    @IsString()
    @IsNotEmpty()
    placa: string;

    @ValidateNested()
    @Type(() => CreateClienteOsDto)
    @IsOptional()
    cliente?: CreateClienteOsDto; // Optional if existing vehicle/client found by plate

    @ValidateNested()
    @Type(() => CreateVeiculoOsDto)
    @ValidateIf((o) => !o.cliente && !o.veiculo_existente) // Logic handled in service, validation tricky to mix.
    @IsOptional()
    veiculo?: CreateVeiculoOsDto;

    @IsDateString()
    @IsOptional()
    data?: string;

    @IsString()
    @IsOptional()
    hora_chegada?: string;

    @IsString()
    @IsOptional()
    prazo?: string;

    @IsString()
    @IsOptional()
    observacoes?: string;

    @IsOptional()
    pertence_valor?: boolean;

    @IsString()
    @IsOptional()
    descricao_pertences?: string;

    @ValidateNested({ each: true })
    @Type(() => ItemServicoDto)
    @IsOptional()
    itens?: ItemServicoDto[];

    // Combo ID optional
    @IsString()
    @IsOptional()
    id_combo?: string;
}
