import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, BehaviorSubject, of, merge } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

import { TodoItem, TodoItemFilter } from '../models/todos.model';
import { TodosService } from '../services/todos.service';
import { Page } from '../../shared';

export class TodoDataSource extends DataSource<TodoItem> {
  private todosSubject = new BehaviorSubject<TodoItem[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private filterSubject = new BehaviorSubject<TodoItemFilter>({});

  paginator: MatPaginator;
  sort: MatSort;

  loading$ = this.loadingSubject.asObservable();
  filter$ = this.filterSubject.asObservable();
  data: Page<TodoItem>;

  constructor(private todosService: TodosService) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<TodoItem[]> {
    return this.todosSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.todosSubject.complete();
    this.loadingSubject.complete();
    this.filterSubject.complete();
  }

  loadPage(sortDirection = '', page = 1, pageSize = 10) {
    this.loadingSubject.next(true);

    this.todosService
      .getTodoItems(
        this.filterSubject.getValue(),
        sortDirection,
        page,
        pageSize
      )
      .pipe(
        catchError(() =>
          of<Page<TodoItem>>({
            items: [],
            index: page,
            size: pageSize,
            totalItems: 0,
            totalPages: 0
          })
        ),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(data => {
        this.data = data;
        this.paginator.length = this.data.totalItems;

        this.todosSubject.next(data.items);
      });
  }

  updateFilter(filter: TodoItemFilter) {
    this.filterSubject.next(filter);
  }

  autoUpdate() {
    // When changing sort order or filter, reset paging
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.filter$.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page, this.filter$)
      .pipe(
        tap(() => {
          let sortDirection = '';
          if (this.sort.active) {
            sortDirection = `${this.sort.direction === 'desc' ? '-' : ''}${
              this.sort.active
            }`;
          }

          this.loadPage(
            sortDirection,
            this.paginator.pageIndex + 1,
            this.paginator.pageSize
          );
        })
      )
      .subscribe();
  }
}
