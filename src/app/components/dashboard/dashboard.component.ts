import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth.service';
import { GroupService } from '../../services/group.service';
import { Group } from '../../models/group.model';
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
  groups: Group[] = [];
  isLoading = false;
  showCreateGroupDialog = false;
  showAddMemberDialog = false;
  selectedGroup: Group | null = null;

  constructor(
    private authService: AuthService,
    private groupService: GroupService,
    private router: Router,
    private snackBar: MatSnackBar
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
  }

  loadGroups(): void {
    console.log('Iniciando carregamento de grupos...');
    this.isLoading = true;
    this.groupService.getAllGroups().subscribe({
      next: (groups) => {
        console.log('Grupos carregados com sucesso:', groups);
        this.groups = groups;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar grupos:', error);
        console.error('Status:', error.status);
        console.error('Mensagem:', error.error);
        this.isLoading = false;
        this.snackBar.open('Erro ao carregar grupos', 'Fechar', {
          duration: 3000
        });
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

  openAddMemberDialog(group: Group): void {
    this.selectedGroup = group;
    this.showAddMemberDialog = true;
  }

  onGroupCreated(event: any): void {
    const group = event as Group;
    console.log('Evento de grupo criado recebido:', group);
    
    // Recarregar todos os grupos da API para garantir sincronização
    this.loadGroups();
    
    // Não fechar o modal aqui, pois o modal já se fecha sozinho
    // this.showCreateGroupDialog = false;
    
    this.snackBar.open('Grupo criado com sucesso!', 'Fechar', {
      duration: 3000
    });
  }

  onMemberAdded(): void {
    this.showAddMemberDialog = false;
    this.selectedGroup = null;
    // Recarregar grupos para mostrar o novo membro
    this.loadGroups();
    this.snackBar.open('Membro adicionado com sucesso!', 'Fechar', {
      duration: 3000
    });
  }

  viewGroup(group: Group): void {
    this.router.navigate(['/group', group.id]);
  }

  deleteGroup(group: Group): void {
    if (confirm(`Tem certeza que deseja excluir o grupo "${group.name}"?`)) {
      this.groupService.deleteGroup(group.id).subscribe({
        next: () => {
          // Recarregar grupos da API para garantir sincronização
          this.loadGroups();
          this.snackBar.open('Grupo excluído com sucesso!', 'Fechar', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Erro ao excluir grupo:', error);
          this.snackBar.open('Erro ao excluir grupo', 'Fechar', {
            duration: 3000
          });
        }
      });
    }
  }

  testAPI(): void {
    console.log('Testando API...');
    console.log('Token atual:', this.authService.getToken());
    console.log('Usuário atual:', this.currentUser);
    
    // Testar se a API está respondendo
    this.groupService.getAllGroups().subscribe({
      next: (response) => {
        console.log('✅ API funcionando! Resposta:', response);
        this.snackBar.open('API funcionando!', 'Fechar', { duration: 3000 });
      },
      error: (error) => {
        console.error('❌ Erro na API:', error);
        this.snackBar.open(`Erro na API: ${error.status} - ${error.message}`, 'Fechar', { duration: 5000 });
      }
    });
  }
}
