import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private wsUrl = environment.backendUrl;
  private socket!: Socket;
  private messagesSubject = new BehaviorSubject<any[]>([]);
  public messages$ = this.messagesSubject.asObservable();
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

  constructor() {
    this.initWebSocket();
  }

  initWebSocket() {
    console.log('Initializing WebSocket...');
    this.socket = io(this.wsUrl, {
      path: '/ws',
      transports: ['websocket'],
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 2000,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.isConnected = false;
    });

    this.socket.on('message', (message: any) => {
      console.log('WebSocket message received:', message);
      this.messagesSubject.next([...this.messagesSubject.value, message]);
    });

    this.socket.on('connect_error', (error: any) => {
      console.error('WebSocket connection error:', error);
      this.reconnectAttempts++;
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached. Stopping further attempts.');
        this.socket.io.opts.reconnection = false; // Stop further reconnection attempts
      }
    });

    this.socket.on('reconnect_attempt', (attemptNumber: number) => {
      console.log(`WebSocket attempting to reconnect, attempt number ${attemptNumber}`);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('WebSocket failed to reconnect');
    });

    this.socket.on('error', (error: any) => {
      console.error('WebSocket error:', error);
    });
  }

  sendMessage(message: { userId: string; groupId: string; text: string; action: string }) {
    if (!this.isConnected) {
      console.error('WebSocket is not connected. Cannot send message.');
      return;
    }
    this.socket.emit('message', message); // Send as object
    console.log('Message sent:', message);
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

  getHistory(userId: string, groupId: string) {
    const historyMessage = { userId, groupId, text: '', action: 'history' };
    this.sendMessage(historyMessage);
  }

  clearMessages() {
    this.messagesSubject.next([]);
  }

  closeWebSocket() {
    if (this.socket) {
      this.socket.close();
    }
  }
}
