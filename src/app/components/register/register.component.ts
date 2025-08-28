import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      birthday: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  validateAge(birthday: Date): boolean {
    const today = new Date();
    const birthDate = new Date(birthday);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 12;
    }

    return age >= 12;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;

      if (!this.validateAge(formValue.birthday)) {
        this.snackBar.open('Idade mínima é 12 anos', 'Fechar', {
          duration: 3000
        });
        return;
      }

      this.isLoading = true;
      this.authService.register(formValue).subscribe({
        next: () => {
          this.snackBar.open('Conta criada com sucesso! Faça login para continuar.', 'Fechar', {
            duration: 4000
          });
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isLoading = false;
          let errorMessage = 'Erro ao criar conta.';

          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }

          this.snackBar.open(errorMessage, 'Fechar', {
            duration: 4000
          });
        }
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  testButton(): void {
    console.log('Botão de teste clicado!');
    alert('Botão de teste funcionando!');
  }
}
