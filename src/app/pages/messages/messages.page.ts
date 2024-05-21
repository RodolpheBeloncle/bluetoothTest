import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { WebSocketService } from '../../services/web-socket.service';
import { Subscription } from 'rxjs';
import { Message, Group } from '../../types/data.service.types';
import { ToastController, LoadingController } from '@ionic/angular';

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
  private loading: HTMLIonLoadingElement | null = null;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private webSocketService: WebSocketService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) { }

  async ngOnInit() {
    this.groupId = this.route.snapshot.paramMap.get('groupid');
    this.loading = await this.loadingController.create({
      message: 'Loading messages...',
    });
    await this.loading.present();

    this.authService.getCurrentUser().subscribe(async user => {
      if (user) {
        this.currentUserId = user.id;
        if (this.groupId) {
          this.joinGroup(this.groupId);
        }
      }
      if (this.loading) {
        await this.loading.dismiss();
        this.loading = null;
      }
    });

    this.messagesSubscription = this.webSocketService.messages$.subscribe(messages => {
      console.log('New messages received:', messages);
      this.messages = messages;
    });

    this.webSocketService.initWebSocket();
  }

  ngOnDestroy() {
    if (this.groupId) {
      this.webSocketService.leaveGroup(this.currentUserId, this.groupId);
    }
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }

  joinGroup(groupId: string) {
    this.webSocketService.joinGroup(this.currentUserId, groupId);
    this.showToast('Joined group successfully');
  }

  sendMessage() {
    if (this.messageText.trim() && this.groupId) {
      this.webSocketService.sendMessageToGroup(this.currentUserId, this.groupId, this.messageText);
      this.messageText = '';
      console.log('Message sent', this.currentUserId, this.groupId, this.messageText);
      this.showToast('Message sent');
    }
  }

  isCurrentUserMessage(message: Message): boolean {
    console.log('isCurrentUserMessage:', message);
    console.log('User id listed from the message list', message.userId, this.currentUserId);
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
}
