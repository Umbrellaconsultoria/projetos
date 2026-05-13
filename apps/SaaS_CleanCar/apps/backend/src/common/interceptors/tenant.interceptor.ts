import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !user.id_tenant) {
            // For routes that are public, we might not have a user.
            // But for tenant-specific routes, this should be present.
            // The Guard should handle Auth, this Interceptor just extracts.
        }

        request.tenantId = user?.id_tenant;

        return next.handle();
    }
}
