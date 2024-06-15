import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService {

  baseUrl = environment.backendUrl;

  constructor(private http: HttpClient) { }

  saveSubscription(subscription: any, userId: bigint): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = {
      userId: userId.toString(),
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth
    };
    return this.http.post(`${this.baseUrl}/notification/subscribe`, body, { headers });
  }

  async requestPermission(userId: bigint) {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        await this.subscribeToNotifications(userId);
      }
    }
  }

  private async subscribeToNotifications(userId: bigint) {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.register('/ngsw-worker.js');
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array('BNOJyTgwrEwK9lbetRcougxkRgLpPs1DX0YCfA5ZzXu4z9p_Et5EnvMja7MGfCqyFCY4FnFnJVICM4bMUcnrxWg')
        });

        this.saveSubscription(subscription, userId).subscribe(
          {
            next: (v) => console.log(v),
            error: (e) => console.error(e),
            complete: () => console.info('complete')
          }
        );
      } catch (error) {
        console.error('Error subscribing to notifications:', error);
      }
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
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
