import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';
import { AUDIT_KEY, AuditMetadata } from './audit.decorator';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const metadata = this.reflector.get<AuditMetadata | undefined>(
      AUDIT_KEY,
      context.getHandler(),
    );
    if (!metadata) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap((responseBody) => {
        const entityId =
          this.parseId(request.params?.id ?? request.params?.parentId) ??
          this.parseId(responseBody?.id);

        void this.prisma.auditLog
          .create({
            data: {
              user_id: request.user?.id ?? null,
              action: metadata.action,
              entity: metadata.entity,
              entity_id: entityId,
            },
          })
          .catch(() => {
            // Audit log không được làm gián đoạn luồng nghiệp vụ chính
          });
      }),
    );
  }

  private parseId(value: unknown): number | null {
    const parsed = Number(value);
    return Number.isInteger(parsed) ? parsed : null;
  }
}
