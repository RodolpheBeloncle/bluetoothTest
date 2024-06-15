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
