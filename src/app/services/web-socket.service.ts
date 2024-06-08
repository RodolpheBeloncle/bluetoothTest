// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class WebSocketService {
//   private wsUrl = 'ws://localhost:3000/ws'; // Update to your WebSocket URL
//   private socket!: WebSocket;
//   private messagesSubject = new BehaviorSubject<any[]>([]);
//   public messages$ = this.messagesSubject.asObservable();
//   private isConnected: boolean = false;
//   private reconnectAttempts: number = 0;
//   private maxReconnectAttempts: number = 5;

//   constructor() {
//     this.initWebSocket();
//   }

//   initWebSocket() {
//     console.log('Initializing WebSocket...');
//     this.socket = new WebSocket(this.wsUrl);

//     this.socket.onopen = () => {
//       console.log('WebSocket connected');
//       this.isConnected = true;
//       this.reconnectAttempts = 0;
//     };

//     this.socket.onclose = () => {
//       console.log('WebSocket disconnected');
//       this.isConnected = false;
//       if (this.reconnectAttempts < this.maxReconnectAttempts) {
//         setTimeout(() => {
//           this.reconnectAttempts++;
//           this.initWebSocket();
//         }, 2000);
//       } else {
//         console.error('Max reconnection attempts reached. Stopping further attempts.');
//       }
//     };

//     this.socket.onmessage = (event) => {
//       const message = JSON.parse(event.data);
//       console.log('WebSocket message received:', message);
//       this.messagesSubject.next([...this.messagesSubject.value, message]);
//     };

//     this.socket.onerror = (error) => {
//       console.error('WebSocket error:', error);
//     };
//   }

//   sendMessage(message: { userId: string; groupId: string; text: string; action: string }) {
//     if (!this.isConnected) {
//       console.error('WebSocket is not connected. Cannot send message.');
//       return;
//     }
//     this.socket.send(JSON.stringify(message));
//     console.log('Message sent:', message);
//   }

//   joinGroup(userId: string, groupId: string) {
//     const joinMessage = { userId, groupId, text: '', action: 'join' };
//     this.sendMessage(joinMessage);
//   }

//   leaveGroup(userId: string, groupId: string) {
//     const leaveMessage = { userId, groupId, text: '', action: 'leave' };
//     this.sendMessage(leaveMessage);
//   }

//   sendMessageToGroup(userId: string, groupId: string, text: string) {
//     const message = { userId, groupId, text, action: 'message' };
//     this.sendMessage(message);
//   }

//   getHistory(userId: string, groupId: string) {
//     const historyMessage = { userId, groupId, text: '', action: 'history' };
//     this.sendMessage(historyMessage);
//   }

//   clearMessages() {
//     this.messagesSubject.next([]);
//   }

//   closeWebSocket() {
//     if (this.socket) {
//       this.socket.close();
//     }
//   }
// }

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket!: WebSocket;
  messageReceived: Subject<string> = new Subject<string>();

  constructor() { }

  connect(): void {
    this.socket = new WebSocket('http://localhost:3000/ws');

    this.socket.onopen = () => {
      console.log('WebSocket connection established.');
    };

    this.socket.onmessage = (event) => {
      const message = event.data;
      console.log('Received message:', message);
      this.messageReceived.next(message);
    };


    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);

      // if connextion is closed, try to reconnect
      setTimeout(() => {
        this.reconnect();
      }, 1000);


    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }


  sendMessage(message: string): void {
    // stringify the message and send it
    this.socket.send(JSON.stringify({
      action: "message",
      userId: 5,
      groupId: 1,
      text: message
    })
    );
  }

  reconnect(): void {
    this.socket = new WebSocket('http://localhost:3000/ws');
  }

  closeConnection(): void {
    this.socket.close();
  }
}
