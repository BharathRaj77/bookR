import { Title } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';
import {
  Component,
  HostBinding,
  OnDestroy,
  OnInit,
  AfterViewInit
} from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivationEnd, Router, NavigationEnd } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import {
  ActionAuthLogin,
  ActionAuthLogout,
  selectorAuth,
  routerTransition,
  ConfigService
} from '@app/core';
import { environment as env } from '@env/environment';

import { NIGHT_MODE_THEME, selectorSettings, SettingsState } from './settings';
import { MonitoringService, UserModel, UserService } from './core';

@Component({
  selector: 'anms-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routerTransition]
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  private unsubscribe$: Subject<void> = new Subject<void>();

  @HostBinding('class') componentCssClass;

  isProd = env.production;
  envName = env.envName;
  version = env.versions.app;
  year = new Date().getFullYear();
  logo = require('../assets/logo.png');
  navigation = [
    { link: 'about', label: 'About' },
    { link: 'examples', label: 'Examples' },
    { link: 'todos', label: 'Todos' }
  ];
  navigationSideMenu = [
    ...this.navigation,
    { link: 'settings', label: 'Settings' }
  ];
  isAuthenticated;
  user: UserModel = new UserModel();
  private apiUrl: string;
  constructor(
    public overlayContainer: OverlayContainer,
    private store: Store<any>,
    private router: Router,
    private meta: Meta,
    private titleService: Title,
    private userService: UserService,
    private monitoringService: MonitoringService,
    private configService: ConfigService,
    translate: TranslateService
  ) {
    translate.setDefaultLang('en');
    this.apiUrl = configService.get().apiUrl;
  }

  ngOnInit(): void {
    this.subscribeToSettings();
    this.subscribeToIsAuthenticated();
    this.subscribeToRouterEvents();
    this.monitoringService.start();
  }

  ngAfterViewInit(): void {
    this.setBrowserThemeColor();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onLoginClick() {
    this.store.dispatch(new ActionAuthLogin());
  }

  onLogoutClick() {
    this.store.dispatch(new ActionAuthLogout());
  }

  onChangeLogClick() {
    this.router.navigate(['changelog']);
  }

  // onHealthClick() {
  //   window.open(`${this.apiUrl.replace('/api', '')}/healthchecks-ui`);
  // }

  private subscribeToIsAuthenticated() {
    this.store
      .pipe(
        select(selectorAuth),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(auth => {
        this.isAuthenticated = auth.isAuthenticated;
        if (this.isAuthenticated) {
          this.userService.get().subscribe(u => (this.user = u));
        } else {
          this.user = new UserModel();
        }
      });
  }

  private subscribeToSettings() {
    this.store
      .pipe(
        select(selectorSettings),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(settings => this.setTheme(settings));
  }

  private setTheme(settings: SettingsState) {
    const { theme, autoNightMode } = settings;
    const hours = new Date().getHours();
    const effectiveTheme = (autoNightMode && (hours >= 20 || hours <= 6)
      ? NIGHT_MODE_THEME
      : theme
    ).toLowerCase();
    this.componentCssClass = effectiveTheme;
    const classList = this.overlayContainer.getContainerElement().classList;
    const toRemove = Array.from(classList).filter((item: string) =>
      item.includes('-theme')
    );
    if (toRemove.length) {
      classList.remove(...toRemove);
    }
    classList.add(effectiveTheme);

    window.setTimeout(() => this.setBrowserThemeColor(), 0);
  }

  private subscribeToRouterEvents() {
    this.router.events
      .pipe(
        filter(
          event =>
            event instanceof ActivationEnd || event instanceof NavigationEnd
        ),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(event => {
        if (event instanceof ActivationEnd) {
          this.setPageTitle(event);
        }

        if (event instanceof NavigationEnd) {
          // this.trackPageView(event);
        }
      });
  }

  private setPageTitle(event: ActivationEnd) {
    let lastChild = event.snapshot;
    while (lastChild.children.length) {
      lastChild = lastChild.children[0];
    }
    const { title } = lastChild.data;
    this.titleService.setTitle(
      title ? `${title} - ${env.appName}` : env.appName
    );
  }

  private setBrowserThemeColor() {
    // Updates or creates the meta tag
    const color = getComputedStyle(document.getElementById('theme-primary'))
      .color;
    this.meta.updateTag({ name: 'theme-color', content: color });
  }

  /*private trackPageView(event: NavigationEnd) {
    (<any>window).ga('set', 'page', event.urlAfterRedirects);
    (<any>window).ga('send', 'pageview');
  }*/
}
