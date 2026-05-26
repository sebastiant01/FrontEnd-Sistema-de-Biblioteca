import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuditContextService } from './audit-context.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auditService = inject(AuditContextService);
  const token = auditService.tokenUsuario();

  if (token) {
    const peticionClonada = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(peticionClonada);
  }

  return next(req);
};