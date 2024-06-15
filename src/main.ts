import { enableProdMode, Injector } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { PushNotificationsService } from './app/services/push-notifications.service';

if (environment.production) {
  enableProdMode();
}

const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

const checkPermission = (): void => {
  if (!('serviceWorker' in navigator)) {
    throw new Error('No support for service worker!');
  }

  if (!('Notification' in window)) {
    throw new Error('No support for notification API');
  }

  if (!('PushManager' in window)) {
    throw new Error('No support for Push API');
  }
};

const registerSW = async (): Promise<ServiceWorkerRegistration> => {
  return navigator.serviceWorker.register('ngsw-worker.js')
    .then(registration => {
      console.log('Service Worker registered with scope:', registration.scope);
      return registration;
    })
    .catch(err => {
      console.error('Service Worker registration failed:', err);
      throw err;
    });
};

const requestNotificationPermission = async (): Promise<void> => {
  const permission = await Notification.requestPermission();

  if (permission !== 'granted') {
    throw new Error('Notification permission not granted');
  }
};

const main = async (injector: Injector): Promise<void> => {
  checkPermission();

  await requestNotificationPermission();
  const registration = await registerSW();

  registration.addEventListener('updatefound', () => {
    const installingWorker = registration.installing;
    if (installingWorker) {
      installingWorker.addEventListener('statechange', async () => {
        if (installingWorker.state === 'activated') {
          try {
            const subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array('BNst2NeEQvMeIMigVq36Kb-XfA2Nxa8iNF7QGubwSwIS7bYDOHalI1S6SyMfyak4CvT2MSKE0kfTKUNsrhaVhOA')
            });

            const subscriptionService = injector.get(PushNotificationsService);
            const response = await subscriptionService.saveSubscription(subscription).toPromise();
            console.log(response);
          } catch (err) {
            console.error('Failed to subscribe to push notifications:', err);
          }
        }
      });
    }
  });
};

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(moduleRef => {
    const injector = moduleRef.injector;
    main(injector).catch(err => console.error(err));
  })
  .catch(err => console.error(err));

// Call the element loader after the platform has been bootstrapped
defineCustomElements(window);
