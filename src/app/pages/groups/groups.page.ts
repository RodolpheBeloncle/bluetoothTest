// src/app/groups/groups.page.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController, LoadingController } from '@ionic/angular';
import { AuthService } from './../../services/auth.service';
import { DataService } from './../../services/data.service';
import { PushNotificationsService } from './../../services/push-notifications.service';
import { Group } from '../../types/data.service.types';
import { Observable } from 'rxjs';
import { SwPush } from '@angular/service-worker';

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
    private pushService: PushNotificationsService
  ) { }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
      if (user) {
        this.loadGroups(user.id);
      } else {
        this.router.navigate(['/login']);
      }
    });

    if (this.swPush.isEnabled) {
      this.swPush
        .requestSubscription({
          serverPublicKey: VAPID_PUBLIC
        })
        .then(subscription => {
          this.pushService.saveSubscription(subscription).subscribe();
        })
        .catch(console.error);
    }

    if (navigator && 'setAppBadge' in navigator) {
      console.log("The App Badging API is supported!");
      // To display a number in the badge
      (navigator as any).setAppBadge(42);

      navigator.serviceWorker.getRegistration().then(registration => {
        registration?.showNotification("Hello from the Service Worker!");
      });
    }
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

  requestNotificationPermission() {
    if (this.swPush.isEnabled) {
      this.swPush
        .requestSubscription({
          serverPublicKey: VAPID_PUBLIC
        })
        .then(subscription => {
          this.pushService.saveSubscription({ ...subscription, userId: this.user.id }).subscribe();
          console.log('subscription client ', subscription);
        })
        .catch(console.error);
    }
  }
}
