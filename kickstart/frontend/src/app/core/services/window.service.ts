import { Injectable } from '@angular/core';

export interface IWindowService {
  get(): Window;
}

@Injectable()
export class WindowService implements IWindowService {
  get(): Window {
    return window;
  }
}
