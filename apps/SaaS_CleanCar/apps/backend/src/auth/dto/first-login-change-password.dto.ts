import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class FirstLoginChangePasswordDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    senhaTemporaria: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    novaSenha: string;
}
