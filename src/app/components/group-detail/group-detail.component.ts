import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth.service';
import { GroupService } from '../../services/group.service';
import { ExpenseService } from '../../services/expense.service';
import { Group } from '../../models/group.model';
import { GroupBalance, Expense } from '../../models/expense.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-group-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatChipsModule
  ],
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss']
})
export class GroupDetailComponent implements OnInit {
  groupId: number = 0;
  groupBalance: GroupBalance | null = null;
  currentUser: User | null = null;
  isLoading = false;
  showCreateExpenseDialog = false;

  displayedColumns: string[] = ['description', 'value', 'paidBy', 'date', 'participants'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private groupService: GroupService,
    private expenseService: ExpenseService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.route.params.subscribe(params => {
      this.groupId = +params['id'];
      this.loadGroupData();
    });
  }

  loadGroupData(): void {
    this.isLoading = true;
    this.expenseService.getExpensesFromGroup(this.groupId).subscribe({
      next: (balance: GroupBalance) => {
        this.groupBalance = balance;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Erro ao carregar dados do grupo', 'Fechar', {
          duration: 3000
        });
      }
    });
  }

  openCreateExpenseDialog(): void {
    this.showCreateExpenseDialog = true;
  }

  onExpenseCreated(): void {
    this.showCreateExpenseDialog = false;
    this.loadGroupData();
    this.snackBar.open('Despesa criada com sucesso!', 'Fechar', {
      duration: 3000
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  getBalanceColor(balance: number): string {
    if (balance > 0) return 'positive';
    if (balance < 0) return 'negative';
    return 'neutral';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }
}
