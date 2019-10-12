import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, combineLatest, of } from 'rxjs';
import { compare } from 'fast-json-patch';

import { ConfigService } from '../../core';
import { TodoItem, NewTodoItem, TodoItemFilter } from '../models/todos.model';
import { Page } from '../../shared';

@Injectable()
export class TodosService {
  private apiUrl: string;

  constructor(private http: HttpClient, configService: ConfigService) {
    this.apiUrl = configService.get().apiUrl;
  }

  getTodoItems(
    filter: TodoItemFilter = {},
    sortDirection = '',
    page = 1,
    pageSize = 10
  ): Observable<Page<TodoItem>> {
    let params = new HttpParams();
    if (filter) {
      if (filter.title) {
        params = params.set('title', filter.title);
      }

      if (filter.description) {
        params = params.set('description', filter.description);
      }

      if (filter.isCompleted !== undefined && filter.isCompleted !== null) {
        params = params.set(
          'isCompleted',
          filter.isCompleted ? 'true' : 'false'
        );
      }
    }

    if (sortDirection) {
      params = params.set('sort', sortDirection);
    }

    params = params.set('page', page.toString());
    params = params.set('pageSize', pageSize.toString());

    return this.http.get<Page<TodoItem>>(`${this.apiUrl}/todoItems`, {
      params
    });
  }

  create(todoItem: NewTodoItem): Observable<TodoItem> {
    return this.http.post<TodoItem>(`${this.apiUrl}/todoItems`, todoItem);
  }

  patch(source: TodoItem, updated: TodoItem): Observable<any> {
    const diff = compare(source, updated);
    if (diff && diff.length > 0) {
      return this.http.patch(`${this.apiUrl}/todoItems/${source.id}`, diff);
    }

    return of({});
  }

  removeRange(idList: string[]): Observable<any> {
    let combinedObservable: Observable<any> = of({});
    for (const id of idList) {
      const delete$ = this.http.delete(`${this.apiUrl}/todoItems/${id}`);
      combinedObservable = combineLatest(combinedObservable, delete$);
    }

    return combinedObservable;
  }
}
