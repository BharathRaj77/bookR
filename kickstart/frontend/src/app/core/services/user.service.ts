import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { AdalService, UserInfo } from '../auth/adal.service';
import { ConfigService } from '../config/config.service';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../models/user.model';

@Injectable()
export class UserService {
  private tokenHelper;

  constructor(
    private adalService: AdalService,
    private configService: ConfigService,
    private http: HttpClient
  ) {
    this.tokenHelper = new JwtHelperService();
  }

  public get(): Observable<UserModel> {
    return this.http.get<UserModel>('https://graph.microsoft.com/v1.0/me').pipe(
      map(u => {
        u.displayName = u.displayName || (u.givenName + ' ' + u.surname).trim();
        u.mail = u.mail || u.userPrincipalName.toLocaleLowerCase();
        u.preferredLanguage = u.preferredLanguage || 'en';
        return u;
      })
    );
  }

  public hasRole(roles: string | string[]): Observable<boolean> {
    return this.getRoles().pipe(
      map(userRoles => {
        if (!userRoles) {
          return false;
        }
        if (typeof roles === 'string') {
          return userRoles.some(userRole => userRole === roles);
        }
        return roles.some(roleName =>
          userRoles.some(userRole => userRole === roleName)
        );
      })
    );
  }

  public getRoles(): Observable<string[]> {
    const endpoint = this.configService.get().apiUrl;
    const resource = this.adalService.getResourceForEndpoint(endpoint);
    return this.adalService.acquireToken(resource).pipe(
      map(token => {
        const decodedToken = this.tokenHelper.decodeToken(token);
        return decodedToken.roles;
      })
    );
  }
}
