import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly notificationService: NotificationService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      console.log('Tentando fazer login com:', { email: credentials.email, password: credentials.password });

      this.isLoading = true;
      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('Login bem-sucedido:', response);
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
          this.notificationService.success('Login realizado com sucesso! 🎉');
        },
        error: (error) => {
          console.log('Erro no login:', error);
          console.log('Status:', error.status);
          console.log('Mensagem:', error.error);

          this.isLoading = false;
          let errorMessage = 'Erro no login. Verifique suas credenciais.';

          if (error.error?.message) {
            errorMessage = error.error.message;
          }

          this.notificationService.error(errorMessage);
        },
        complete: () => {
          console.log('Login completado com sucesso');
        }
      });
    }
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
