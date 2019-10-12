import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { retry, catchError } from 'rxjs/operators'
import { User } from '../Model/user';
import { Library } from '../Model/library';
import { Books } from '../Model/books';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BookServiceService {

  constructor(private httpclient: HttpClient) { }

  public createLibrary(user: any) {
    const serverurl = "";
    return this.httpclient.post(serverurl, user)
      .pipe(retry(2), catchError(this.handleError));

  }
  public getbooks() {
    const serverurl = "";
    return this.httpclient.get(serverurl)
      .pipe(retry(2), catchError(this.handleError));
  }
  public insertbooks(books: any) {
    const serverurl = "";
    return this.httpclient.post(serverurl, books)
      .pipe(retry(2), catchError(this.handleError));
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    }
  }

}


