import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AdalService } from './adal.service';
import { ActionAuthLogin } from './auth.reducer';

@Injectable()
export class AdalGuard implements CanActivate {
  constructor(private adalService: AdalService, private store: Store<any>) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (next && next.data && next.data.redirectToLogin) {
      if (this.adalService.userInfo.authenticated) {
        return true;
      }

      this.store.dispatch(new ActionAuthLogin());
      return false;
    }

    return this.adalService.userInfo.authenticated;
  }
}
