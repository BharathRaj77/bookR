import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { MockWindowService } from '../../mocks/window.service.mock';
import { IConfiguration } from './configuration';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';

describe('ConfigService', () => {
  const expectedConfig = {
    tenant: '00000002-0000-0000-c000-000000000000',
    clientId: 'clientId',
    endpoints: {
      graph: {
        url: 'https://graph.microsoft.com',
        resourceId: '00000002-0000-0000-c000-000000000000'
      },
      api: {
        resourceId: '00000002-0000-0000-c000-000000000000',
        url: 'https://myapi'
      }
    },
    cacheLocation: 'localStorage',
    apiUrl: 'https://myapi',
    instrumentationKey: '00000002-0000-0000-c000-000000000000'
  } as IConfiguration;
  const mywindow: any = { config: expectedConfig };
  const windowService = new MockWindowService();

  let adalService: {
    init: jasmine.Spy;
  };
  let service: ConfigService;
  let httpClient: HttpClient;
  beforeEach(() => {

    adalService = jasmine.createSpyObj('AdalService', ['init']);
    windowService.set(mywindow);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConfigService]
    });
    httpClient = TestBed.get(HttpClient);
    service = new ConfigService(<any>adalService, httpClient, windowService);

  });

  it('get() should return the config', () => {
    expect(service.get()).toEqual(expectedConfig);
  });

  it('init() should parse the endpoints from the config and initialize ADAL'
  , inject([HttpClient, HttpTestingController]
  , (http: HttpClient, httpMock: HttpTestingController) => {
    service.init().then(function () {
      const req = httpMock.expectOne('/assets/config/config.json');
      expect(req.request.method).toEqual('GET');
      expect(adalService.init).toHaveBeenCalled();
      expect(adalService.init.calls.first().args[0].endpoints).toEqual(
        { 'https://graph.microsoft.com': '00000002-0000-0000-c000-000000000000'
        , 'https://myapi': '00000002-0000-0000-c000-000000000000' });
      req.flush(expectedConfig);
      httpMock.verify();
    });
  }));
});
