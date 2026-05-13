import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissoes.decorator';

@Injectable()
export class RbacGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredPermissions) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !user.permissoes) {
            throw new ForbiddenException('Acesso negado: Usuário sem permissões configuradas');
        }

        const hasPermission = requiredPermissions.some((permission) =>
            user.permissoes.includes(permission),
        );

        if (!hasPermission) {
            throw new ForbiddenException('Acesso negado: Você não tem permissão para esta ação');
        }

        return true;
    }
}
