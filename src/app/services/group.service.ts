import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group, GroupCreate, GroupSummary } from '../models/group.model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private readonly API_URL = '/api/Group';

  constructor(private http: HttpClient) { }

<<<<<<< HEAD
  createGroup(groupData: GroupCreate): Observable<Group> {
    return this.http.post<Group>(`${this.API_URL}/GroupCreate`, groupData);
  }

  getUserGroups(): Observable<GroupSummary[]> {
    return this.http.get<GroupSummary[]>(`${this.API_URL}/GetAllGroupsWithMembers`);
=======
  createGroup(groupData: GroupCreate): Observable<any> {
    console.log('🌐 GroupService - URL da requisição:', `${this.API_URL}/Group/GroupCreate`);
    console.log('🌐 GroupService - API_URL configurada:', this.API_URL);
    return this.http.post<any>(`${this.API_URL}/Group/GroupCreate`, groupData);
  }

  getAllGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.API_URL}/Group/GetAllGroups`);
>>>>>>> 4a9a77a453882c4ed4190880720329e2c3983784
  }

  addMember(groupId: number, userEmail: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${groupId}/AddMember/${userEmail}`, {});
  }

  getGroupName(groupId: number): Observable<{ name: string }> {
    return this.http.get<{ name: string }>(`${this.API_URL}/GetGroupName?gpId=${groupId}`);
  }

  removeMember(groupId: number, userToRemoveId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${groupId}/RemoveMember/${userToRemoveId}`);
  }

  deleteGroup(groupId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/DeleteGroup/${groupId}`);
  }

  renameGroup(groupId: number, newName: string): Observable<{ name: string }> {
    return this.http.patch<{ name: string }>(`${this.API_URL}/${groupId}/RenameGroup?newName=${encodeURIComponent(newName)}`, {});
  }
}
