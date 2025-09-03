import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, UserLogin, UserRegister } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = '/api/Auth';
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private readonly http: HttpClient) {
    this.loadCurrentUser();
  }

  login(credentials: UserLogin): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.API_URL}/Login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          this.decodeAndSetUser(response.token, false); // false = não forçar logout
        })
      );
  }

  register(userData: UserRegister): Observable<any> {
    return this.http.post(`${this.API_URL}/Register`, userData);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    console.log('🚪 Logout realizado - token removido');
  }

  clearAllData(): void {
    localStorage.clear();
    this.currentUserSubject.next(null);
    console.log('🧹 Todos os dados limpos do localStorage');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    console.log('🔍 getToken() chamado, token encontrado:', !!token);
    console.log('🔍 Token valor:', token ? token.substring(0, 20) + '...' : 'Nenhum');
    return token;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private decodeAndSetUser(token: string, forceLogoutOnOldToken: boolean = true): void {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('JWT Payload:', payload);
      console.log('🔍 Campos disponíveis no payload:', Object.keys(payload));
      console.log('🔍 payload.name:', payload.name);
      console.log('🔍 payload.fullName:', payload.fullName);
      console.log('🔍 payload.email:', payload.email);

      // Se o token não tem o campo 'name', é um token antigo
      if (!payload.name && !payload.fullName) {
        if (forceLogoutOnOldToken) {
          console.warn('⚠️ Token antigo detectado (sem fullName), fazendo logout...');
          this.logout();
          return;
        } else {
          console.warn('⚠️ Token antigo detectado (sem fullName), mas não forçando logout durante login');
        }
      }

      const user: User = {
        id: parseInt(payload.userId || payload.sub || payload.nameid),
        email: payload.email || payload.unique_name,
        username: payload.username || payload.preferred_username || payload.email?.split('@')[0],
        fullName: payload.name || payload.fullName || payload.given_name || payload.email?.split('@')[0] || 'Usuário',
        birthDay: new Date(payload.birthDay || payload.birthdate || Date.now())
      };

      console.log('Usuário decodificado:', user);
      this.currentUserSubject.next(user);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      if (forceLogoutOnOldToken) {
        this.logout();
      }
    }
  }

  private loadCurrentUser(): void {
    const token = this.getToken();
    if (token) {
      console.log('🔄 Carregando usuário do token existente...');
      this.decodeAndSetUser(token, true); // true = forçar logout se token antigo
    }
  }
}
