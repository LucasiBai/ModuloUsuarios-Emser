import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginContainerComponent } from './containers/login-container/login-container.component';
import { HomeContainerComponent } from './containers/home-container/home-container.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginContainerComponent,
    HomeContainerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
