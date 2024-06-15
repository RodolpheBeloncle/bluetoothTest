import { Injector, enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

if (environment.production) {
  enableProdMode();
}

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

const registerSW = async (): Promise<void> => {
  try {
    const registration = await navigator.serviceWorker.register('ngsw-worker.js');
    console.log('Service Worker registered with scope:', registration.scope);

    // Register the custom service worker
    await navigator.serviceWorker.register('service-worker.js');
    console.log('Custom Service Worker registered with scope:', registration.scope);
  } catch (err) {
    console.error('Service Worker registration failed:', err);
  }
};

const main = async (injector: Injector) => {
  checkPermission();
  await registerSW();
};

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(moduleRef => {
    const injector = moduleRef.injector;
    main(injector).catch(err => console.error(err));
  })
  .catch(err => console.error(err));

defineCustomElements(window);
