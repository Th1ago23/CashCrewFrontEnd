import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuthService } from '../../services/auth.service';
import { GroupService } from '../../services/group.service';
import { NotificationService } from '../../services/notification.service';
import { ModalService } from '../../services/modal.service';
import { GroupSummary } from '../../models/group.model';
import { User } from '../../models/user.model';
import { CreateGroupDialogComponent } from '../create-group-dialog/create-group-dialog.component';
import { InviteDialogComponent } from '../invite-dialog/invite-dialog.component';

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
    MatTooltipModule,
    CreateGroupDialogComponent,
    InviteDialogComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  groups: GroupSummary[] = [];
  isLoading = false;
  showCreateGroupDialog = false;
  showInviteDialog = false;
  selectedGroup: GroupSummary | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly groupService: GroupService,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly modalService: ModalService
  ) { }

  ngOnInit(): void {
    console.log('🚀 Dashboard inicializando...');
    this.currentUser = this.authService.getCurrentUser();
    console.log('👤 Usuário atual:', this.currentUser);
    console.log('🔑 Token atual:', this.authService.getToken());
    console.log('✅ Usuário autenticado:', this.authService.isAuthenticated());

    if (!this.currentUser) {
      console.warn('⚠️ Nenhum usuário encontrado, redirecionando para login...');
      this.router.navigate(['/login']);
      return;
    }

    console.log('📋 Carregando grupos...');
    this.loadGroups();

    // Subscrever ao modal service
    this.modalService.createGroupDialog$.subscribe(show => {
      this.showCreateGroupDialog = show;
    });

    this.modalService.inviteDialog$.subscribe(show => {
      console.log('🔄 Modal de convite mudou para:', show);
      this.showInviteDialog = show;
    });
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
    this.modalService.openCreateGroupDialog();
  }



  openInviteDialog(group: GroupSummary): void {
    console.log('🎯 Abrindo modal de convite para grupo:', group);
    this.selectedGroup = group;
    this.modalService.openInviteDialog();
    console.log('📱 Modal de convite aberto, showInviteDialog:', this.showInviteDialog);
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
    this.modalService.closeCreateGroupDialog();
  }



  onInviteDialogClosed(): void {
    this.modalService.closeInviteDialog();
    this.selectedGroup = null;
  }

  viewGroup(group: GroupSummary): void {
    console.log('Navegando para grupo:', group);
    console.log('ID do grupo:', group.id);
    console.log('Tipo do ID:', typeof group.id);
    this.router.navigate(['/group', group.id]);
  }

  deleteGroup(group: GroupSummary): void {
    if (confirm(`Tem certeza que deseja excluir o grupo "${group.name}"? Esta ação não pode ser desfeita.`)) {
      console.log('🗑️ Excluindo grupo:', group);

      this.groupService.deleteGroup(group.id).subscribe({
        next: (response) => {
          console.log('✅ Grupo excluído com sucesso:', response);
          this.notificationService.success('Grupo excluído com sucesso!');

          // Recarregar a lista de grupos para garantir consistência
          this.loadGroups();
        },
        error: (error) => {
          console.error('❌ Erro ao excluir grupo:', error);

          // Tratar diferentes tipos de erro
          if (error.status === 400) {
            const errorMessage = error.error?.message || 'Não é possível excluir este grupo.';
            this.notificationService.error(errorMessage);
          } else if (error.status === 404) {
            this.notificationService.error('Grupo não encontrado.');
          } else if (error.status === 403) {
            this.notificationService.error('Você não tem permissão para excluir este grupo.');
          } else {
            this.notificationService.error('Erro ao excluir grupo. Tente novamente.');
          }
        }
      });
    }
  }

  getTotalMembers(): number {
    return this.groups.reduce((total, group) => {
      return total + (group.users ? group.users.length : 0);
    }, 0);
  }

  getTotalExpenses(): number {
    return this.groups.reduce((total, group) => {
      return total + (group.Expenses ? group.Expenses.length : 0);
    }, 0);
  }

  getGroupLeaderName(group: GroupSummary): string {
    console.log('🔍 Buscando líder do grupo:', group.name);
    console.log('🔍 LeaderId:', group.leaderId, 'tipo:', typeof group.leaderId);
    console.log('🔍 CurrentUser ID:', this.currentUser?.id, 'tipo:', typeof this.currentUser?.id);
    console.log('🔍 Usuários do grupo:', group.users);

    const leader = group.users.find(user => user.id === group.leaderId);
    console.log('🔍 Líder encontrado:', leader);
    console.log('🔍 Líder Name:', leader?.Name);

    return leader ? leader.Name : 'Líder não encontrado';
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

  clearDataAndReload(): void {
    console.log('🧹 Limpando dados e recarregando...');
    this.authService.clearAllData();
    window.location.reload();
  }
}
