import {NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {ServerModule, ServerTransferStateModule} from '@angular/platform-server';

import {AppModule} from './app.module';
import {AppComponent} from './app.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
