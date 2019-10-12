import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';

import { ConfigService, WindowService } from '../../core';
import { MockConfigService } from '../../mocks/config.service.mock';

import { ExamplesModule } from '../examples.module';
import { StockMarketComponent } from './stock-market.component';
import { MockWindowService } from '../../mocks/window.service.mock';

describe('StockMarketComponent', () => {
  let mockConfigService: MockConfigService;
  let component: StockMarketComponent;
  let fixture: ComponentFixture<StockMarketComponent>;

  beforeEach(async(() => {
    mockConfigService = new MockConfigService();
    mockConfigService.set({ apiUrl: '' });

    TestBed.configureTestingModule({
      providers: [
        { provide: WindowService, useValue: new MockWindowService() },
        { provide: ConfigService, useValue: mockConfigService }
      ],
      imports: [
        RouterTestingModule,
        NoopAnimationsModule,
        CoreModule,
        SharedModule,
        ExamplesModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
