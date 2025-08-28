import { User } from "./user.model";

export interface Group {
  id: number;
  name: string;
  leaderId: number;
  isPublic: boolean;
  members?: User[];
}

export interface GroupCreate {
  name: string;
  isPublic: boolean;
}

export interface GroupMember {
  groupId: number;
  userEmail: string;
}

export interface GroupRename {
  groupId: number;
  newName: string;
}
