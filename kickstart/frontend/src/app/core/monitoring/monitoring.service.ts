import { Injectable } from '@angular/core';
import { Router, ResolveEnd, ActivatedRouteSnapshot } from '@angular/router';
import { filter } from 'rxjs/operators';
import 'applicationinsights-js';
import { WindowService } from '../services/window.service';

import IAppInsights = Microsoft.ApplicationInsights.IAppInsights;
import { ConfigService } from '../config/config.service';

@Injectable()
export class MonitoringService {
  private appInsights: IAppInsights;

  constructor(private router: Router, windowService: WindowService, configService: ConfigService) {
    this.appInsights = (<any>windowService.get()).appInsights;
    this.appInsights.config.instrumentationKey = configService.get().instrumentationKey;
  }

  start() {
    this.router.events
      .pipe(filter(event => event instanceof ResolveEnd))
      .subscribe((event: ResolveEnd) => {
        this.logRoutePageView(event.state.root);
      });
  }

  setAuthenticatedUserId(userId: string): void {
    this.appInsights.setAuthenticatedUserContext(userId);
  }

  private getActivatedRouteSnapshot(
    snapshot: ActivatedRouteSnapshot
  ): ActivatedRouteSnapshot {
    return snapshot.firstChild
      ? this.getActivatedRouteSnapshot(snapshot.firstChild)
      : snapshot;
  }

  private logRoutePageView(snapshot: ActivatedRouteSnapshot) {
    let includeParent = true;
    snapshot = this.getActivatedRouteSnapshot(snapshot);
    let pageView;
    while (includeParent && (pageView = this.getPageViewData(snapshot))) {
      includeParent = !!pageView.includeParent;
      this.logPageView(pageView.name, null, pageView.properties);
      snapshot = snapshot.parent;
    }
  }

  private getPageViewData(snapshot: ActivatedRouteSnapshot): any {
    return snapshot &&
      snapshot.data &&
      snapshot.data.monitoring &&
      snapshot.data.monitoring.pageView
      ? snapshot.data.monitoring.pageView
      : null;
  }

  private addGlobalProperties(properties?: {
    [key: string]: string;
  }): { [key: string]: string } {
    properties = properties || {};

    // add your custom properties such as app version

    return properties;
  }

  public logPageView(
    name: string,
    url?: string,
    properties?: { [key: string]: string },
    measurements?: { [key: string]: number },
    duration?: number
  ) {
    this.appInsights.trackPageView(
      name,
      url,
      this.addGlobalProperties(properties),
      measurements,
      duration
    );
  }

  public logEvent(
    name: string,
    properties?: { [key: string]: string },
    measurements?: { [key: string]: number }
  ) {
    this.appInsights.trackEvent(
      name,
      this.addGlobalProperties(properties),
      measurements
    );
  }

  public logError(
    error: Error,
    properties?: { [key: string]: string },
    measurements?: { [key: string]: number }
  ) {
    this.appInsights.trackException(
      error,
      null,
      this.addGlobalProperties(properties),
      measurements
    );
  }
}
