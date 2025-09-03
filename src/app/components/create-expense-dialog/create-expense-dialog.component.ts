import { Component, Input, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

import { ExpenseService } from '../../services/expense.service';
import { NotificationService } from '../../services/notification.service';
import { ModalService } from '../../services/modal.service';
import { GroupSummary } from '../../models/group.model';
import { User } from '../../models/user.model';
import { ExpenseCreate } from '../../models/expense.model';

@Component({
  selector: 'app-create-expense-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule
  ],
  templateUrl: './create-expense-dialog.component.html',
  styleUrls: ['./create-expense-dialog.component.scss']
})
export class CreateExpenseDialogComponent implements OnInit {
  @Input() group!: GroupSummary;
  @Input() currentUser!: User;

  expenseForm: FormGroup;
  isLoading = false;
  selectedParticipants: number[] = [];
  availableParticipants: User[] = [];

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private notificationService: NotificationService,
    private modalService: ModalService
  ) {
    this.expenseForm = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(100)]],
      value: ['', [Validators.required, Validators.min(0.01)]],
      date: [new Date(), [Validators.required]],
      paidByUserId: ['', [Validators.required]],
      participantsIds: [[], [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit(): void {
    // Configurar participantes disponíveis
    this.availableParticipants = this.group.users.map(user => ({
      id: user.id, // ✅ Agora temos ID real do backend
      username: user.Name,
      fullName: user.Name,
      email: '',
      birthDay: new Date()
    }));

    // Definir usuário atual como pagador padrão
    this.expenseForm.patchValue({
      paidByUserId: this.currentUser.id,
      participantsIds: [this.currentUser.id]
    });

    this.selectedParticipants = [this.currentUser.id];
  }

  onSubmit(): void {
    if (this.expenseForm.valid && !this.isLoading) {
      this.isLoading = true;

      const expenseData: ExpenseCreate = {
        description: this.expenseForm.get('description')?.value,
        value: parseFloat(this.expenseForm.get('value')?.value),
        date: this.expenseForm.get('date')?.value,
        paidByUserId: this.expenseForm.get('paidByUserId')?.value,
        participantsIds: this.expenseForm.get('participantsIds')?.value
      };

      console.log('Criando despesa:', expenseData);

      // Agora que temos IDs, podemos usar o backend real
      this.expenseService.createExpense(this.group.id, expenseData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.notificationService.success('Despesa criada com sucesso!');
          this.expenseCreated.emit(response);
          this.closeModal();
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Erro ao criar despesa:', error);
          this.notificationService.error('Erro ao criar despesa');
        }
      });
    }
  }

  toggleParticipant(userId: number): void {
    const participants = this.expenseForm.get('participantsIds')?.value || [];
    const index = participants.indexOf(userId);

    if (index > -1) {
      participants.splice(index, 1);
    } else {
      participants.push(userId);
    }

    this.expenseForm.patchValue({ participantsIds: participants });
    this.selectedParticipants = participants;
  }

  isParticipantSelected(userId: number): boolean {
    return this.selectedParticipants.includes(userId);
  }

  onCancel(): void {
    this.closeModal();
  }

  private closeModal(): void {
    this.modalService.closeCreateExpenseDialog();
  }

  // Event emitters
  expenseCreated = new EventEmitter<any>();
  closed = new EventEmitter<void>();
}
