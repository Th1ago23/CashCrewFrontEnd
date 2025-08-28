import { HttpInterceptorFn } from '@angular/common/http';

export const LoginResponseInterceptor: HttpInterceptorFn = (req, next) => {
  // Não precisamos mais interceptar, o backend retorna JSON válido
  return next(req);
};
