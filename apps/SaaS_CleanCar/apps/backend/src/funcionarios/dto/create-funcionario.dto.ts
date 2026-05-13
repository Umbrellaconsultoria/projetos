import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateFuncionarioDto {
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsBoolean()
    @IsOptional()
    ativo?: boolean;
}

export class UpdateFuncionarioDto {
    @IsString()
    @IsOptional()
    nome?: string;

    @IsBoolean()
    @IsOptional()
    ativo?: boolean;
}
