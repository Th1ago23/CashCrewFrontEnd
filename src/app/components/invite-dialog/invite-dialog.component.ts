import { Component, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { InvitationService } from '../../services/invitation.service';
import { NotificationService } from '../../services/notification.service';
import { ModalService } from '../../services/modal.service';
import { GroupSummary } from '../../models/group.model';

@Component({
  selector: 'app-invite-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTooltipModule
  ],
  templateUrl: './invite-dialog.component.html',
  styleUrls: ['./invite-dialog.component.scss']
})
export class InviteDialogComponent {
  @Input() group: GroupSummary | null = null;

  inviteForm: FormGroup;
  isLoading = false;
  generatedToken: string | null = null;
  inviteUrl: string | null = null;

  expirationOptions = [
    { value: '1h', label: '1 Hora' },
    { value: '24h', label: '24 Horas' },
    { value: '7d', label: '7 Dias' },
    { value: '30d', label: '30 Dias' }
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly invitationService: InvitationService,
    private readonly notificationService: NotificationService,
    private readonly modalService: ModalService
  ) {
    this.inviteForm = this.fb.group({
      expirationTime: ['24h', Validators.required]
    });
  }

  generateInvite(): void {
    console.log('🔗 Gerando convite...', {
      formValid: this.inviteForm.valid,
      group: this.group,
      expirationTime: this.inviteForm.get('expirationTime')?.value
    });

    if (this.inviteForm.valid && this.group) {
      this.isLoading = true;
      const expirationTime = this.inviteForm.get('expirationTime')?.value;

      console.log('📡 Enviando requisição para criar convite...', {
        groupId: this.group.id,
        expirationTime
      });

      this.invitationService.createInvite(this.group.id, expirationTime).subscribe({
        next: (response) => {
          console.log('✅ Resposta do servidor:', response);
          // O token está em response.token.result
          this.generatedToken = response.token.result;
          this.inviteUrl = `${window.location.origin}/join/${response.token.result}`;
          this.isLoading = false;
          console.log('🔗 Token gerado:', this.generatedToken);
          console.log('🌐 URL do convite:', this.inviteUrl);
          this.notificationService.success('Convite gerado com sucesso!');
        },
        error: (error) => {
          this.isLoading = false;
          console.error('❌ Erro ao gerar convite:', error);
          this.notificationService.error('Erro ao gerar convite');
        }
      });
    } else {
      console.warn('⚠️ Formulário inválido ou grupo não selecionado');
    }
  }

  copyToClipboard(): void {
    if (this.inviteUrl) {
      navigator.clipboard.writeText(this.inviteUrl).then(() => {
        this.notificationService.success('Link copiado para a área de transferência!');
      }).catch(() => {
        this.notificationService.error('Erro ao copiar link');
      });
    }
  }

  close(): void {
    this.modalService.closeInviteDialog();
    this.closed.emit();
  }

  // Event emitters
  closed = new EventEmitter<void>();
}
