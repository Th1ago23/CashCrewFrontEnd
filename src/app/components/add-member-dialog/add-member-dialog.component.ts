import { Component, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { GroupService } from '../../services/group.service';
import { Group } from '../../models/group.model';

@Component({
  selector: 'app-add-member-dialog',
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
  templateUrl: './add-member-dialog.component.html',
  styleUrls: ['./add-member-dialog.component.scss']
})
export class AddMemberDialogComponent {
  @Input() group!: Group;
  
  memberForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private snackBar: MatSnackBar
  ) {
    this.memberForm = this.fb.group({
      userEmail: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.memberForm.valid) {
      this.isLoading = true;
      const email = this.memberForm.get('userEmail')?.value;
      
      this.groupService.addMember(this.group.id, email).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Membro adicionado com sucesso!', 'Fechar', {
            duration: 3000
          });
          this.memberAdded.emit();
        },
        error: (error) => {
          this.isLoading = false;
          let errorMessage = 'Erro ao adicionar membro.';
          
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

  onCancel(): void {
    this.closed.emit();
  }

  // Event emitters
  memberAdded = new EventEmitter<void>();
  closed = new EventEmitter<void>();
}
