import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { GroupService } from '../../services/group.service';
import { ExpenseService } from '../../services/expense.service';
import { NotificationService } from '../../services/notification.service';
import { ModalService } from '../../services/modal.service';
import { GroupSummary } from '../../models/group.model';
import { GroupBalance, MemberBalance, Debt, ExpenseDetail } from '../../models/expense.model';
import { User } from '../../models/user.model';
import { CreateExpenseDialogComponent } from '../create-expense-dialog/create-expense-dialog.component';

@Component({
  selector: 'app-group-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule,
    MatTableModule,
    MatTabsModule,
    MatListModule,
    CreateExpenseDialogComponent
  ],
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss']
})
export class GroupDetailComponent implements OnInit, OnDestroy {
  group: GroupSummary | null = null;
  groupBalance: GroupBalance | null = null;
  currentUser: User | null = null;
  isLoading = false;
  isLoadingExpenses = false;
  showCreateExpenseDialog = false;
  displayedColumns: string[] = ['description', 'value', 'paidBy', 'date', 'participants'];
  activeTab = 0;

  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private groupService: GroupService,
    private expenseService: ExpenseService,
    private notificationService: NotificationService,
    private modalService: ModalService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadGroupDetails();
    this.setupModalSubscriptions();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private setupModalSubscriptions(): void {
    const createExpenseSub = this.modalService.createExpenseDialog$.subscribe(
      (isOpen) => {
        console.log('ModalService: Estado do modal de criar despesa mudou para:', isOpen);
        this.showCreateExpenseDialog = isOpen;
      }
    );

    this.subscriptions.push(createExpenseSub);
  }

  loadGroupDetails(): void {
    const groupId = this.route.snapshot.paramMap.get('id');
    console.log('ID do grupo recebido na rota:', groupId);

    if (!groupId || isNaN(parseInt(groupId))) {
      console.error('ID do grupo inválido:', groupId);
      this.router.navigate(['/dashboard']);
      return;
    }

    const groupIdNumber = parseInt(groupId);
    console.log('ID do grupo convertido para número:', groupIdNumber);
    this.isLoading = true;

    // Buscar detalhes do grupo usando o método disponível
    console.log('Fazendo requisição para:', `/api/Group/GetGroupName?gpId=${groupIdNumber}`);
    this.groupService.getGroupName(groupIdNumber).subscribe({
      next: (response: { name: string }) => {
        console.log('Resposta do backend:', response);
        // Criar um objeto GroupSummary básico com os dados disponíveis
        this.group = {
          id: groupIdNumber,
          name: response.name,
          isPublic: false,
          leaderId: this.currentUser?.id || 0,
          users: [], // Será preenchido quando carregarmos as despesas
          expenses: []
        };
        this.loadGroupExpenses(groupIdNumber);
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar detalhes do grupo:', error);

        // Se for erro 400 (Bad Request), pode ser que o grupo não exista
        if (error.status === 400) {
          this.notificationService.error('Grupo não encontrado ou ID inválido');
        } else {
          this.notificationService.error('Erro ao carregar detalhes do grupo');
        }

        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      }
    });
  }



  loadGroupExpenses(groupId: number): void {
    this.isLoadingExpenses = true;
    this.expenseService.getGroupExpenses(groupId).subscribe({
      next: (balance: GroupBalance) => {
        console.log('Balanço do grupo carregado:', balance);
        this.groupBalance = balance;
        this.isLoadingExpenses = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar despesas do grupo:', error);
        this.isLoadingExpenses = false;
        this.notificationService.error('Erro ao carregar despesas do grupo');

        // Inicializar com dados vazios em caso de erro
        this.groupBalance = {
          debts: [],
          memberBalances: [],
          expenses: [],
          totalExpenses: 0
        };
      }
    });
  }

  openCreateExpenseDialog(): void {
    console.log('Abrindo modal de criar despesa');
    this.modalService.openCreateExpenseDialog();
  }

  onExpenseCreated(expense: any): void {
    console.log('Despesa criada:', expense);
    this.notificationService.success('Despesa criada com sucesso!');

    // Recarregar despesas do grupo
    if (this.group) {
      this.loadGroupExpenses(this.group.id);
    }
  }

  getCurrentUserBalance(): MemberBalance | null {
    if (!this.groupBalance || !this.currentUser) return null;

    return this.groupBalance.memberBalances.find(
      balance => balance.user.id === this.currentUser?.id
    ) || null;
  }

  getBalanceColor(balance: number): string {
    if (balance > 0.01) return 'success';
    if (balance < -0.01) return 'warn';
    return 'default';
  }

  getBalanceText(balance: number): string {
    if (balance > 0.01) return `Deve receber ${this.formatCurrency(balance)}`;
    if (balance < -0.01) return `Deve pagar ${this.formatCurrency(Math.abs(balance))}`;
    return 'Em dia';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('pt-BR').format(dateObj);
  }

  onTabChange(event: any): void {
    this.activeTab = event.index;
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
