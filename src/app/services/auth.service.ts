import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { User, UserLogin, UserRegister, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = '/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (error) {
        this.clearStoredData();
      }
    }
  }

                  login(credentials: UserLogin): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/Auth/Login`, credentials)
      .pipe(
        map(response => {
          console.log('Resposta do login (JSON):', response);

          // O backend retorna { "token": "JWT" }
          const token = response.token;

          if (token && token.startsWith('eyJ')) {
            localStorage.setItem('token', token);

            // Decodificar o JWT para obter informações do usuário
            try {
              const payload = JSON.parse(atob(token.split('.')[1]));
              console.log('Payload do JWT:', payload);

              const user: User = {
                id: parseInt(payload.nameid),
                email: payload.email,
                username: payload.email.split('@')[0], // Fallback para username
                fullName: payload.email.split('@')[0], // Fallback para fullName
                birthday: new Date() // Fallback para birthday
              };

              localStorage.setItem('user', JSON.stringify(user));
              this.currentUserSubject.next(user);

              console.log('Usuário logado:', user);

              // Retornar o usuário para o componente
              return { success: true, user, token };
            } catch (error) {
              console.error('Erro ao decodificar JWT:', error);
              throw new Error('Token JWT inválido');
            }
          } else {
            console.error('Token JWT não encontrado na resposta:', response);
            throw new Error('Token não encontrado na resposta');
          }
        })
      );
  }

  register(userData: UserRegister): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/Auth/Register`, userData);
  }

  logout(): void {
    this.clearStoredData();
    this.currentUserSubject.next(null);
  }

  private clearStoredData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
