import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expense, ExpenseCreate, GroupBalance } from '../models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private readonly API_URL = 'http://localhost:5100/api';

  constructor(private http: HttpClient) { }

  getExpensesFromGroup(groupId: number): Observable<GroupBalance> {
    return this.http.get<GroupBalance>(`${this.API_URL}/Expense/${groupId}/GetExpensesFromGroup`);
  }

  createExpense(groupId: number, expenseData: ExpenseCreate): Observable<Expense> {
    return this.http.post<Expense>(`${this.API_URL}/Expense/Group/${groupId}/CreateExpense`, expenseData);
  }
}
