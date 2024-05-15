import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from '../types/data.service.types';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private ws: WebSocket | null = null;
  private messagesSubject = new Subject<Message[]>();
  public messages$ = this.messagesSubject.asObservable();

  constructor() { }

  connect() {
    this.ws = new WebSocket('ws://192.168.1.14:3000');
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
      console.log('Sending message to server:', message);
      this.ws.send(JSON.stringify(message));
    }
  }

  joinGroup(userId: string, groupId: string) {
    const joinMessage = { userId, groupId, text: '', action: 'join' };
    this.sendMessage(joinMessage);
  }

  leaveGroup(userId: string, groupId: string) {
    const leaveMessage = { userId, groupId, text: '', action: 'leave' };
    this.sendMessage(leaveMessage);
  }

  sendMessageToGroup(userId: string, groupId: string, text: string) {
    const message = { userId, groupId, text, action: 'message' };
    this.sendMessage(message);
  }

  private handleMessage(data: string) {
    try {
      const parsedData = JSON.parse(data);
      if (parsedData.status === 'success' || parsedData.status === 'error') {
        console.log('Received response:', parsedData);
      } else if (parsedData.status === 'history') {
        const messages = parsedData.data as Message[];
        console.log('Received message history:', messages);
        this.messagesSubject.next(messages);
      } else if (parsedData.userId && parsedData.groupId && parsedData.text) {
        const message = parsedData as Message;
        console.log('Parsed message:', message);
        this.messagesSubject.next([message]);
      } else {
        console.log('Received unknown data format:', parsedData);
      }
    } catch (error) {
      console.error('Error parsing message', error);
    }
  }
}
