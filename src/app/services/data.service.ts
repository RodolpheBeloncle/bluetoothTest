import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Message, Group } from '../types/data.service.types';
import { catchError } from 'rxjs/operators';



@Injectable({
  providedIn: 'root',
})
export class DataService {
  private backendUrl = environment.backendUrl;
  private realtimeChannel: WebSocket | null = null;
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

  constructor(private http: HttpClient) { }

  getGroups(userId: number): Observable<Group[]> {
    console.log('getGroups', userId);
    return this.http.get<Group[]>(`${this.backendUrl}/groups/usergroups/${userId}`).pipe(
      catchError(this.handleError<Group[]>('getGroups', []))
    );
  }


  

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }


  createGroup(creator: number, title: string): Observable<Group> {
    this.headers = this.headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    console.log('createGroup', this.headers);
    return this.http.post<Group>(`${this.backendUrl}/groups`, { creator, title }, { headers: this.headers });
  }

  getGroupById(id: any): Observable<Group> {
    return this.http.get<Group>(`${this.backendUrl}/groups/${id}`);
  }

  addGroupMessage(groupId: any, message: any): Observable<Message> {
    const newMessage = { text: message, group_id: groupId };
    return this.http.post<Message>(`${this.backendUrl}/messages/send`, newMessage);
  }

  getGroupMessages(groupId: any): Observable<Message[]> {
    console.log('getGroupMessages', groupId);
    return this.http.get<Message[]>(`${this.backendUrl}/messages/group/${groupId}`);
  }

  listenToGroup(groupId: string | number): Observable<Message> {
    const changes = new Subject<Message>();
    this.realtimeChannel = this.realtimeChannel || new WebSocket(`${this.backendUrl.replace('http', 'ws')}/ws/groups/${groupId}`);

    this.realtimeChannel.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      if (payload.type === 'message' && payload.payload.group_id === +groupId) {
        changes.next(payload.payload);
      }
    };

    this.realtimeChannel.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return changes.asObservable();
  }

  unsubscribeGroupChanges() {
    if (this.realtimeChannel) {
      this.realtimeChannel.close();
      this.realtimeChannel = null;
    }
  }



}
