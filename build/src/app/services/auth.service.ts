import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CookieService } from 'ngx-cookie-service';

import { tap } from 'rxjs';
import { BehaviorSubject, Observable } from 'rxjs';

import { UserInterface } from '../models/user';
import { JwtResponseInterface } from '../models/jwt-response';

@Injectable()
export class AuthService {
  AUTH_SERVER: string = 'http://127.0.0.1:8000/api/';
  authSubject = new BehaviorSubject(false);

  private token!: string;

  constructor(
    private cookieService: CookieService,
    private httpClient: HttpClient
  ) {}

  login(user: UserInterface): Observable<JwtResponseInterface> {
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

  logout() {
    this.token = '';
    this.cookieService.delete('token');
    this.cookieService.delete('refresh-token');
    this.cookieService.delete('user');
  }

  private saveToken(apiResponse: JwtResponseInterface): void {
    this.token = apiResponse.token;
    this.cookieService.set('token', apiResponse.token);
    this.cookieService.set('refresh-token', apiResponse['refresh-token']);
    this.cookieService.set('user', JSON.stringify(apiResponse.user));
  }

  private getToken(): string {
    if (!this.token) {
      this.token = this.cookieService.get('token');
    }
    return this.token;
  }
}
