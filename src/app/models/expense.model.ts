import { User } from "./user.model";
import { Group } from "./group.model";

export interface Expense {
  id: number;
  description: string;
  value: number;
  date: Date;
  groupId: number;
  paidByUserId: number;
  participants: UserSummary[];
  paidByUser?: UserSummary;
}

export interface ExpenseCreate {
  value: number;
  description: string;
  date: Date;
  paidByUserId: number;
  participantsIds: number[];
}

// Corresponde ao ExpenseDetailDTO do backend
export interface ExpenseDetail {
  description: string;
  value: number;
  date: Date;
  user: UserSummary; // Quem pagou
  users: UserSummary[]; // Participantes
  dto: Group;         // ✅ Agora usa Group que tem ID
}

export interface UserSummary {
  id: number;        // ✅ Agora o backend retorna o ID
  name: string;
}

export interface Debt {
  fromUser: UserSummary;
  toUser: UserSummary;
  amount: number;
}

export interface MemberBalance {
  user: UserSummary;
  userName: string;
  balance: number;
  totalPaid: number;
  totalOwed: number;
}

// Corresponde ao GroupBalanceDTO do backend
export interface GroupBalance {
  debts: Debt[];
  memberBalances: MemberBalance[];
  expenses?: ExpenseDetail[];
  totalExpenses?: number;
}
