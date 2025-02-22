import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler } from '@angular/core';

import { SharedModule } from '@app/shared';
import { CoreModule } from '@app/core';

import { SettingsModule } from './settings';
import { StaticModule } from './static';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MonitoringErrorHandler } from './core';
import { BookrModule } from './bookr/bookr.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    FormsModule,
    // angular
    BrowserAnimationsModule,
    BrowserModule,

    // core & shared
    CoreModule,
    SharedModule,

    // features
    StaticModule,
    SettingsModule,

    // app
    AppRoutingModule,

    BookrModule
  ],
  providers: [{ provide: ErrorHandler, useClass: MonitoringErrorHandler }],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
