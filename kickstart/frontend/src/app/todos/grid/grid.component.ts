import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import { ANIMATE_ON_ROUTE_ENTER } from '@app/core';

import {
  ActionTodosAdd,
  ActionTodosRemove,
  TodosState
} from '../effects/todos.reducer';
import { TodoDataSource } from './grid.datasource';
import { TodosService } from '../services/todos.service';
import { EditTodoComponent } from '../edit/edit.component';
import { TodoItemFilter } from '../models/todos.model';

@Component({
  selector: 'anms-todos-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['grid.component.scss']
})
export class TodosGridComponent implements OnInit, OnDestroy, AfterViewInit {
  private unsubscribe$: Subject<void> = new Subject<void>();

  animateOnRouteEnter = ANIMATE_ON_ROUTE_ENTER;
  displayColumns = ['select', 'title', 'description', 'isCompleted'];

  filter: TodoItemFilter = {
    isCompleted: null
  };
  todoDataSource: TodoDataSource;
  selection = new SelectionModel(true, []);
  validPageSizes = [10, 20, 50, 100];

  todoForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl()
  });

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private store: Store<TodosState>,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    todosService: TodosService
  ) {
    this.todoDataSource = new TodoDataSource(todosService);
  }

  ngOnInit() {
    this.todoDataSource.loadPage();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngAfterViewInit() {
    this.todoDataSource.paginator = this.paginator;
    this.todoDataSource.sort = this.sort;
    this.todoDataSource.autoUpdate();
  }

  toggleIsCompleted() {
    this.filter.isCompleted =
      this.filter.isCompleted == null
        ? true
        : this.filter.isCompleted
          ? false
          : null;
  }

  applyFilter() {
    this.todoDataSource.updateFilter(this.filter);
  }

  resetFilter() {
    this.filter = {
      isCompleted: null
    };
  }

  onSubmit() {
    if (this.todoForm.valid) {
      const todoItem = this.todoForm.value;
      this.store.dispatch(new ActionTodosAdd(todoItem));

      this.resetForm();
      this.showNotification(`"${todoItem.title}" added`);
    }
  }

  resetForm() {
    this.todoForm.reset();
  }

  edit() {
    const ref = this.dialog.open(EditTodoComponent, {
      width: '30vw',
      data: this.selection.selected[0]
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.showNotification('Changes made to the todo item have been saved!');
      }

      this.selection.clear();
    });
  }

  removeSelected() {
    const selectionLength = this.selection.selected.length;
    const message = `Removed ${selectionLength} todo item${
      selectionLength === 1 ? '' : 's'
      }.`;

    this.store.dispatch(
      new ActionTodosRemove(this.selection.selected.map(x => x.id))
    );
    this.selection.clear();

    this.showNotification(message);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.todoDataSource.data.items.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.todoDataSource.data.items.forEach(row =>
        this.selection.select(row)
      );
  }

  private showNotification(message: string, action?: string) {
    return this.snackBar.open(message, action, {
      duration: 2500
    });
  }
}
