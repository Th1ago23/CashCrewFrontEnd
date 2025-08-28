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
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadGroups();
  }

  loadGroups(): void {
    // Implementar carregamento de grupos quando a API estiver disponível
    this.isLoading = true;
    // this.groupService.getUserGroups().subscribe({...});
    this.isLoading = false;
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
    this.groups.push(group);
    this.showCreateGroupDialog = false;
    this.snackBar.open('Grupo criado com sucesso!', 'Fechar', {
      duration: 3000
    });
  }

  onMemberAdded(): void {
    this.showAddMemberDialog = false;
    this.selectedGroup = null;
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
          this.groups = this.groups.filter(g => g.id !== group.id);
          this.snackBar.open('Grupo excluído com sucesso!', 'Fechar', {
            duration: 3000
          });
        },
        error: (error) => {
          this.snackBar.open('Erro ao excluir grupo', 'Fechar', {
            duration: 3000
          });
        }
      });
    }
  }
}
