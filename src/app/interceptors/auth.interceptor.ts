import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  console.log('🔐 AuthInterceptor - URL:', req.url);
  console.log('🔐 AuthInterceptor - Token presente:', !!token);
  console.log('🔐 AuthInterceptor - Token valor:', token ? token.substring(0, 20) + '...' : 'Nenhum');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('🔐 AuthInterceptor - Headers após modificação:', req.headers.get('Authorization'));
  } else {
    console.warn('⚠️ AuthInterceptor - Nenhum token encontrado!');
  }

  return next(req);
};
