import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './services/auth.service';

import { UserAuthInterceptor } from './interceptors/user-auth.interceptor';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginContainerComponent } from './containers/login-container/login-container.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { ItemListContainerComponent } from './containers/item-list-container/item-list-container.component';
import { NotFoundPageComponent } from './containers/not-found-page/not-found-page.component';
import { FieldEditorComponent } from './components/field-editor/field-editor.component';
import { AskForDeleteComponent } from './components/ask-for-delete/ask-for-delete.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginContainerComponent,
    NavBarComponent,
    ItemListComponent,
    ItemListContainerComponent,
    NotFoundPageComponent,
    FieldEditorComponent,
    AskForDeleteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    CookieService,
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: UserAuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
