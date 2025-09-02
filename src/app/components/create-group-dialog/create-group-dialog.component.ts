import { Component, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { GroupService } from '../../services/group.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ModalService } from '../../services/modal.service';
import { GroupSummary, GroupCreate } from '../../models/group.model';

@Component({
  selector: 'app-create-group-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCheckboxModule
  ],
  templateUrl: './create-group-dialog.component.html',
  styleUrls: ['./create-group-dialog.component.scss']
})
export class CreateGroupDialogComponent {
  groupForm: FormGroup;
  isLoading = false;
  private isClosing = false; // Flag para evitar múltiplas chamadas

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private modalService: ModalService
  ) {
    this.groupForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      isPublic: [false]
    });
  }

  onSubmit(): void {
    if (this.groupForm.valid && !this.isClosing) {
      this.isLoading = true;
      const currentUser = this.authService.getCurrentUser();

      if (!currentUser) {
        this.notificationService.error('Usuário não autenticado');
        this.isLoading = false;
        return;
      }

      const groupData: GroupCreate = {
        ...this.groupForm.value,
        leaderId: currentUser.id
      };

      console.log('Tentando criar grupo:', groupData);

      this.groupService.createGroup(groupData).subscribe({
        next: (response: any) => {
          console.log('Resposta da criação do grupo:', response);
          this.isLoading = false;

          // Criar um objeto GroupSummary com os dados retornados
          const createdGroup: GroupSummary = {
            id: response.group?.id || 1, // Placeholder ID até o backend retornar
            name: response.group?.name || response.name || groupData.name,
            isPublic: response.group?.isPublic || response.isPublic || groupData.isPublic,
            leaderId: currentUser.id,
            users: [{
              id: currentUser.id,
              name: currentUser.fullName
            }],
            expenses: []
          };

          console.log('Grupo criado, emitindo eventos...');

          // Emitir evento para o componente pai
          this.groupCreated.emit(createdGroup);
          console.log('Evento groupCreated emitido');

          // Mostrar notificação de sucesso
          this.notificationService.success('Grupo criado com sucesso!');
          console.log('Notificação mostrada');

          // Fechar o modal usando o serviço
          this.closeModal();
        },
        error: (error) => {
          console.log('Erro ao criar grupo:', error);
          console.log('Status:', error.status);
          console.log('Mensagem:', error.error);

          this.isLoading = false;
          let errorMessage = 'Erro ao criar grupo.';

          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }

          this.notificationService.error(errorMessage);
        }
      });
    }
  }

  onCancel(): void {
    if (!this.isClosing) {
      console.log('onCancel chamado');
      this.closeModal();
    }
  }

  onOverlayClick(): void {
    if (!this.isClosing) {
      console.log('onOverlayClick chamado');
      this.closeModal();
    }
  }

  private closeModal(): void {
    if (this.isClosing) return;

    this.isClosing = true;
    console.log('Fechando modal...');

    // Usar o serviço para fechar o modal
    this.modalService.closeCreateGroupDialog();

    // Também emitir o evento para compatibilidade
    this.closed.emit();
    console.log('Evento closed emitido');
  }

  // Event emitters
  groupCreated = new EventEmitter<GroupSummary>();
  closed = new EventEmitter<void>();
}
