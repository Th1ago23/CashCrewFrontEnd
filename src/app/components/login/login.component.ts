import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth.service';

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
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
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
          this.router.navigate(['/dashboard']);
          this.snackBar.open('Login realizado com sucesso!', 'Fechar', {
            duration: 3000
          });
        },
                error: (error) => {
          console.log('Erro no login:', error);
          console.log('Status:', error.status);
          console.log('Mensagem:', error.error);

          this.isLoading = false;
          let errorMessage = 'Erro no login. Verifique suas credenciais.';

          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }

          this.snackBar.open(errorMessage, 'Fechar', {
            duration: 4000
          });
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

  testButton(): void {
    console.log('Botão de teste clicado!');
    alert('Botão de teste funcionando!');
  }
}
