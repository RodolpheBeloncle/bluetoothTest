npx cap init projectble io.ionic.starter  
 delete android folder
ionic build
npx cap add android

npx cap sync

npx cap open android

   <uses-permission android:maxSdkVersion="30" android:name="android.permission.BLUETOOTH" />
  <uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
  <uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
  <uses-permission android:maxSdkVersion="30" android:name="android.permission.BLUETOOTH_ADMIN" />

Delete pacha-lock and node modules
npm install --legacy-peer-deps
npm install rxjs@7.8.1 --save
npm install --legacy-peer-deps
npm cache clean --force




ionic cordova plugin add cordova-plugin-bluetooth-serial


ionic start bluetoothTest blank --type=angular --capacitor
cd bluetoothTest
ionic build
ionic cordova plugin add cordova-plugin-bluetooth-serial
npm install @capacitor/android
npx cap init "bluetoothTest" "com.example.bluetoothTest"   
npx cap add android
npx cap sync
npx cap open android

Refresh :

ionic repair
ionic build
npx cap sync



ionic cordova plugin add cordova-plugin-bluetooth-serial
npm install @ionic-native/bluetooth-serial
npx cap sync

If problem. nvm use version
cordova platform add android
cordova plugin add cordova-plugin-bluetooth-serial
npm install @awesome-cordova-plugins/core @awesome-cordova-plugins/bluetooth-serial

