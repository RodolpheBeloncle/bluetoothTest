// import { Injectable } from '@angular/core';
// import { Subject } from 'rxjs';
// import { Message } from '../types/data.service.types';

// @Injectable({
//   providedIn: 'root'
// })
// export class WebSocketService {
//   private ws: WebSocket | null = null;
//   private messagesSubject = new Subject<Message[]>();
//   public messages$ = this.messagesSubject.asObservable();

//   constructor() { }

//   connect() {
//     if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
//       return; // Already connected or in the process of connecting
//     }

//     this.ws = new WebSocket('wss://bluetoothtest.duckdns.org/ws');

//     this.ws.onopen = () => console.log('Connected');
//     this.ws.onerror = (error) => console.error('WebSocket error', error);
//     this.ws.onclose = () => console.log('Closed');

//     this.ws.onopen = () => {
//       console.log('WebSocket connection opened');
//     };

//     this.ws.onmessage = (event) => {
//       this.handleMessage(event.data);
//     };

//     this.ws.onclose = () => {
//       console.log('WebSocket connection closed');
//       this.reconnect();
//     };

//     this.ws.onerror = (error) => {
//       console.error('WebSocket error', error);
//       this.reconnect();
//     };
//   }

//   reconnect() {
//     console.log('Attempting to reconnect...');
//     setTimeout(() => this.connect(), 5000); // Attempt to reconnect every 5 seconds
//   }

//   sendMessage(message: any) {
//     if (this.ws && this.ws.readyState === WebSocket.OPEN) {
//       console.log('Sending message to server:', message);
//       this.ws.send(JSON.stringify(message));
//     } else {
//       console.error('WebSocket is not open. Cannot send message:', message);
//     }
//   }

//   joinGroup(userId: string, groupId: string) {
//     const joinMessage = { userId: 2, groupId: 2, text: '', action: 'join' };
//     this.sendMessage(joinMessage);
//   }

//   leaveGroup(userId: string, groupId: string) {
//     const leaveMessage = { userId, groupId, text: '', action: 'leave' };
//     this.sendMessage(leaveMessage);
//   }

//   sendMessageToGroup(userId: string, groupId: string, text: string) {
//     const message = { userId: 2, groupId: 2, text: "hello ionic", action: 'message' };
//     this.sendMessage(message);
//   }

//   private handleMessage(data: string) {
//     try {
//       const parsedData = JSON.parse(data);
//       if (parsedData.status === 'success' || parsedData.status === 'error') {
//         console.log('Received response:', parsedData);
//       } else if (parsedData.status === 'history') {
//         const messages = parsedData.data as Message[];
//         console.log('Received message history:', messages);
//         this.messagesSubject.next(messages);
//       } else if (parsedData.userId && parsedData.groupId && parsedData.text) {
//         const message = parsedData as Message;
//         console.log('Parsed message:', message);
//         this.messagesSubject.next([message]);
//       } else {
//         console.log('Received unknown data format:', parsedData);
//       }
//     } catch (error) {
//       console.error('Error parsing message', error);
//     }
//   }
// }


// src/app/services/web-socket.service.ts
import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

const { WebSocketClient } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private wsName = 'mainSocket';
  private wsUrl = environment.backendUrl;
  private messagesSubject = new BehaviorSubject<any[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  constructor() {
    this.initWebSocket();
  }

  async initWebSocket() {
    try {
      await WebSocketClient['build']({
        url: this.wsUrl,
        name: this.wsName
      });

      WebSocketClient['addListener'](`${this.wsName}:onOpen`, () => {
        console.log('WebSocket connected');
      });

      WebSocketClient['addListener'](`${this.wsName}:onClose`, () => {
        console.log('WebSocket disconnected');
      });

      WebSocketClient['addListener'](`${this.wsName}:onMessage`, (event: { data: any; }) => {
        console.log('WebSocket message received:', event.data);
        const messages = [...this.messagesSubject.value, event.data];
        this.messagesSubject.next(messages);
      });

      WebSocketClient['addListener'](`${this.wsName}:onError`, (error: any) => {
        console.error('WebSocket error:', error);
      });

      await WebSocketClient['connect']({ name: this.wsName });
    } catch (error) {
      console.error('WebSocket initialization error:', error);
    }
  }

  async sendMessage(message: any) {
    try {
      await WebSocketClient['send']({ name: this.wsName, message: JSON.stringify(message) });
      console.log('Message sent:', message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  async disconnect() {
    try {
      await WebSocketClient['disconnect']({ name: this.wsName });
      console.log('WebSocket disconnected');
    } catch (error) {
      console.error('Error disconnecting WebSocket:', error);
    }
  }
}
