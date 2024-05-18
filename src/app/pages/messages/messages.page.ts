// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { AuthService } from './../../services/auth.service';
// import { Message, Group } from '../../types/data.service.types';
// import { WebSocketService } from '../../services/web-socket.service';
// import { Subscription } from 'rxjs';

// @Component({
//   selector: 'app-messages',
//   templateUrl: './messages.page.html',
//   styleUrls: ['./messages.page.scss'],
// })
// export class MessagesPage implements OnInit, OnDestroy {
//   messages: Message[] = [];
//   group: Group | null = null;
//   messageText: string = '';
//   currentUserId: string = '';
//   private groupId: string | null = null;
//   private messagesSubscription: Subscription = new Subscription;

//   constructor(
//     private authService: AuthService,
//     private route: ActivatedRoute,
//     private webSocketService: WebSocketService
//   ) { }

//   ngOnInit() {
//     this.groupId = this.route.snapshot.paramMap.get('groupid');
//     this.authService.getCurrentUser().subscribe(user => {
//       if (user) {
//         this.currentUserId = user.id;
//         if (this.groupId) {
//           this.joinGroup(this.groupId);
//         }
//       }
//     });

//     this.messagesSubscription = this.webSocketService.messages$.subscribe(messages => {
//       console.log('New messages received:', messages);
//       this.messages.push(...messages);
//     });

//     this.webSocketService.connect();
//   }

//   ngOnDestroy() {
//     if (this.groupId) {
//       this.webSocketService.leaveGroup(this.currentUserId, this.groupId);
//     }
//     if (this.messagesSubscription) {
//       this.messagesSubscription.unsubscribe();
//     }
//   }

//   joinGroup(groupId: string) {
//     this.webSocketService.joinGroup(this.currentUserId, groupId);
//   }

//   sendMessage() {
//     if (this.messageText.trim() && this.groupId) {
//       this.webSocketService.sendMessageToGroup(this.currentUserId, this.groupId, this.messageText);
//       this.messageText = '';
//     }
//   }

//   isCurrentUserMessage(message: Message): boolean {
//     console.log('isCurrentUserMessage:', message.user_id, this.currentUserId);
//     return message.user_id === this.currentUserId;
//   }
// }


// src/app/pages/messages/messages.page.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { WebSocketService } from '../../services/web-socket.service';
import { Subscription } from 'rxjs';
import { Message, Group } from '../../types/data.service.types';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit, OnDestroy {
  messages: Message[] = [];
  group: Group | null = null;
  messageText: string = '';
  currentUserId: string = '';
  private groupId: string | null = null;
  private messagesSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private webSocketService: WebSocketService
  ) { }

  ngOnInit() {
    this.groupId = this.route.snapshot.paramMap.get('groupid');
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.currentUserId = user.id;
        if (this.groupId) {
          // this.joinGroup(this.groupId);
        }
      }
    });

    this.messagesSubscription = this.webSocketService.messages$.subscribe(messages => {
      console.log('New messages received:', messages);
      this.messages.push(...messages);
    });

    this.webSocketService.initWebSocket();
  }

  ngOnDestroy() {
    if (this.groupId) {
      // this.webSocketService.leaveGroup(this.currentUserId, this.groupId);
    }
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }

  // joinGroup(groupId: string) {
  //   this.webSocketService.joinGroup(this.currentUserId, groupId);
  // }

  // sendMessage() {
  //   if (this.messageText.trim() && this.groupId) {
  //     this.webSocketService.sendMessageToGroup(this.currentUserId, this.groupId, this.messageText);
  //     this.messageText = '';
  //   }
  // }

  isCurrentUserMessage(message: Message): boolean {
    console.log('isCurrentUserMessage:', message.user_id, this.currentUserId);
    return message.user_id === this.currentUserId;
  }
}
