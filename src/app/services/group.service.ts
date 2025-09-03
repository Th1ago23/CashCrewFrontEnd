import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group, GroupCreate, GroupSummary } from '../models/group.model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private readonly API_URL = '/api/Group';

  constructor(private readonly http: HttpClient) { }

  createGroup(groupData: GroupCreate): Observable<Group> {
    return this.http.post<Group>(`${this.API_URL}/GroupCreate`, groupData);
  }

  getUserGroups(): Observable<GroupSummary[]> {
    return this.http.get<GroupSummary[]>(`${this.API_URL}/GetAllGroupsWithMembers`);
  }

  getGroupById(groupId: number): Observable<GroupSummary> {
    return this.http.get<GroupSummary>(`${this.API_URL}/${groupId}`);
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
