import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from '../types/data.service.types';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private ws: WebSocket | null = null;
  private messagesSubject = new Subject<Message>();
  public messages$ = this.messagesSubject.asObservable();

  constructor() { }

  connect() {
    this.ws = new WebSocket('ws://localhost:8080');
    this.ws.onmessage = (event) => {
      this.handleMessage(event.data);
    };
    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
    this.ws.onerror = (error) => {
      console.error('WebSocket error', error);
    };
  }

  sendMessage(message: any) {
    if (this.ws) {
      this.ws.send(JSON.stringify(message));
    }
  }

  joinGroup(userId: string, groupId: string) {
    const joinMessage = { type: 'join', userId, groupId, text: '', createdAt: new Date() };
    this.sendMessage(joinMessage);
  }

  leaveGroup(groupId: string) {
    const leaveMessage = { type: 'leave', groupId, userId: '', text: '', createdAt: new Date() };
    this.sendMessage(leaveMessage);
  }

  private handleMessage(data: string) {
    // Check if the message contains JSON
    const jsonStart = data.indexOf('{');
    if (jsonStart !== -1) {
      const jsonString = data.substring(jsonStart);
      try {
        const message = JSON.parse(jsonString) as Message;
        this.messagesSubject.next(message);
      } catch (error) {
        console.error('Error parsing message', error);
      }
    } else {
      console.log('Received non-JSON message:', data);
    }
  }
}
