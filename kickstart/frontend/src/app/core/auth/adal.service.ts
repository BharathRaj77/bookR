import { Injectable } from '@angular/core';
import {
  LocationStrategy,
  HashLocationStrategy,
  Location
} from '@angular/common';
import { Observable, bindCallback } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { JwtHelperService } from '@auth0/angular-jwt';

import * as AuthenticationContext from 'adal-angular';

import {
  ActionAuthLoginCompleted,
  ActionAuthInitialized,
  ActionAuthLoginFailed
} from './auth.reducer';

@Injectable()
export class AdalService {
  private context: AuthenticationContext = <any>null;
  private jwthelper = new JwtHelperService();

  private user = {
    authenticated: false,
    userName: '',
    error: '',
    token: '',
    profile: {}
  };

  private _isInitialized = false;

  constructor(
    private location: Location,
    private locationStrategy: LocationStrategy,
    private store: Store<any>
  ) {}

  public init(configOptions: AuthenticationContext.Options) {
    if (!configOptions) {
      throw new Error('You must set config, when calling init.');
    }

    // redirect and logout_redirect are set to current location by default
    const existingHash = window.location.hash;

    let pathDefault = window.location.origin || window.location.href;
    if (existingHash) {
      pathDefault = pathDefault.replace(existingHash, '');
    }

    configOptions.redirectUri = configOptions.redirectUri || pathDefault;
    configOptions.postLogoutRedirectUri =
      configOptions.postLogoutRedirectUri || pathDefault;
    configOptions.loadFrameTimeout = configOptions.loadFrameTimeout || 10000; // Change the default timeout from 6 to 10 seconds.

    // create instance with given config
    this.context = AuthenticationContext.inject(configOptions);

    (<any>window).AuthenticationContext = this.context.constructor;

    // loginresource is used to set authenticated status
    this.updateDataFromCache(<any>this.context.config.loginResource);
    this._isInitialized = true;

    this.handleWindowCallback();
  }

  public get isInitialized(): boolean {
    return this._isInitialized;
  }

  public get config(): AuthenticationContext.Options {
    return this.context.config;
  }

  public get userInfo(): UserInfo {
    return this.user;
  }

  public login(): void {
    this.context.login();
  }

  public loginInProgress(): boolean {
    return this.context.loginInProgress();
  }

  public logOut(): void {
    this.context.logOut();
  }

  public handleWindowCallback(): void {
    const hash = window.location.hash;
    let _adal = (<any>window)._adalInstance;

    if (_adal.isCallback(hash)) {
      let isPopup = false;

      if (
        _adal._openedWindows.length > 0 &&
        _adal._openedWindows[_adal._openedWindows.length - 1].opener &&
        _adal._openedWindows[_adal._openedWindows.length - 1].opener
          ._adalInstance
      ) {
        _adal =
          _adal._openedWindows[_adal._openedWindows.length - 1].opener
            ._adalInstance;
        isPopup = true;
      } else if (window.parent && (<any>window.parent)._adalInstance) {
        _adal = (<any>window.parent)._adalInstance;
      }

      const requestInfo = _adal.getRequestInfo(hash);
      _adal.saveTokenFromHash(requestInfo);

      // Return to callback if it is sent from iframe
      const token =
        requestInfo.parameters['access_token'] ||
        requestInfo.parameters['id_token'];
      const error = requestInfo.parameters['error'];
      const errorDescription = requestInfo.parameters['error_description'];
      let tokenType = null;
      const callback =
        _adal._callBackMappedToRenewStates[requestInfo.stateResponse] ||
        _adal.callback;

      if (requestInfo.stateMatch) {
        if (requestInfo.requestType === _adal.REQUEST_TYPE.RENEW_TOKEN) {
          tokenType = _adal.CONSTANTS.ACCESS_TOKEN;
          _adal._renewActive = false;
        } else if (requestInfo.requestType === _adal.REQUEST_TYPE.LOGIN) {
          tokenType = _adal.CONSTANTS.ID_TOKEN;
          this.updateDataFromCache(_adal.config.loginResource);

          if (this.user.userName) {
            this.store.dispatch(new ActionAuthLoginCompleted()); // Dispatch an event indicating that the login flow has completed.
          } else {
            this.store.dispatch(new ActionAuthLoginFailed());
          }
        }

        if (callback && typeof callback === 'function') {
          callback(errorDescription, token, error, tokenType);
        }

        // since this is a token renewal request in iFrame, we don't need to proceed with the location change.
        if (window.parent !== window) {
          // in iframe
          if (event && event.preventDefault) {
            event.preventDefault();
          }
          return;
        }

        // redirect to login start page
        if (window.parent === window && !isPopup) {
          if (_adal.config.navigateToLoginRequestUrl) {
            const loginStartPage = _adal._getItem(
              _adal.CONSTANTS.STORAGE.LOGIN_REQUEST
            );
            if (
              typeof loginStartPage !== 'undefined' &&
              loginStartPage &&
              loginStartPage.length !== 0
            ) {
              // prevent the current location change and redirect the user back to the login start page
              _adal.verbose('Redirecting to start page: ' + loginStartPage);
              if (
                this.locationStrategy instanceof HashLocationStrategy &&
                loginStartPage.indexOf('#') > -1
              ) {
                this.location.go(
                  loginStartPage.substring(loginStartPage.indexOf('#') + 1)
                );
              }

              window.location.href = loginStartPage;
            }
          } else {
            // resetting the hash to null
            if (window.location.hash) {
              if (window.history.replaceState) {
                window.history.replaceState('', '/', window.location.pathname);
              } else {
                window.location.hash = '';
              }
            }
          }
        }
      }
    } else {
      // When handleWindowCallback is being called, but no actual action was performed because there was none pending,
      // indicate that ADAL has been initialized in order to try and reauthenticate a previous user.
      this.store.dispatch(new ActionAuthInitialized());
    }
  }

  public getCachedToken(resource: string): string | null {
    return this.context.getCachedToken(resource);
  }

  public acquireToken(resource: string) {
    const _this = this; // save outer this for inner function
    let errorMessage: string;

    return bindCallback(acquireTokenInternal)().pipe(
      map((token: any) => {
        if (!token && errorMessage) {
          throw errorMessage;
        }

        return token;
      })
    );

    function acquireTokenInternal(cb: any) {
      let s: any = null;

      _this.context.acquireToken(
        resource,
        (error: string, tokenOut: string) => {
          if (error) {
            _this.context.error(
              'Error when acquiring token for resource: ' + resource,
              error
            );
            errorMessage = error;
            cb(<any>null);
          } else {
            cb(tokenOut);
            s = tokenOut;
          }
        }
      );
      return s;
    }
  }

  public getUser(): Observable<any> {
    const _this = this; // save outer this for inner function

    return bindCallback((cb: any) => {
      _this.context.getUser(function(error: string, user: any) {
        if (error) {
          _this.context.error('Error when getting user', error);
          cb(null);
        } else {
          cb(user);
        }
      });
    })();
  }

  public clearCache(): void {
    this.context.clearCache();
  }

  public clearCacheForResource(resource: string): void {
    this.context.clearCacheForResource(resource);
  }

  public info(message: string): void {
    this.context.info(message);
  }

  public verbose(message: string): void {
    this.context.verbose(message);
  }

  public getResourceForEndpoint(url: string): string {
    if (url) {
      const resource = this.context.getResourceForEndpoint(url);
      if (!resource) {
        return this.config.clientId;
      }

      return resource;
    }

    return null;
  }

  public refreshDataFromCache() {
    this.updateDataFromCache(<any>this.context.config.loginResource);
  }

  private updateDataFromCache(resource: string): void {
    let token = this.context.getCachedToken(resource);
    if (token && this.jwthelper.isTokenExpired(token)) {
      token = '';
    }
    this.user.authenticated = !!token;
    const user = this.context.getCachedUser() || {
      userName: '',
      profile: <any>undefined
    };
    if (user.userName) {
      this.user.userName = user.userName;
      this.user.profile = user.profile;
      this.user.token = token;
    } else {
      this.user.userName = '';
      this.user.profile = {};
      this.user.token = '';
    }

    this.user.error = this.context.getLoginError();
  }
}

export interface UserInfo extends AuthenticationContext.UserInfo {
  authenticated: boolean;
  error: string;
  token: string;
}
