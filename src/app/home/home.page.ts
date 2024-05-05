import { Component } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';

import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public devices: any[] = [];
  public selectedDevice: any;
  public message: string = '';
  public messages: string[] = [];
  private loader: any;



  constructor(private bluetoothSerial: BluetoothSerial,
    private toastController: ToastController,
    private loadingController: LoadingController) {
    this.checkBluetoothEnabled();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  async showLoader() {
    this.loader = await this.loadingController.create({
      message: 'Connecting...',
      spinner: 'circles' // This sets the spinner type
    });
    await this.loader.present();
  }


  async hideLoader() {
    if (this.loader) {
      await this.loader.dismiss();
    }
  }

  checkBluetoothEnabled() {
    this.bluetoothSerial.isEnabled().then(
      () => {
        console.log('Bluetooth is enabled');
        this.listDevices();
      },
      (error) => {
        console.log('Bluetooth is not enabled:', error);
        this.bluetoothSerial.enable().then(
          () => {
            console.log('Bluetooth has been enabled');
            this.listDevices();
          },
          (enableError) => console.error('Error enabling Bluetooth:', enableError)
        );
      }
    );
  }

  listDevices() {
    this.bluetoothSerial.list().then(
      (devices) => {
        console.log('Devices:', devices);
        this.devices = devices; // Store paired devices
      },
      (listError) => console.error('Error listing devices:', listError)
    );
  }

  connectToDevice(device: any) {
    this.bluetoothSerial.connect(device.address).subscribe(success => {
      this.selectedDevice = device;
      console.log('Connected to', device.name);
      this.receiveData();
    }, error => {
      console.error('Error connecting to device:', error);
    });
  }

  sendData() {
    if (this.message.length > 0) {
      this.bluetoothSerial.write(this.message).then(response => {
        console.log('Message sent', this.message);
        this.messages.push('Sent: ' + this.message);
        this.message = '';  // Clear the message input
      }, error => {
        console.error('Error sending message:', error);
      });
    }
  }


  clearMessages() {
    this.messages = [];
    this.presentToast('Message history cleared');
  }

  receiveData() {
    this.bluetoothSerial.subscribe('\n').subscribe(data => {
      console.log('Received:', data);
      this.messages.push('Received: ' + data);
    }, error => {
      console.error('Error receiving data:', error);
      this.presentToast('Error receiving data');
    });
  }

  disconnect() {
    this.bluetoothSerial.disconnect();
    this.selectedDevice = null;
    console.log('Disconnected');
    this.presentToast('Disconnected');
  }

}



