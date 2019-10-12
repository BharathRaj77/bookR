import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { AdalService } from './adal.service';
import { ConfigService } from '../config/config.service';
import { ClaimGuard } from './claim.guard';

@Injectable()
export class RoleGuard extends ClaimGuard {
  constructor(adalService: AdalService, configService: ConfigService) {
    super(adalService, configService);
  }

  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    next.data = {
      claims: {
        roles: next.data.roles
      }
    };

    return super.canActivate(next, state);
  }
}
