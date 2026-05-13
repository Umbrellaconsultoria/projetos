import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateUnidadeDto {
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsString()
    @IsOptional()
    endereco?: string;
}

export class UpdateUnidadeDto extends CreateUnidadeDto {
    @IsBoolean()
    @IsOptional()
    ativo?: boolean;
}
