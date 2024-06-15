npx cap init projectble io.ionic.starter  
 delete android folder
ionic build --prod
npx cap add android
npx cap sync

npx cap open android

----------------------------------------------------------------

coté server : 
npm run build
sudo systemctl restart nginx
sudo systemctl restart bluetoottest
sudo journalctl -u bluetoothtest -f
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/bluetooth_duckdns_org_error.log
sudo tail -f /var/log/nginx/bluetoothtest_access.log



---------------------------------------

   <uses-permission android:maxSdkVersion="30" android:name="android.permission.BLUETOOTH" />
  <uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
  <uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
  <uses-permission android:maxSdkVersion="30" android:name="android.permission.BLUETOOTH_ADMIN" />
  <android:usesCleartextTraffic="true">

  npm install @miaz/capacitor-websocket
npx cap sync


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

=== install ionic ===

s'assurer que node est et npm est installer npx
Optionnal nvm pour gerer les versions de nodes
installer android studio pour le deployment sur mobile ( dans mon cas android version 11)
npm install -g @ionic/cli
ionic start myApp tabs
cd myApp
ionic integrations enable capacitor
installer les packages nessecaires en autre @awesome-cordova-plugins/bluetooth-serial
npm install
npx cap add android

brancher votre telephone via usb
une fois que android studio est lancé le deployement avec le bouton play

tester la communication avec un microcontroller type espwroom32
voici le code source je ne rentrerai pas dans les details , mis a part que je travaille sur l'ide visual studio code avec plateforme io pour envoyer le code compiler sur l'esp32

#include "BluetoothSerial.h"

// Check if BluetoothSerial library is included
#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth is not enabled! Please run `make menuconfig` to and enable it
#endif

BluetoothSerial SerialBT; // Create Bluetooth Serial object

void setup()
{
Serial.begin(115200); // Start the Serial communication to debug
SerialBT.begin("ESP32test"); // Start the Bluetooth Serial service, "ESP32test" is the name of the Bluetooth.
Serial.println("Bluetooth device is ready to pair and receive messages");
}

void loop()
{
// Check if there is a Bluetooth connection
if (SerialBT.connected())
{
SerialBT.println("Send me something to echo back!");
delay(3000); // Wait for a second
// Check if there is anything received from the Bluetooth connection
while (SerialBT.available())
{
String message = SerialBT.readString(); // Read the incoming message
Serial.print("Received: ");
Serial.println(message); // Echo the received message on the Serial Monitor
SerialBT.print("Echo: ");
SerialBT.println(message); // Send back the received message to the Bluetooth Monitor app
}
}
delay(1000); // Wait for a second
}
