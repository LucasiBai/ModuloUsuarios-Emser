import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { enviroment } from '../enviroment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class APIRequestsService {
  AUTH_SERVER: string = enviroment.url;

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) {}

  public get(url: string) {
    return this.httpClient.get(`${this.AUTH_SERVER}${url}`);
  }

  public delete(url: String) {
    return this.httpClient.delete(`${this.AUTH_SERVER}${url}`);
  }

  public post(url: String, payload: any) {
    return this.httpClient.post(`${this.AUTH_SERVER}${url}`, payload);
  }

  public updateValue(url: string, newValue: any) {
    return this.httpClient.patch(`${this.AUTH_SERVER}${url}`, newValue);
  }

  public isCurrentUser(id: Number) {
    const userData = JSON.parse(this.cookieService.get('user'));
    return userData.id === id;
  }
}
