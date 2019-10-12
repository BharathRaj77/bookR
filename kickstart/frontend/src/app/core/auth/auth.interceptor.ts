import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AdalService } from './adal.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private adal: AdalService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Prevent the interceptor to intercept requests while ADAL hasn't fully been initialized yet
    // or if the request is to a local resource.
    if (!this.adal.isInitialized || req.url.startsWith('/')) {
      return next.handle(req);
    }

    // if the endpoint is not registered then pass the request as it is to the next handler
    const resource = this.adal.getResourceForEndpoint(req.url);
    if (!resource) {
      return next.handle(req.clone());
    }

    // if the user is not authenticated then drop the request
    if (!this.adal.userInfo.authenticated) {
      throw new Error(
        'Cannot send request to registered endpoint if the user is not authenticated.'
      );
    }

    // if the endpoint is registered then acquire and inject token
    let headers = req.headers || new HttpHeaders();
    return this.adal.acquireToken(resource).pipe(
      mergeMap((token: string) => {
        // inject the header
        headers = headers.append('Authorization', 'Bearer ' + token);
        return next.handle(req.clone({ headers: headers }));
      })
    );
  }
}
