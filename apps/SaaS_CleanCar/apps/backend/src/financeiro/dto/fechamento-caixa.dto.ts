import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class FechamentoCaixaDto {
    @IsNumber()
    @Min(0)
    total_informado_centavos: number;

    @IsString()
    @IsOptional()
    observacoes?: string;
}
