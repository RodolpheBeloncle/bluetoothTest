import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { WebSocketService } from '../../services/web-socket.service';
import { Group, Message } from 'src/app/types/data.service.types';
import { ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit, OnDestroy {
  @ViewChild('content', { static: false }) content!: ElementRef;
  messages: Message[] = [];
  group: Group | null = null;
  messageText: string = '';
  currentUserId!: number;
  private groupId!: number;
  private messagesSubscription!: Subscription;
  private connectionStatusSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private dataService: DataService,
    private webSocketService: WebSocketService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) { }

  async ngOnInit() {
    this.groupId = parseInt(this.route.snapshot.paramMap.get('groupid')!, 10);

    this.webSocketService.connect();

    this.authService.getCurrentUser().subscribe(async user => {
      const loading = await this.loadingController.create({
        message: 'Loading messages...',
      });
      await loading.present();

      if (user) {
        this.currentUserId = user.id;
        if (this.groupId) {
          await this.loadGroup(this.groupId);

          setTimeout(() => {
            console.log('Joining group:', this.currentUserId, this.groupId);
            this.joinGroup(this.currentUserId, this.groupId);
          }, 1000);

          this.loadMessages(this.groupId);
        }
      }

      await loading.dismiss();
    });

    this.messagesSubscription = this.webSocketService.messageReceived.subscribe((newMessage: Message) => {
      console.log('New message received:', newMessage);
      this.messages.push(newMessage);
      this.scrollToBottom();
    });
  }

  ngOnDestroy() {
    if (this.groupId) {
      this.webSocketService.sendMessage({
        userId: this.currentUserId,
        groupId: this.groupId,
        text: '',
        action: 'leave',
        type: '',
        created_at: new Date()
      });
    }
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
    this.webSocketService.closeConnection();
  }

  async loadGroup(groupId: number) {
    try {
      this.dataService.getGroupById(groupId).subscribe(group => {
        this.group = group;
      });
    } catch (error) {
      console.error('Error loading group:', error);
      await this.showToast('Error loading group');
      this.group = null;
    }
  }

  loadMessages(groupId: number) {
    this.dataService.getGroupMessages(groupId).subscribe(messages => {
      this.messages = messages;
      this.scrollToBottom();
    });
  }

  joinGroup(userId: number, groupId: number) {
    this.webSocketService.joinGroup(userId, groupId);
  }

  sendMessage() {
    if (this.messageText.trim() && this.groupId) {
      const newMessage: Message = {
        userId: this.currentUserId,
        groupId: this.groupId,
        text: this.messageText,
        action: 'message',
        type: 'text',
        created_at: new Date()
      };
      this.webSocketService.sendMessage(newMessage);
      this.messages.push(newMessage); // Immediately add the message to the array
      this.messageText = '';
      this.scrollToBottom();
    }
  }

  isCurrentUserMessage(message: Message): boolean {
    return message.userId === this.currentUserId;
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }

  scrollToBottom() {
    setTimeout(() => {
      const content = document.getElementById('content');
      if (content) {
        content.scrollTo(0, content.scrollHeight);
      }
    }, 100);
  }
}
