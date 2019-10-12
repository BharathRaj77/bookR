import { NgModule, Optional, SkipSelf, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { MetaReducer, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { storeFreeze } from 'ngrx-store-freeze';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { environment } from '@env/environment';

import { debug } from './meta-reducers/debug.reducer';
import { initStateFromLocalStorage } from './meta-reducers/init-state-from-local-storage.reducer';
import { LocalStorageService } from './local-storage/local-storage.service';
import { authReducer } from './auth/auth.reducer';
import { AuthEffects } from './auth/auth.effects';
import { AdalService } from './auth/adal.service';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AdalGuard } from './auth/adal.guard';
import { ClaimGuard } from './auth/claim.guard';
import { RoleGuard } from './auth/role.guard';
import { ConfigService } from './config/config.service';
import { WindowService } from './services/window.service';
import { UserService } from './services/user.service';
import { AssetsService } from './services/assets.service';
import { CacheService } from './services/cache.service';
import { MonitoringService } from './monitoring/monitoring.service';
import { MonitoringErrorHandler } from './monitoring/error.handler';

export const metaReducers: MetaReducer<any>[] = [initStateFromLocalStorage];

export function initConfiguration(configService: ConfigService) {
  return () => configService.init();
}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

if (!environment.production) {
  metaReducers.unshift(debug, storeFreeze);
}

@NgModule({
  imports: [
    // angular
    CommonModule,
    HttpClientModule,

    // ngrx
    StoreModule.forRoot(
      {
        auth: authReducer
      },
      { metaReducers }
    ),
    EffectsModule.forRoot([AuthEffects]),

    // ngx-translate
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [],
  providers: [
    LocalStorageService,
    WindowService,
    MonitoringService,
    CacheService,
    AdalService,
    AdalGuard,
    ClaimGuard,
    RoleGuard,
    ConfigService,
    UserService,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfiguration,
      deps: [ConfigService, AdalService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      deps: [AdalService],
      multi: true
    }
  ]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}
