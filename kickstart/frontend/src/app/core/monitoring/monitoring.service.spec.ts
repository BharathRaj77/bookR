import { TestBed, inject } from '@angular/core/testing';
import { MonitoringService } from './monitoring.service';
import { WindowService } from '../services/window.service';
import { RouterTestingModule } from '@angular/router/testing';
import 'applicationinsights-js';
import { ConfigService } from '../config/config.service';
import { MockConfigService } from '../../mocks/config.service.mock';
describe('MonitoringService', () => {
  const appInsights = {
    config: {
      instrumentationKey: ''
    }
  } as Microsoft.ApplicationInsights.IAppInsights;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        MonitoringService
        , { provide: WindowService, useValue: { get: function () { return { appInsights: appInsights }; } } }
        , { provide: ConfigService, useValue: new MockConfigService() }
      ]
    });
  });

  it('should be created', inject(
    [MonitoringService],
    (service: MonitoringService) => {
      expect(service).toBeTruthy();
    }
  ));
});
