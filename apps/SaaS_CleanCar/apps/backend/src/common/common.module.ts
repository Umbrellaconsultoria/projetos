import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RbacGuard } from './guards/rbac.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TenantInterceptor } from './interceptors/tenant.interceptor';
import { AuditoriaService } from './auditoria.service';

@Module({
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RbacGuard,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: TenantInterceptor,
        },
        AuditoriaService,
    ],
    exports: [AuditoriaService],
})
export class CommonModule { }
