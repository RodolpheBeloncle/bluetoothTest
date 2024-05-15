import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController, LoadingController } from '@ionic/angular';
import { AuthService } from './../../services/auth.service';
import { DataService } from './../../services/data.service';
import { Group } from '../../types/data.service.types';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit {
  user: any;
  groups$: Observable<Group[]> | undefined;

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private navController: NavController,
    public router: Router ,
    
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
  }

  loadGroups(userId: number) {
    this.groups$ = this.dataService.getGroups(userId).pipe(
      catchError(async (error) => {
        console.error('Error loading groups:', error);
        await this.showAlert('Error', 'Failed to load groups. Please try again later.');
        return [];
      })
    );
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
                this.loadGroups(this.user.id);
                this.router.navigateByUrl('/groups/' + newGroup.id);  // Use single quotes
              } else {
                console.error('Error creating group');
              }
            } catch (error) {
              console.error('Error creating group:', error);
            } finally {
              await loading.dismiss();
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async signOut() {
    try {
      await this.authService.signOut().toPromise();
      this.navController.navigateRoot('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
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
}
