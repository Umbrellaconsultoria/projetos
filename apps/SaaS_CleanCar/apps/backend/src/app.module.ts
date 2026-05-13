import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { TenantsModule } from './tenants/tenants.module';
import { RbacModule } from './rbac/rbac.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { FuncionariosModule } from './funcionarios/funcionarios.module';
import { ClientesModule } from './clientes/clientes.module';
import { VeiculosModule } from './veiculos/veiculos.module';
import { ServicosModule } from './servicos/servicos.module';
import { OrdensServicoModule } from './ordens-servico/ordens-servico.module';
import { FinanceiroModule } from './financeiro/financeiro.module';
import { UnidadesModule } from './unidades/unidades.module';
import { CombosModule } from './combos/combos.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SaasModule } from './saas/saas.module';
import { FaturasModule } from './faturas/faturas.module';

@Module({
  imports: [
    PrismaModule,
    CommonModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('SMTP_HOST'),
          port: configService.get('SMTP_PORT'),
          secure: configService.get('SMTP_PORT') === '465',
          auth: {
            user: configService.get('SMTP_USER'),
            pass: configService.get('SMTP_PASS'),
          },
        },
        defaults: {
          from: configService.get('EMAIL_FROM'),
        },
      }),
    }),
    AuthModule,
    TenantsModule,
    RbacModule,
    UsuariosModule,
    FuncionariosModule,
    ClientesModule,
    VeiculosModule,
    ServicosModule,
    OrdensServicoModule,
    FinanceiroModule,
    UnidadesModule,
    CombosModule,
    SaasModule,
    FaturasModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
