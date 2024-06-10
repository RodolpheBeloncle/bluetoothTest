import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Message } from '../types/data.service.types';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket!: WebSocket;
  messageReceived: Subject<Message> = new Subject<Message>();
  private websocketUrl = environment.socketUrl;
  constructor(private toastController: ToastController) { }

  connect(): void {
    this.socket = new WebSocket(this.websocketUrl);

    this.socket.onopen = () => {
      console.log('WebSocket connection established.');
      this.showToast('WebSocket connection established.');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.status === 'success') {
        const message: any = {
          id: data.id,
          userId: data.userId,
          groupId: data.groupId,
          text: data.text,
          action: 'message',
          type: 'text', // Assuming 'type' is 'text', adjust if necessary
          created_at: new Date(data.createdAt)
        };
        console.log('Received message:', message);
        this.messageReceived.next(message);
      }
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
      setTimeout(() => {
        this.reconnect();
      }, 1000);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  sendMessage(message: Message): void {
    this.socket.send(JSON.stringify({
      action: "message",
      userId: message.userId,
      groupId: message.groupId,
      text: message.text,
    }));
  }

  reconnect(): void {
    this.connect();
  }

  closeConnection(): void {
    this.socket.close();
  }

  joinGroup(userId: number, groupId: number): void {
    this.socket.send(JSON.stringify({
      action: "join",
      userId: userId,
      groupId: groupId,
      text: `New User n° ${userId} joined the group Number ${groupId}`,
    }));
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
}
