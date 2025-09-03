import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { InvitationService } from '../../services/invitation.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-join-group',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './join-group.component.html',
  styleUrls: ['./join-group.component.scss']
})
export class JoinGroupComponent implements OnInit {
  token: string | null = null;
  isLoading = false;
  isJoining = false;
  isAuthenticated = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private invitationService: InvitationService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
    this.isAuthenticated = this.authService.isAuthenticated();

    if (!this.token) {
      this.notificationService.error('Token de convite inválido');
      this.router.navigate(['/dashboard']);
      return;
    }

    if (!this.isAuthenticated) {
      this.notificationService.warning('Você precisa estar logado para entrar no grupo');
      this.router.navigate(['/login']);
      return;
    }
  }

  joinGroup(): void {
    if (!this.token) return;

    this.isJoining = true;
    this.invitationService.joinGroup(this.token).subscribe({
      next: (response) => {
        this.isJoining = false;
        this.notificationService.success('Você entrou no grupo com sucesso!');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isJoining = false;
        let errorMessage = 'Erro ao entrar no grupo';

        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        this.notificationService.error(errorMessage);
        console.error('Erro ao entrar no grupo:', error);
      }
    });
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
