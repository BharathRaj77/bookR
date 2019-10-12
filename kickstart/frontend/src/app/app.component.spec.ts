import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@app/shared';
import { CoreModule } from '@app/core';
import { AppComponent } from './app.component';
import { ConfigService } from './core/config/config.service';
import { MockConfigService } from './mocks/config.service.mock';
import { WindowService } from './core/services/window.service';

xdescribe('AppComponent', () => {
  const appInsights = {
    config: {
      instrumentationKey: ''
    }
  } as Microsoft.ApplicationInsights.IAppInsights;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterTestingModule,
        SharedModule,
        CoreModule
      ],
      declarations: [AppComponent],
      providers: [
        { provide: ConfigService, useValue: new MockConfigService() }
        , { provide: WindowService, useValue: { get: function () { return { appInsights: appInsights }; } } }
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
