import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { FirstLoginChangePasswordDto } from './dto/first-login-change-password.dto';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class AuthService {
    constructor(
        private usuariosService: UsuariosService,
        private jwtService: JwtService,
        private mailerService: MailerService,
    ) { }


    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usuariosService.findByEmail(email);
        if (user && (await bcrypt.compare(pass, user.senha_hash))) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { senha_hash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.senha);
        if (!user) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        if (user.precisa_alterar_senha) {
            throw new UnauthorizedException({
                statusCode: 403,
                message: 'É necessário alterar a senha no primeiro acesso.',
                code: 'REQUIRE_PASSWORD_CHANGE'
            });
        }

        // Flatten permissions
        const permissions = user.papeis.flatMap(up =>
            up.papel.permissoes.map(pp => pp.permissao.chave)
        );

        const payload = {
            sub: user.id,
            email: user.email,
            id_tenant: user.id_tenant,
            is_saas_provider: user.tenant?.is_saas_provider || false,
            logo_url: user.tenant?.logo_url || null,
            papeis: user.papeis.map(up => up.papel.nome),
            permissoes: [...new Set(permissions)] // Unique permissions
        };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async forgotPassword(dto: ForgotPasswordDto) {
        const user = await this.usuariosService.findByEmail(dto.email);
        if (!user) {
            // Retorna sucesso para evitar "user enumeration"
            return { message: 'Se o e-mail existir em nossa base, as instruções foram enviadas.' };
        }

        const novaSenhaTemporaria = Math.floor(10000000 + Math.random() * 90000000).toString(); // 8 dígitos

        // Vamos atualizar usando um bypass já que usuariosService.update requer id_tenant e o auth flow pode não tê-lo diretamente ainda, mas podemos pegar do user:
        await this.usuariosService.update(user.id_tenant, user.id, {
            senha: novaSenhaTemporaria,
            precisa_alterar_senha: true
        });

        await this.mailerService.sendMail({
            to: user.email,
            subject: 'SaaS CleanCar - Recuperação de Senha',
            html: `
            <h3>Olá, ${user.nome}!</h3>
            <p>Foi solicitada uma recuperação de senha para sua conta.</p>
            <p>Sua nova senha temporária é: <strong>${novaSenhaTemporaria}</strong></p>
            <p>Por favor, utilize esta senha para o próximo login. O sistema exigirá que você cadastre uma senha definitiva de sua preferência.</p>
            <br />
            <p>Se você não solicitou isso, ignore este e-mail.</p>
            <br />
            <br />
            <p>Atenciosamente, Equipe SaaS CleanCar</p>
            <p>https://www.instagram.com/umbrellaexpert/</p>
            `,
        });

        return { message: 'Se o e-mail existir em nossa base, as instruções foram enviadas.' };
    }

    async firstLoginChangePassword(dto: FirstLoginChangePasswordDto) {
        const user = await this.validateUser(dto.email, dto.senhaTemporaria);
        if (!user) {
            throw new UnauthorizedException('Senha temporária ou e-mail inválidos.');
        }

        await this.usuariosService.update(user.id_tenant, user.id, {
            senha: dto.novaSenha,
            precisa_alterar_senha: false
        });

        // Efetua login automático após a troca
        return this.login({ email: dto.email, senha: dto.novaSenha });
    }
}
