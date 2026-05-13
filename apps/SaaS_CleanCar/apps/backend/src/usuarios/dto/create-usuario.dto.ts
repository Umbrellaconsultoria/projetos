import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsArray } from 'class-validator';

export class CreateUsuarioDto {
    @IsNotEmpty()
    @IsString()
    nome: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    senha: string;

    @IsOptional()
    @IsString()
    telefone?: string;

    @IsOptional()
    @IsArray()
    papeisIds?: string[]; // List of Role IDs to assign
}
