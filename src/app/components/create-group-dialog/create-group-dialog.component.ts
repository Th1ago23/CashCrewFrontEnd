import { Component, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';

import { GroupService } from '../../services/group.service';
import { Group, GroupCreate } from '../../models/group.model';

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

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private snackBar: MatSnackBar
  ) {
    this.groupForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(75)]],
      isPublic: [false]
    });
  }

  onSubmit(): void {
    if (this.groupForm.valid) {
      this.isLoading = true;
      const groupData: GroupCreate = this.groupForm.value;

      console.log('Tentando criar grupo:', groupData);
      console.log('URL da API:', '/api/Group/GroupCreate');

      this.groupService.createGroup(groupData).subscribe({
        next: (response: any) => {
          console.log('Resposta completa da API:', response);
          this.isLoading = false;
          
          // Verificar se a resposta tem a estrutura esperada
          let group: Group;
          if (response && response.group) {
            group = response.group;
          } else if (response && response.id) {
            group = response;
          } else {
            console.error('Resposta da API não tem formato esperado:', response);
            this.snackBar.open('Erro: Resposta da API inválida', 'Fechar', {
              duration: 4000
            });
            return;
          }
          
          console.log('Grupo criado com sucesso:', group);
          this.snackBar.open('Grupo criado com sucesso!', 'Fechar', {
            duration: 3000
          });
          
          // Emitir evento para o componente pai
          this.groupCreated.emit(group);
          
          // Fechar o modal
          this.closed.emit();
        },
        error: (error) => {
          console.log('Erro ao criar grupo:', error);
          console.log('Status:', error.status);
          console.log('Mensagem:', error.error);

          this.isLoading = false;
          let errorMessage = 'Erro ao criar grupo.';

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
  groupCreated = new EventEmitter<Group>();
  closed = new EventEmitter<void>();
}
