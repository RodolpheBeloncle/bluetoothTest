#include "BluetoothSerial.h"

// Code simplifié pour l'ESP32, transformant chaque appareil en génie de la communication.
void setup() {
    Serial.begin(115200);
    SerialBT.begin("ESP32test");
    Serial.println("Bluetooth device is ready to pair and receive messages");
}

void loop() {
    if (SerialBT.connected()) {
        SerialBT.println("Send me something to echo back!");
        delay(3000);
        while (SerialBT.available()) {
            String message = SerialBT.readString();
            Serial.print("Received: ");
            Serial.println(message);
            SerialBT.print("Echo: ");
            SerialBT.println(message);
        }
    }
    delay(1000);
}
