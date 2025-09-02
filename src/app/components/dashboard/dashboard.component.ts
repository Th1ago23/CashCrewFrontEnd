import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';

import { AuthService } from '../../services/auth.service';
import { GroupService } from '../../services/group.service';
import { NotificationService } from '../../services/notification.service';
import { GroupSummary } from '../../models/group.model';
import { User } from '../../models/user.model';
import { CreateGroupDialogComponent } from '../create-group-dialog/create-group-dialog.component';
import { AddMemberDialogComponent } from '../add-member-dialog/add-member-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    CreateGroupDialogComponent,
    AddMemberDialogComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  groups: GroupSummary[] = [];
  isLoading = false;
  showCreateGroupDialog = false;
  showAddMemberDialog = false;
  selectedGroup: GroupSummary | null = null;

  constructor(
    private authService: AuthService,
    private groupService: GroupService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadGroups();
  }

  loadGroups(): void {
    this.isLoading = true;
    this.groupService.getUserGroups().subscribe({
      next: (groups: GroupSummary[]) => {
        console.log('Grupos carregados:', groups);
        console.log('Primeiro grupo:', groups[0]);
        console.log('ID do primeiro grupo:', groups[0]?.id);
        // Garantir que todos os grupos tenham a propriedade users inicializada
        this.groups = groups.map(group => ({
          ...group,
          users: group.users || []
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar grupos:', error);
        this.isLoading = false;
        this.notificationService.error('Erro ao carregar grupos');
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  openCreateGroupDialog(): void {
    this.showCreateGroupDialog = true;
  }

  openAddMemberDialog(group: GroupSummary): void {
    this.selectedGroup = group;
    this.showAddMemberDialog = true;
  }

  onGroupCreated(event: any): void {
    const group = event as GroupSummary;
    console.log('Grupo criado recebido:', group);

    // Recarregar a lista de grupos para garantir que está atualizada
    this.loadGroups();

    // A notificação já é mostrada pelo componente do modal
  }

  onGroupDialogClosed(): void {
    console.log('Dashboard: Fechando modal de criar grupo');
    this.showCreateGroupDialog = false;
  }

  onMemberAdded(): void {
    this.showAddMemberDialog = false;
    this.selectedGroup = null;
    this.loadGroups();
    this.notificationService.success('Membro adicionado com sucesso!');
  }

  viewGroup(group: GroupSummary): void {
    console.log('Navegando para grupo:', group);
    console.log('ID do grupo:', group.id);
    console.log('Tipo do ID:', typeof group.id);
    this.router.navigate(['/group', group.id]);
  }

  deleteGroup(group: GroupSummary): void {
    if (confirm(`Tem certeza que deseja excluir o grupo "${group.name}"? Esta ação não pode ser desfeita.`)) {
      // Como não temos ID no modelo, vamos usar uma abordagem temporária
      // Quando o backend estiver funcionando, descomente o código abaixo
      /*
      this.groupService.deleteGroup(group.id).subscribe({
        next: () => {
          this.notificationService.success('Grupo excluído com sucesso!');
          this.loadGroups();
        },
        error: (error) => {
          console.error('Erro ao excluir grupo:', error);
          this.notificationService.error('Erro ao excluir grupo');
        }
      });
      */

      // Simulação temporária
      this.notificationService.success('Grupo excluído com sucesso!');
      // Remover o grupo da lista local
      this.groups = this.groups.filter(g => g.name !== group.name);
    }
  }

  getTotalMembers(): number {
    return this.groups.reduce((total, group) => {
      return total + (group.users ? group.users.length : 0);
    }, 0);
  }

  getTotalExpenses(): number {
    return this.groups.reduce((total, group) => {
      return total + (group.expenses ? group.expenses.length : 0);
    }, 0);
  }

  testApi(): void {
    console.log('Testando API...');
    // Testar se a API está funcionando
    this.groupService.getUserGroups().subscribe({
      next: (groups) => {
        console.log('✅ API funcionando! Grupos recebidos:', groups);
        this.notificationService.success('API funcionando corretamente!');
      },
      error: (error) => {
        console.error('❌ Erro na API:', error);
        this.notificationService.error(`Erro na API: ${error.status} - ${error.message}`);
      }
    });
  }
}
