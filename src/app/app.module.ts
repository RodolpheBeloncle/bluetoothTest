import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { Md5Pipe } from './pipe/md5Pipe';
import { HttpClientModule } from '@angular/common/http';
import { WebSocketService } from './services/web-socket.service';
import { ServiceWorkerModule } from '@angular/service-worker';




@NgModule({
  declarations: [AppComponent, Md5Pipe],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, ServiceWorkerModule.register('ngsw-worker.js', {
  enabled: !isDevMode(),
  // Register the ServiceWorker as soon as the application is stable
  // or after 30 seconds (whichever comes first).
  registrationStrategy: 'registerWhenStable:30000'
})],
  providers: [BluetoothSerial, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, WebSocketService],
  bootstrap: [AppComponent],
})
export class AppModule { }
