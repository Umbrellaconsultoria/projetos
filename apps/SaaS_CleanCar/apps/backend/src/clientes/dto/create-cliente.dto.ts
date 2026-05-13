import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateClienteDto {
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsString()
    @IsOptional()
    telefone?: string;
}
