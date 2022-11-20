import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient,
} from '@angular/common/http';

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
import { FieldUploadComponent } from './components/field-upload/field-upload.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    AppComponent,
    LoginContainerComponent,
    NavBarComponent,
    ItemListComponent,
    ItemListContainerComponent,
    NotFoundPageComponent,
    FieldEditorComponent,
    FieldUploadComponent,
    AskForDeleteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    CookieService,
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: UserAuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
