import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private createGroupDialogSubject = new BehaviorSubject<boolean>(false);
  private addMemberDialogSubject = new BehaviorSubject<boolean>(false);
  private createExpenseDialogSubject = new BehaviorSubject<boolean>(false);

  createGroupDialog$ = this.createGroupDialogSubject.asObservable();
  addMemberDialog$ = this.addMemberDialogSubject.asObservable();
  createExpenseDialog$ = this.createExpenseDialogSubject.asObservable();

  openCreateGroupDialog(): void {
    console.log('ModalService: Abrindo modal de criar grupo');
    this.createGroupDialogSubject.next(true);
  }

  closeCreateGroupDialog(): void {
    console.log('ModalService: Fechando modal de criar grupo');
    this.createGroupDialogSubject.next(false);
  }

  openAddMemberDialog(): void {
    this.addMemberDialogSubject.next(true);
  }

  closeAddMemberDialog(): void {
    this.addMemberDialogSubject.next(false);
  }

  openCreateExpenseDialog(): void {
    console.log('ModalService: Abrindo modal de criar despesa');
    this.createExpenseDialogSubject.next(true);
  }

  closeCreateExpenseDialog(): void {
    console.log('ModalService: Fechando modal de criar despesa');
    this.createExpenseDialogSubject.next(false);
  }
}
