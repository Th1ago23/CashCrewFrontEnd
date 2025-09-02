import { Component, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { GroupService } from '../../services/group.service';
import { NotificationService } from '../../services/notification.service';
import { ModalService } from '../../services/modal.service';
import { GroupSummary } from '../../models/group.model';

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
  @Input() group!: GroupSummary;

  memberForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private notificationService: NotificationService,
    private modalService: ModalService
  ) {
    this.memberForm = this.fb.group({
      userEmail: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.memberForm.valid) {
      this.isLoading = true;
      const email = this.memberForm.get('userEmail')?.value;

      // Como não temos ID, vamos usar o nome do grupo
      // Por enquanto, vamos mostrar uma mensagem informativa
      this.isLoading = false;
      this.notificationService.info('Funcionalidade de adicionar membro será implementada em breve');

      // Emitir evento para o componente pai
      this.memberAdded.emit();

      // Fechar o modal usando o ModalService
      this.closeModal();
    }
  }

  onCancel(): void {
    this.closeModal();
  }

  private closeModal(): void {
    this.modalService.closeAddMemberDialog();
  }

  // Event emitters
  memberAdded = new EventEmitter<void>();
  closed = new EventEmitter<void>();
}
