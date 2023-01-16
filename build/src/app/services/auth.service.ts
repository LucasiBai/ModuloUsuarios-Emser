import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CookieService } from 'ngx-cookie-service';

import { tap } from 'rxjs';
import { BehaviorSubject, Observable } from 'rxjs';

import { UserInterface } from '../models/user';
import { JwtResponseInterface } from '../models/jwt-response';
import { UpdatedTokenInterface } from '../models/updated-token-interface';

import { enviroment } from '../enviroment';
import { UserAuthInterceptor } from '../interceptors/user-auth.interceptor';

@Injectable()
export class AuthService {
  AUTH_SERVER: string = enviroment.url;
  authSubject = new BehaviorSubject(false);
  REFRESH_TOKEN_LIFETIME = enviroment.refresh_token_lifetime;

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
            this.saveTokenCookie(res);
          }
        })
      );
  }

  public logout() {
    this.cookieService.delete('refresh-token');
    this.cookieService.delete('refresh-expiration');
    this.cookieService.delete('user');
  }

  public refreshToken(): Observable<UpdatedTokenInterface> {
    const refreshToken = this.cookieService.get('refresh-token');

    return this.httpClient.post<UpdatedTokenInterface>(
      `${this.AUTH_SERVER}users/login/refresh/`,
      {
        'refresh-token': refreshToken,
      }
    );
  }

  public getUserData() {
    return JSON.parse(this.cookieService.get('user'));
  }

  public getUserPermises() {
    return this.getUserData().user_type;
  }

  public hasToken() {
    const hasToken: boolean = this.cookieService.check('refresh-token');

    const expiration: Number = Number(
      this.cookieService.get('refresh-expiration')
    );

    return {
      hasToken,
      expiration,
    };
  }

  public refreshTokenCookie(apiResponse: UpdatedTokenInterface) {
    const token = apiResponse['updated-token'];

    UserAuthInterceptor.token = token;
  }

  private saveTokenCookie(apiResponse: JwtResponseInterface): void {
    this.cookieService.delete('refresh-token');
    this.cookieService.delete('refresh-expiration');
    this.cookieService.delete('user');

    this.cookieService.set(
      'refresh-expiration',
      JSON.stringify(Date.now() + this.REFRESH_TOKEN_LIFETIME)
    );
    this.cookieService.set('refresh-token', apiResponse['refresh-token']);
    this.cookieService.set('user', JSON.stringify(apiResponse.user));

    UserAuthInterceptor.token = apiResponse.token;
  }
}
