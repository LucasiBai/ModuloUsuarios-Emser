import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CookieService } from 'ngx-cookie-service';

import { tap } from 'rxjs';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { UserInterface } from '../models/user';
import { JwtResponseInterface } from '../models/jwt-response';
import { UpdatedTokenInterface } from '../models/updated-token-interface';

import { enviroment } from '../enviroment';

@Injectable()
export class AuthService {
  AUTH_SERVER: string = enviroment.url;
  authSubject = new BehaviorSubject(false);
  TOKEN_LIFETIME = enviroment.token_lifetime;
  REFRESH_TOKEN_LIFETIME = enviroment.refresh_token_lifetime;

  private token!: string;

  constructor(
    private cookieService: CookieService,
    private httpClient: HttpClient
  ) {}

  public login(user: UserInterface): Observable<JwtResponseInterface> {
    return this.httpClient
      .post<JwtResponseInterface>(`${this.AUTH_SERVER}users/login/`, user)
      .pipe(
        tap((res: JwtResponseInterface) => {
          if (res) {
            this.saveToken(res);
          }
        })
      );
  }

  public logout() {
    this.token = '';
    this.cookieService.delete('token');
    this.cookieService.delete('refresh-token');
    this.cookieService.delete('token-expiration');
    this.cookieService.delete('refresh-expiration');
    this.cookieService.delete('user');
  }

  public refreshToken(): Observable<UpdatedTokenInterface> {
    const refreshToken = this.cookieService.get('refresh-token');
    return this.httpClient
      .post<UpdatedTokenInterface>(`${this.AUTH_SERVER}users/login/refresh/`, {
        'refresh-token': refreshToken,
      })
      .pipe(
        tap((res: UpdatedTokenInterface) => {
          if (res) {
            this.token = res['updated-token'];

            this.cookieService.set('token', this.token);
            this.cookieService.set(
              'token-expiration',
              JSON.stringify(Date.now() + this.TOKEN_LIFETIME)
            );
          }
        })
      );
  }

  public getUserData() {
    return JSON.parse(this.cookieService.get('user'));
  }

  public getUserPermises() {
    return this.getUserData().user_type;
  }

  private saveToken(apiResponse: JwtResponseInterface): void {
    this.token = apiResponse.token;
    this.cookieService.set('token', apiResponse.token);
    this.cookieService.set(
      'token-expiration',
      JSON.stringify(Date.now() + this.TOKEN_LIFETIME)
    );
    this.cookieService.set(
      'refresh-expiration',
      JSON.stringify(Date.now() + this.REFRESH_TOKEN_LIFETIME)
    );
    this.cookieService.set('refresh-token', apiResponse['refresh-token']);
    this.cookieService.set('user', JSON.stringify(apiResponse.user));
  }
}
