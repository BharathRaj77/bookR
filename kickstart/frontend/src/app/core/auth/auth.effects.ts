import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { of, Observable } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { LocalStorageService } from '../local-storage/local-storage.service';

import { AdalService } from './adal.service';
import {
  AUTH_KEY,
  AuthActionTypes,
  ActionAuthLoginSucceeded,
  ActionAuthLoginFailed,
  ActionAuthRefreshIdToken,
  ActionAuthLoginCompleted
} from './auth.reducer';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions<Action>,
    private localStorageService: LocalStorageService,
    private adalService: AdalService
  ) {}

  @Effect()
  initialized$(): Observable<Action> {
    return this.actions$.pipe(
      ofType(AuthActionTypes.INITIALIZED),
      map(action => {
        if (this.adalService.userInfo.authenticated) {
          return new ActionAuthLoginSucceeded();
        }

        return new ActionAuthRefreshIdToken();
      })
    );
  }

  @Effect()
  refreshIdToken$(): Observable<Action> {
    return this.actions$.pipe(
      ofType(AuthActionTypes.REFRESH_ID_TOKEN),
      switchMap(action =>
        this.adalService.acquireToken(this.adalService.config.clientId)
      ),
      tap(response => this.adalService.refreshDataFromCache()),
      map(next => new ActionAuthLoginCompleted()),
      catchError(err => of(new ActionAuthLoginFailed()))
    );
  }

  @Effect()
  loginCompleted$(): Observable<Action> {
    return this.actions$.pipe(
      ofType(AuthActionTypes.LOGIN_COMPLETED),
      map(response => {
        if (this.adalService.userInfo.authenticated) {
          return new ActionAuthLoginSucceeded();
        }

        return new ActionAuthLoginFailed();
      }),
      catchError(err => of(new ActionAuthLoginFailed()))
    );
  }

  @Effect({ dispatch: false })
  login(): Observable<Action> {
    return this.actions$.pipe(
      ofType(AuthActionTypes.LOGIN),
      tap(action => this.adalService.login())
    );
  }

  @Effect({ dispatch: false })
  loginSucceeded(): Observable<Action> {
    return this.actions$.pipe(
      ofType(AuthActionTypes.LOGIN_SUCCEEDED),
      tap(action =>
        this.localStorageService.setItem(AUTH_KEY, { isAuthenticated: true })
      )
    );
  }

  @Effect({ dispatch: false })
  logout(): Observable<Action> {
    return this.actions$.pipe(
      ofType(AuthActionTypes.LOGOUT),
      tap(action => {
        this.localStorageService.setItem(AUTH_KEY, { isAuthenticated: false });
        this.adalService.logOut();
      })
    );
  }
}
