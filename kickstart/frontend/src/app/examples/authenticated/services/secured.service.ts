import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfigService } from '../../../core';

@Injectable()
export class SecuredService {
  private apiUrl: string;

  constructor(private http: HttpClient, configService: ConfigService) {
    this.apiUrl = configService.get().apiUrl;
  }

  private execute(name: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/secured/${name}`).pipe(
      catchError(r => {
        return of([r.message]);
      }),
      map(value => value.toString())
    );
  }

  checkAdmin(): Observable<string> {
    return this.execute('chka');
  }

  checkEditor(): Observable<string> {
    return this.execute('chke');
  }

  checkUser(): Observable<string> {
    return this.execute('chku');
  }

  checkCustom(): Observable<string> {
    return this.execute('chkc');
  }
}
