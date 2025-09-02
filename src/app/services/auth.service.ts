import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, UserLogin, UserRegister, UserResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = '/api/Auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCurrentUser();
  }

  login(credentials: UserLogin): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.API_URL}/Login`, credentials)
      .pipe(
<<<<<<< HEAD
        tap(response => {
          localStorage.setItem('token', response.token);
          this.decodeAndSetUser(response.token);
=======
        map(response => {
          console.log('🔐 Resposta do login (JSON):', response);

          // O backend retorna { "token": "JWT" }
          const token = response.token;

          if (token && token.startsWith('eyJ')) {
            console.log('✅ Token JWT válido encontrado, armazenando...');
            localStorage.setItem('token', token);
            console.log('💾 Token armazenado no localStorage');

            // Decodificar o JWT para obter informações do usuário
            try {
              const payload = JSON.parse(atob(token.split('.')[1]));
              console.log('🔍 Payload do JWT:', payload);

              const user: User = {
                id: parseInt(payload.nameid),
                email: payload.email,
                username: payload.email.split('@')[0], // Fallback para username
                fullName: payload.email.split('@')[0], // Fallback para fullName
                birthday: new Date() // Fallback para birthday
              };

              localStorage.setItem('user', JSON.stringify(user));
              this.currentUserSubject.next(user);

              console.log('👤 Usuário logado:', user);
              console.log('🔑 Token armazenado:', this.getToken());

              // Retornar o usuário para o componente
              return { success: true, user, token };
            } catch (error) {
              console.error('❌ Erro ao decodificar JWT:', error);
              throw new Error('Token JWT inválido');
            }
          } else {
            console.error('❌ Token JWT não encontrado na resposta:', response);
            throw new Error('Token não encontrado na resposta');
          }
>>>>>>> 4a9a77a453882c4ed4190880720329e2c3983784
        })
      );
  }

  register(userData: UserRegister): Observable<any> {
    return this.http.post(`${this.API_URL}/Register`, userData);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
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

  private decodeAndSetUser(token: string): void {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('JWT Payload:', payload);

      const user: User = {
        id: payload.userId || payload.sub || payload.nameid,
        email: payload.email || payload.unique_name,
        username: payload.username || payload.preferred_username || payload.email?.split('@')[0],
        fullName: payload.fullName || payload.name || payload.given_name || payload.email?.split('@')[0],
        birthDay: new Date(payload.birthDay || payload.birthdate || Date.now())
      };

      console.log('Usuário decodificado:', user);
      this.currentUserSubject.next(user);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      this.logout();
    }
  }

  private loadCurrentUser(): void {
    const token = this.getToken();
    if (token) {
      this.decodeAndSetUser(token);
    }
  }
}
