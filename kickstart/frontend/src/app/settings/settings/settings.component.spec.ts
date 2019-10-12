import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';

import { SettingsComponent } from './settings.component';
import { ConfigService } from '../../core/config/config.service';
import { MockConfigService } from '../../mocks/config.service.mock';
import { MockWindowService } from '../../mocks/window.service.mock';
import { WindowService } from '../../core';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterTestingModule,
        CoreModule,
        SharedModule
      ],
      declarations: [SettingsComponent],
      providers: [
        { provide: WindowService, useValue: new MockWindowService() },
        { provide: ConfigService, useValue: new MockConfigService() }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
