import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreatePapelDto {
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsArray()
    @IsString({ each: true })
    permissoes: string[]; // List of Permission Keys
}

export class UpdatePapelDto extends CreatePapelDto { }
