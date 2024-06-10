import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService {
  readonly VAPID_PUBLIC_KEY = 'BPZa6-Op20MDiDc10LeUEjnqOv1lu0hE6RBVLXAxbW1DcXNuVLHQpim6KCmLo-XpWaxR8cjSxoXkFRoB2AA8vbw';
  private backendUrl = environment.backendUrl;


  constructor(private swPush: SwPush, private http: HttpClient) { }

  subscribeToNotifications() {
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    }).then(subscription => {
      this.http.post(`${this.backendUrl}/api/subscribe`, subscription).subscribe();
    }).catch(err => console.error('Could not subscribe to notifications', err));
  }

  sendNotification(title: string, message: string) {
    const payload = { title, message };
    this.http.post(`${this.backendUrl}/api/sendNotification`, payload).subscribe();
  }
}
