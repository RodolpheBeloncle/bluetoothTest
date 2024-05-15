import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Message, Group } from '../../types/data.service.types';
import { WebSocketService } from '../../services/web-socket.service';

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
          this.joinGroup(this.groupId);
        }
      }
    });

    this.webSocketService.messages$.subscribe(message => {
      this.messages.push(message);
    });

    this.webSocketService.connect();
  }

  ngOnDestroy() {
    if (this.groupId) {
      this.webSocketService.leaveGroup(this.groupId);
    }
  }

  joinGroup(groupId: string) {
    this.webSocketService.joinGroup(this.currentUserId, groupId);
  }

  sendMessage() {
    if (this.messageText.trim() && this.groupId) {
      this.webSocketService.sendMessage({
        type: 'message',
        userId: this.currentUserId,
        groupId: this.groupId,
        text: this.messageText,
        createdAt: new Date()
      });
      this.messageText = '';
    }
  }
}
