import { UserSummary } from "./user.model";
import { ExpenseDetail } from "./expense.model";

export interface Group {
  id: number;
  name: string;
  isPublic: boolean;
  leaderId: number;
  users: UserSummary[];
}

export interface GroupCreate {
  name: string;
  isPublic: boolean;
}

export interface GroupMember {
  id: number;
  username: string;
  fullName: string;
  email: string;
}

export interface GroupRename {
  name: string;
}

// Corresponde ao GroupSummaryDTO do backend
export interface GroupSummary {
  id: number;        // ✅ Agora o backend retorna o ID
  name: string;
  leaderId: number;
  users: UserSummary[];
  isPublic: boolean;
  expenses: ExpenseDetail[];
}
