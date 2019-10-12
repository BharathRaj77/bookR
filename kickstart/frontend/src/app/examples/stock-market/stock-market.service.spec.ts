import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CoreModule } from '@app/core';

import { StockMarketService } from './stock-market.service';
import { ConfigService } from '../../core/config/config.service';
import { MockConfigService } from '../../mocks/config.service.mock';
import { WindowService } from '../../core/services/window.service';
import { MockWindowService } from '../../mocks/window.service.mock';

describe('StockMarketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, CoreModule],
      providers: [
        StockMarketService,
        { provide: WindowService, useValue: new MockWindowService() },
        { provide: ConfigService, useValue: new MockConfigService() }
      ]
    });
  });

  it('should be created', inject(
    [StockMarketService],
    (service: StockMarketService) => {
      expect(service).toBeTruthy();
    }
  ));
});
