import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  success(message: string, action: string = 'Fechar'): void {
    const config: MatSnackBarConfig = {
      duration: 4000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    };

    this.snackBar.open(message, action, config);
  }

  error(message: string, action: string = 'Fechar'): void {
    const config: MatSnackBarConfig = {
      duration: 5000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    };

    this.snackBar.open(message, action, config);
  }

  info(message: string, action: string = 'Fechar'): void {
    const config: MatSnackBarConfig = {
      duration: 3000,
      panelClass: ['info-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    };

    this.snackBar.open(message, action, config);
  }

  warning(message: string, action: string = 'Fechar'): void {
    const config: MatSnackBarConfig = {
      duration: 4000,
      panelClass: ['warning-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    };

    this.snackBar.open(message, action, config);
  }
}

