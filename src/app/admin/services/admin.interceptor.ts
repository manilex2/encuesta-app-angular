import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AdminInterceptor implements HttpInterceptor {
  jsonIpURL = 'http://api.ipify.org/?format=json';

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.url != this.jsonIpURL) {
      try {
        const token = localStorage.getItem('auth_token');
        request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
        request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

        return next.handle(request);

      } catch (error) {
        console.error(error);
        throw error;
      }
    } else {
      try {
        if (request.headers.has('Authorization')) {
          request = request.clone({ headers: request.headers.delete('Authorization') });
          return next.handle(request);
        }
        return next.handle(request);
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  }
}
