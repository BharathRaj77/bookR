import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IWindowService, WindowService } from '../services/window.service';
import { IConfiguration } from './configuration';

@Injectable()
export class ConfigService {
  private config: IConfiguration;

  constructor(
    private http: HttpClient,
    @Inject(WindowService) windowService: IWindowService | undefined
  ) {
    windowService = windowService || new WindowService();
    this.config = (<any>windowService.get()).config;
  }

  async loadAppConfig() {}

  init() {
    return new Promise((resolve, reject) => {
      this.http
        .get('/assets/config/config.json')
        .toPromise()
        .then((data: IConfiguration) => {
          this.config = data;
          resolve();
        });
    });
  }

  get(): IConfiguration {
    return this.config;
  }
}
