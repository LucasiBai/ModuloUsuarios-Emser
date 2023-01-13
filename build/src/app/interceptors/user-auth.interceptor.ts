import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class UserAuthInterceptor implements HttpInterceptor {
  constructor(
    private cookieService: CookieService,
    private authService: AuthService
  ) {}

  token!: string;

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const tokenExpiration = Number(this.cookieService.get('token-expiration'));

    let req = request;

    if (tokenExpiration < Date.now()) {
      this.authService.refreshToken().subscribe((res) => {
        console.log(res);

        this.token = res['updated-token'];

        req = req.clone({
          setHeaders: {
            authorization: `Bearer ${this.token}`,
          },
        });

        return next.handle(req);
      });
    } else {
      this.token = this.cookieService.get('token');
    }

    req = req.clone({
      setHeaders: {
        authorization: `Bearer ${this.token}`,
      },
    });

    return next.handle(req);
  }
}
