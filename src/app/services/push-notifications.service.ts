import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const SERVER_URL = 'http://localhost:3000/subscription';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService {

  baseUrl = environment.backendUrl;

  constructor(private http: HttpClient) { }

  saveSubscription(subscription: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify(subscription);
    console.log('subscription service payload', body);
    return this.http.post(`${this.baseUrl}/notification/subscribe`, body, { headers });
  }

  async requestPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then((result) => {
        if (result === 'granted') {
          this.showNotification();
        }
      });
    }
  }

  async showNotification() {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Test Title',
          body: 'Test Body',
          id: 1,
          schedule: { at: new Date(Date.now() + 1000 * 5) },
          sound: "beep.wav",
          attachments: [{
            url: 'file://assets/beep.wav',
            id: '1'
          }],
          actionTypeId: '',
          extra: null
        }
      ]
    });
  }


}
