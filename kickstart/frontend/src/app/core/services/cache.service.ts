import { Injectable } from '@angular/core';

@Injectable()
export class CacheService {
  private keyPathToString(keyPath: string | string[]) {
    return Array.isArray(keyPath) ? keyPath.join('\uFFFA') : keyPath;
  }

  public get(keyPath: string | string[]) {
    keyPath = this.keyPathToString(keyPath);
    const value = sessionStorage.getItem(keyPath);
    if (value === null) {
      return undefined;
    }

    return JSON.parse(value);
  }

  public set(keyPath: string | string[], value: any) {
    keyPath = this.keyPathToString(keyPath);
    return sessionStorage.setItem(keyPath, JSON.stringify(value));
  }
}
