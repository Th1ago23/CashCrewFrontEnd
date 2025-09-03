import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface InviteResponse {
  token: {
    result: string;
    id: number;
    exception: any;
    status: number;
    isCanceled: boolean;
  };
  message: string;
}

export interface JoinGroupRequest {
  token: string;
}

export interface JoinGroupResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class InvitationService {
  private readonly API_URL = '/api/Invitation';

  constructor(private readonly http: HttpClient) { }

  createInvite(groupId: number, expirationTime: string): Observable<InviteResponse> {
    return this.http.post<InviteResponse>(`${this.API_URL}/Group/${groupId}/CreateInvite`, expirationTime);
  }

  joinGroup(token: string): Observable<JoinGroupResponse> {
    const request: JoinGroupRequest = { token };
    return this.http.post<JoinGroupResponse>(`${this.API_URL}/groups/join`, request);
  }
}
