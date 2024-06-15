# bluetoothTest

// ============== pwa ====================

ng add @angular/pwa
npm install @capacitor/local-notifications
npm install @ionic/pwa-elements

This command will set up the service worker and manifest for you.

4. Implement Service Worker and Notification Logic
   Service Worker
   The @angular/pwa package will create a service worker file for you at src/ngsw-config.json. You can customize it as needed.

---

You may need to add necessary permissions for notifications in your AndroidManifest.xml file:

<?xml version="1.0" encoding="utf-8"?>

<manifest xmlns:android="http://schemas.android.com/apk/res/android"
xmlns:tools="http://schemas.android.com/tools"

>

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">

        <activity
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:name=".MainActivity"
            android:label="@string/title_activity_main"
            android:theme="@style/AppTheme.NoActionBarLaunch"
            android:launchMode="singleTask"
            android:exported="true">

            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

        </activity>

        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="${applicationId}.fileprovider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths"></meta-data>
        </provider>
      <receiver android:exported="true" tools:replace="android:exported" android:enabled="true" android:name="com.capacitorjs.plugins.localnotifications.LocalNotificationRestoreReceiver">
        <intent-filter>
          <action android:name="android.intent.action.BOOT_COMPLETED" />
          <action android:name="android.intent.action.MY_PACKAGE_REPLACED" />
        </intent-filter>
      </receiver>
    </application>

    <!-- Permissions -->

    <uses-permission android:name="android.permission.INTERNET" />

  <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>

</manifest>



# ----  service worker  -----


Intégration d'un Service Worker Personnalisé dans un Projet Angular Ionic
Ce guide explique comment ajouter un service worker personnalisé à un projet Angular Ionic pour gérer les notifications push de manière avancée. Nous allons couvrir la création du fichier du service worker, la configuration d'Angular pour l'inclure, et l'enregistrement du service worker.

## - Étape 1 : Créer le Fichier du Service Worker
Créez un fichier nommé service-worker.js dans le répertoire src de votre projet.

- src/service-worker.js
```js
self.addEventListener('push', function(event) {
  const data = event.data.json();

  const options = {
    body: data.body,
    icon: data.icon || 'assets/icons/icon-512x512.png',
    badge: data.badge || 'assets/icons/icon-128x128.png',
    image: data.image || 'assets/images/notification-banner.png',
    vibrate: [100, 50, 100],
    requireInteraction: true,
    actions: data.actions || [
      { action: 'open', title: 'Ouvrir l\'application', icon: 'assets/icons/open-icon.png' },
      { action: 'dismiss', title: 'Ignorer', icon: 'assets/icons/dismiss-icon.png' }
    ],
    data: {
      url: data.url
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'open') {
    clients.openWindow(event.notification.data.url);
  }
});
```
## Étape 2 : Mettre à Jour angular.json
Assurez-vous que le fichier sw.js est inclus dans les assets du build. Ajoutez src/sw.js dans la section assets de angular.json.

angular.json
```json
{
  "projects": {
    "app": {
      "architect": {
        "build": {
          "options": {
            "assets": [
              {
                "glob": "**/*",
                "input": "src/assets",
                "output": "assets"
              },
              {
                "glob": "**/*.svg",
                "input": "node_modules/ionicons/dist/ionicons/svg",
                "output": "./svg"
              },
              "src/manifest.webmanifest",
              "src/servie-worker.js"  
            ],
            "serviceWorker": true,
            "ngswConfigPath": "ngsw-config.json"
          }
        }
      }
    }
  }
}
```
## Étape 3 : Enregistrer le Service Worker dans main.ts
Modifiez main.ts pour enregistrer à la fois ngsw-worker.js (le service worker par défaut d'Angular) et votre service worker personnalisé service-worker.js.

src/main.ts
```js
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
    throw new Error('Pas de support pour les service workers!');
  }

  if (!('Notification' in window)) {
    throw new Error('Pas de support pour l\'API de notifications!');
  }

  if (!('PushManager' in window)) {
    throw new Error('Pas de support pour l\'API de push!');
  }
};

const registerSW = async (): Promise<void> => {
  try {
    const registration = await navigator.serviceWorker.register('ngsw-worker.js');
    console.log('Service Worker enregistré avec le scope:', registration.scope);

    await navigator.serviceWorker.register('sw.js');
    console.log('Service Worker personnalisé enregistré avec le scope:', registration.scope);
  } catch (err) {
    console.error('Échec de l\'enregistrement du Service Worker:', err);
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
```
Résumé
Créer service-worker.js : Placez votre fichier de service worker personnalisé (sw.js) dans le répertoire src.
Mettre à jour angular.json : Assurez-vous que sw.js est inclus dans les assets du build.
Enregistrer le Service Worker : Modifiez main.ts pour enregistrer ngsw-worker.js et sw.js.
Avec ces étapes, votre service worker personnalisé sera enregistré et pourra gérer les notifications push avec un style avancé.