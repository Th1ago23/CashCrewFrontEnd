import { User } from "./user.model";

export interface Expense {
  id: number;
  value: number;
  description: string;
  date: Date;
  paidByUserId?: number;
  groupId: number;
  participants?: User[];
  paidByUser?: User;
}

export interface ExpenseCreate {
  value: number;
  description: string;
  date: Date;
  paidByUserId?: number;
  groupId: number;
  participantIds: number[];
}

export interface GroupBalance {
  groupId: number;
  groupName: string;
  expenses: Expense[];
  totalExpenses: number;
  memberBalances: MemberBalance[];
}

export interface MemberBalance {
  userId: number;
  userName: string;
  totalPaid: number;
  totalOwed: number;
  balance: number;
}
