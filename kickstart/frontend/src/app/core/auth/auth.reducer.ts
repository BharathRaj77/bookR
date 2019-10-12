import { Action } from '@ngrx/store';

export const AUTH_KEY = 'AUTH';

export enum AuthActionTypes {
  INITIALIZED = '[Auth] Initialized',
  REFRESH_ID_TOKEN = '[Auth] Refresh ID token',
  LOGIN = '[Auth] Login',
  LOGIN_COMPLETED = '[Auth] Login Completed',
  LOGIN_SUCCEEDED = '[Auth] Login Succeeded',
  LOGIN_FAILED = '[Auth] Login Failed',
  LOGOUT = '[Auth] Logout'
}

export class ActionAuthInitialized implements Action {
  readonly type = AuthActionTypes.INITIALIZED;
}

export class ActionAuthLogin implements Action {
  readonly type = AuthActionTypes.LOGIN;
}

export class ActionAuthLoginCompleted implements Action {
  readonly type = AuthActionTypes.LOGIN_COMPLETED;
}

export class ActionAuthLoginSucceeded implements Action {
  readonly type = AuthActionTypes.LOGIN_SUCCEEDED;
}

export class ActionAuthLoginFailed implements Action {
  readonly type = AuthActionTypes.LOGIN_FAILED;
}

export class ActionAuthLogout implements Action {
  readonly type = AuthActionTypes.LOGOUT;
}

export class ActionAuthRefreshIdToken implements Action {
  readonly type = AuthActionTypes.REFRESH_ID_TOKEN;
}

export type AuthActions =
  | ActionAuthInitialized
  | ActionAuthLogin
  | ActionAuthLoginCompleted
  | ActionAuthLoginSucceeded
  | ActionAuthLoginFailed
  | ActionAuthLogout
  | ActionAuthRefreshIdToken;

export const initialState: AuthState = {
  isAuthenticated: false
};

export const selectorAuth = state => state.auth;

export function authReducer(
  state: AuthState = initialState,
  action: AuthActions
): AuthState {
  switch (action.type) {
    case AuthActionTypes.LOGIN_SUCCEEDED:
      return { ...state, isAuthenticated: true };

    case AuthActionTypes.LOGIN_FAILED:
    case AuthActionTypes.LOGOUT:
      return { ...state, isAuthenticated: false };

    default:
      return state;
  }
}

export interface AuthState {
  isAuthenticated: boolean;
}
