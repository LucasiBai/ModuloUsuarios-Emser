import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';

import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UpdatedTokenInterface } from '../models/updated-token-interface';

@Injectable()
export class UserAuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  static token: string;

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const req = this.getRequest(request);

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.authService.refreshToken().pipe(
            switchMap((res: UpdatedTokenInterface) => {
              this.authService.refreshTokenCookie(res);
              const req = this.getRequest(request);

              return next.handle(req);
            })
          );
        }

        return throwError(() => error);
      })
    );
  }

  private getRequest(request: HttpRequest<unknown>) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${UserAuthInterceptor.token}`,
      },
    });
  }
}
