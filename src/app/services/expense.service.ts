import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expense, ExpenseCreate, GroupBalance, ExpenseDetail } from '../models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private readonly API_URL = '/api/Expense';

  constructor(private http: HttpClient) { }

  getGroupExpenses(groupId: number): Observable<GroupBalance> {
    return this.http.get<GroupBalance>(`${this.API_URL}/${groupId}/GetExpensesFromGroup`);
  }

  createExpense(groupId: number, expenseData: ExpenseCreate): Observable<any> {
    return this.http.post(`${this.API_URL}/Group/${groupId}/CreateExpense`, expenseData);
  }

  getExpenseById(expenseId: number): Observable<ExpenseDetail> {
    return this.http.get<ExpenseDetail>(`${this.API_URL}/${expenseId}`);
  }

  getExpenseWithGroup(expenseId: number): Observable<ExpenseDetail> {
    return this.http.get<ExpenseDetail>(`${this.API_URL}/${expenseId}/withGroup`);
  }
}
