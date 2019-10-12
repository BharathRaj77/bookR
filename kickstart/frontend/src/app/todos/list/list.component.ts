import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store, select } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ANIMATE_ON_ROUTE_ENTER } from '@app/core';

import {
  ActionTodosAdd,
  ActionTodosFilter,
  ActionTodosRemoveDone,
  ActionTodosToggle,
  selectorTodos,
  TodosFilter,
  ActionTodosLoad,
  TodosState
} from '../effects/todos.reducer';
import { TodoItem } from '../models/todos.model';

@Component({
  selector: 'anms-todos',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class TodosListComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();

  animateOnRouteEnter = ANIMATE_ON_ROUTE_ENTER;
  todos: TodosState;
  newTodo = '';

  constructor(public store: Store<TodosState>, public snackBar: MatSnackBar) {
    this.store
      .pipe(
        select(selectorTodos),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(todos => (this.todos = todos));
  }

  ngOnInit() {
    this.store.dispatch(new ActionTodosLoad());
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get filteredTodos() {
    const filter = this.todos.filter;
    if (filter === 'ALL') {
      return this.todos.items;
    }

    const predicate =
      filter === 'DONE' ? t => t.isCompleted : t => !t.isCompleted;
    return this.todos.items.filter(predicate);
  }

  get isAddTodoDisabled() {
    return this.newTodo.length < 4;
  }

  get isRemoveDoneTodosDisabled() {
    return this.todos.items.filter(item => item.isCompleted).length === 0;
  }

  onNewTodoChange(newTodo: string) {
    this.newTodo = newTodo;
  }

  onNewTodoClear() {
    this.newTodo = '';
  }

  onAddTodo() {
    this.store.dispatch(new ActionTodosAdd({ title: this.newTodo }));
    this.showNotification(`"${this.newTodo}" added`);
    this.newTodo = '';
  }

  onToggleTodo(todo: TodoItem) {
    const newStatus = todo.isCompleted ? 'active' : 'done';
    this.store.dispatch(new ActionTodosToggle(todo));
    this.showNotification(`Toggled "${todo.title}" to ${newStatus}`, 'Undo')
      .onAction()
      .subscribe(() =>
        this.onToggleTodo({ ...todo, isCompleted: !todo.isCompleted })
      );
  }

  onRemoveDoneTodos() {
    this.store.dispatch(
      new ActionTodosRemoveDone(
        this.todos.items.filter(t => t.isCompleted).map(t => t.id)
      )
    );
    this.showNotification('Removed done todos');
  }

  onFilterTodos(filter: TodosFilter) {
    this.store.dispatch(new ActionTodosFilter({ filter }));
    this.showNotification(`Filtered to ${filter.toLowerCase()}`);
  }

  private showNotification(message: string, action?: string) {
    return this.snackBar.open(message, action, {
      duration: 2500,
      panelClass: 'todos-notification-overlay'
    });
  }
}
