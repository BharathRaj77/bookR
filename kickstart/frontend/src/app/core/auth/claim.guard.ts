import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

import { AdalService } from './adal.service';
import { ConfigService } from '../config/config.service';
import { map } from 'rxjs/operators';

@Injectable()
export class ClaimGuard implements CanActivate {
  private tokenHelper;

  constructor(
    private adalService: AdalService,
    private configService: ConfigService
  ) {
    this.tokenHelper = new JwtHelperService();
  }

  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    if (!this.adalService.userInfo.authenticated) {
      return of(false);
    }

    const endpoint = this.configService.get().apiUrl;
    const resource = this.adalService.getResourceForEndpoint(endpoint);

    return this.adalService.acquireToken(resource).pipe(
      map(token => {
        const decodedToken = this.tokenHelper.decodeToken(token);
        return this.checkClaims(next.data.claims, decodedToken);
      })
    );
  }

  private checkClaims(requiredClaims: any, userClaims: any): boolean {
    for (const key in requiredClaims) {
      if (!requiredClaims.hasOwnProperty(key)) {
        continue;
      }

      const userValues = userClaims[key];
      const requiredValues = requiredClaims[key];
      if (!this.checkValues(userValues, requiredValues)) {
        return false;
      }
    }

    return true;
  }

  private checkValues(userValues: any, requiredValues: any) {
    if (userValues === undefined || userValues === null) {
      return false;
    }

    if (Array.isArray(requiredValues) && Array.isArray(requiredValues)) {
      return requiredValues.some(requiredValue =>
        userValues.some(userValue => userValue === requiredValue)
      );
    }

    if (Array.isArray(requiredValues)) {
      return requiredValues.some(requiredValue => userValues === requiredValue);
    }

    if (Array.isArray(userValues)) {
      return userValues.some(userValue => userValue === requiredValues);
    }

    return requiredValues === userValues;
  }
}
