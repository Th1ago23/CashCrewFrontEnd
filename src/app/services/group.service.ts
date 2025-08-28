import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group, GroupCreate, GroupMember, GroupRename } from '../models/group.model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private readonly API_URL = '/api';

  constructor(private http: HttpClient) { }

  createGroup(groupData: GroupCreate): Observable<any> {
    console.log('🌐 GroupService - URL da requisição:', `${this.API_URL}/Group/GroupCreate`);
    console.log('🌐 GroupService - API_URL configurada:', this.API_URL);
    return this.http.post<any>(`${this.API_URL}/Group/GroupCreate`, groupData);
  }

  getAllGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.API_URL}/Group/GetAllGroups`);
  }

  addMember(groupId: number, userEmail: string): Observable<any> {
    return this.http.post(`${this.API_URL}/Group/${groupId}/AddMember/${userEmail}`, {});
  }

  getGroupName(groupId: number): Observable<{ name: string }> {
    return this.http.get<{ name: string }>(`${this.API_URL}/Group/GetGroupName?gpId=${groupId}`);
  }

  removeMember(groupId: number, userToRemoveId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/Group/${groupId}/RemoveMember/${userToRemoveId}`);
  }

  deleteGroup(groupId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/Group/DeleteGroup/${groupId}`);
  }

  renameGroup(groupId: number, newName: string): Observable<{ name: string }> {
    return this.http.patch<{ name: string }>(`${this.API_URL}/Group/${groupId}/RenameGroup?newName=${encodeURIComponent(newName)}`, {});
  }
}
