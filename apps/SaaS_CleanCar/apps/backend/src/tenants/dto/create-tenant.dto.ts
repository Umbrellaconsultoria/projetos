import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class CreateTenantDto {
    @IsString()
    @IsNotEmpty()
    nome_fantasia: string;

    @IsString()
    @IsOptional()
    razao_social?: string;

    @IsString()
    @IsOptional()
    cnpj?: string;

    @IsString()
    @IsOptional()
    telefone?: string;

    // Initial Admin User
    @IsString()
    @IsNotEmpty()
    nome_usuario: string;

    @IsEmail()
    @IsNotEmpty()
    email_usuario: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    senha_usuario: string;
}
