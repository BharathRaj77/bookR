import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  selectorSettings,
  ActionSettingsChangeTheme,
  ActionSettingsChangeAutoNightMode,
  SettingsState,
  ActionSettingsPersist
} from '../settings.reducer';

@Component({
  selector: 'anms-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();
  settings: SettingsState;

  themes = [
    { value: 'DEFAULT-THEME', label: 'Blue' },
    { value: 'LIGHT-THEME', label: 'Light' },
    { value: 'NATURE-THEME', label: 'Nature' },
    { value: 'BLACK-THEME', label: 'Dark' },
    { value: 'UCBBLUE-THEME', label: 'UCB Blue' },
    { value: 'UCBPINK-THEME', label: 'UCB Pink' },
    { value: 'UCBPURPLE-THEME', label: 'UCB Purple' },
    { value: 'UCBORANGE-THEME', label: 'UCB Orange' }
  ];

  constructor(private store: Store<any>) {
    store
      .pipe(
        select(selectorSettings),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(settings => (this.settings = settings));
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onThemeSelect({ value: theme }) {
    this.store.dispatch(new ActionSettingsChangeTheme({ theme }));
    this.store.dispatch(new ActionSettingsPersist({ settings: this.settings }));
  }

  onAutoNightModeSelect({ value: autoNightMode }) {
    this.store.dispatch(
      new ActionSettingsChangeAutoNightMode({
        autoNightMode: autoNightMode === 'true'
      })
    );
    this.store.dispatch(new ActionSettingsPersist({ settings: this.settings }));
  }
}
