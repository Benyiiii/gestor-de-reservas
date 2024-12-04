import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';




// Importar IonicStorageModule si quieres mantener el almacenamiento local
import { IonicStorageModule } from '@ionic/storage-angular';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(), // Aquí se importa el módulo de Ionic
    AppRoutingModule,

    IonicStorageModule.forRoot() // Si usas almacenamiento local
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
