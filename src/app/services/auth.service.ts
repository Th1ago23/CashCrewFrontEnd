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
        tap(response => {
          localStorage.setItem('token', response.token);
          this.decodeAndSetUser(response.token);
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
