import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { PushNotificationsService } from '../app/services/push-notifications.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  isAuthenticated: Observable<boolean>;
  title = 'push-notifications-client';


  constructor(public authService: AuthService, public router: Router, private pushService: PushNotificationsService) {
    this.isAuthenticated = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
      } else {
        this.router.navigate(['/groups']);
      }
    });

    this.subscribeToNotifications();
    this.sendNotification();

  }

  signOut(): void {
    this.authService.signOut();
  }


  subscribeToNotifications() {
    this.pushService.subscribeToNotifications();
  }

  sendNotification() {
    this.pushService.sendNotification('Test Title', 'Test Message');
  }
}
