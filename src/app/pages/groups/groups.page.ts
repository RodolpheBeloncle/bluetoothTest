import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController, LoadingController } from '@ionic/angular';
import { AuthService } from './../../services/auth.service';
import { DataService } from './../../services/data.service';
import { PushNotificationsService } from './../../services/push-notifications.service';
import { Group } from '../../types/data.service.types';
import { Observable } from 'rxjs';
import { SwPush } from '@angular/service-worker';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const VAPID_PUBLIC = 'BNst2NeEQvMeIMigVq36Kb-XfA2Nxa8iNF7QGubwSwIS7bYDOHalI1S6SyMfyak4CvT2MSKE0kfTKUNsrhaVhOA';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit {
  user: any;
  groups$: Observable<Group[]> | null = null;

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private navController: NavController,
    private router: Router,
    private swPush: SwPush,
    private pushService: PushNotificationsService,
    private http: HttpClient
  ) { }

  async ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
      if (user) {
        this.loadGroups(user.id);
      } else {
        this.router.navigate(['/login']);
      }
    });

    this.requestNotificationPermission();
    this.listenToNotifications();
  }

  async loadGroups(userId: number) {
    const loading = await this.loadingController.create();
    try {
      await loading.present();
      this.groups$ = this.dataService.getAllGroups();
      await loading.dismiss();
    } catch (error) {
      console.error('Error loading groups:', error);
      await this.showAlert('Error', 'Failed to load groups. Please try again later.');
    } finally {
      await loading.dismiss();
    }
  }

  async ionViewWillEnter() {
    if (this.user) {
      this.loadGroups(this.user.id);
    }
  }

  async createGroup() {
    const alert = await this.alertController.create({
      header: 'Start Chat Group',
      message: 'Enter a name for your group. Note that all groups are public in this app!',
      inputs: [
        {
          type: 'text',
          name: 'title',
          placeholder: 'My cool group',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Create group',
          handler: async (data) => {
            const loading = await this.loadingController.create();
            await loading.present();
            try {
              const newGroup = await this.dataService.createGroup(this.user.id, data.title).toPromise();
              if (newGroup) {
                console.log('Created group:', this.user.id, data.title, newGroup);
                this.loadGroups(this.user.id);
                this.router.navigateByUrl('/groups/' + newGroup.id);
              } else {
                await this.showAlert('Error', 'Failed to create group.');
              }
            } catch (error) {
              console.error('Error creating group:', error);
              await this.showAlert('Error', 'Failed to create group. Please try again later.');
            } finally {
              await loading.dismiss();
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async doRefresh(event: { target: { complete: () => void; }; }) {
    if (this.user) {
      this.loadGroups(this.user.id);
      event.target.complete();
    }
  }

  openGroup(group: Group) {
    this.router.navigate(['/groups', group.id]);
  }

  openLogin() {
    this.navController.navigateForward('/login');
  }

  async showAlert(title: string, msg: string) {
    const alert = await this.alertController.create({
      header: title,
      message: msg,
      buttons: ['OK'],
    });
    await alert.present();
  }

  signOut(): void {
    this.authService.signOut();
  }

  async requestNotificationPermission() {
    if (navigator && 'setAppBadge' in navigator) {
      console.log("The App Badging API is supported!");
      (navigator as any).setAppBadge(42);
    }

    if (this.user && this.swPush.isEnabled) {
      this.swPush
        .requestSubscription({
          serverPublicKey: VAPID_PUBLIC
        })
        .then(subscription => {
          const subscriptionJSON: PushSubscriptionJSON = subscription.toJSON();
          if (subscriptionJSON.keys) {
            const pushSubscription = {
              endpoint: subscription.endpoint,
              keys: {
                p256dh: subscriptionJSON.keys['p256dh'],
                auth: subscriptionJSON.keys['auth']
              }
            };
            this.pushService.saveSubscription(pushSubscription, this.user.id).subscribe(
              {
                next: (v) => console.log(v),
                error: (e) => console.error(e),
                complete: () => console.info('complete')
              }
            );
            console.log('Subscription client:', pushSubscription, this.user.id);
          } else {
            console.error('Subscription keys are undefined');
          }
        })
        .catch(console.error);
    }
  }

  listenToNotifications() {
    this.swPush.messages.subscribe(message => {
      console.log('Received push message:', message);
      // Handle the message as needed
    });

    this.swPush.notificationClicks.subscribe(({ action, notification }) => {
      console.log('Notification action clicked: ', action);
      if (action === 'open' && notification.data && notification.data.url) {
        this.router.navigateByUrl(notification.data.url);
      }
    });
  }

  async sendTestNotification() {
    const payload = {
      title: 'Test Notification',
      body: 'This is a test notification from GroupsPage',
      icon: 'assets/icons/icon-512x512.png',
      badge: 'assets/icons/icon-128x128.png',
      image: 'assets/images/notification-banner.png',
      url: 'https://yourappurl.com',
      actions: [
        { action: 'open', title: 'Open App', icon: 'assets/icons/open-icon.png' },
        { action: 'dismiss', title: 'Dismiss', icon: 'assets/icons/dismiss-icon.png' }
      ],
      vibrate: [100, 50, 100],
      requireInteraction: true
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post(`${this.pushService.baseUrl}/notification/sendNotification`, { payload }, { headers }).subscribe(
      {
        next: (v) => console.log('Notification sent:', v),
        error: (e) => console.error('Error sending notification:', e),
        complete: () => console.info('Notification send complete')
      }
    );
  }

  async sendLocalNotification() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        registration.showNotification('Hello, World!', {
          body: 'This is a notification from the App Badging API',
          badge: 'assets/icon/favicon.png',
          icon: 'assets/icon/favicon.png',
          silent: true,
          data: {
            url: 'https://www.google.com',
            id: 1
          }
        });
      } catch (error) {
        console.error('Error showing notification:', error);
      }
    }
  }
}
