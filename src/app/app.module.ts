import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { Md5Pipe } from './pipe/md5Pipe';
import { HttpClientModule } from '@angular/common/http';
import { WebSocketService } from './services/web-socket.service';




@NgModule({
  declarations: [AppComponent, Md5Pipe],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [BluetoothSerial, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, WebSocketService],
  bootstrap: [AppComponent],
})
export class AppModule { }
