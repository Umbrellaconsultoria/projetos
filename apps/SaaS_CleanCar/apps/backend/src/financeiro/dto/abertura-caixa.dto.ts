import { IsNumber, IsOptional, IsDateString, Min } from 'class-validator';

export class AberturaCaixaDto {
    @IsDateString()
    @IsOptional()
    data_referencia?: string; // Se não informado, usa hoje

    @IsNumber()
    @Min(0)
    @IsOptional()
    saldo_inicial_centavos?: number; // Opcional, geralmente começa com 0 ou fundo de troco
}
