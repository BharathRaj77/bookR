import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { TodoItem } from '../models/todos.model';
import { TodosService } from '../services/todos.service';

import {
  TodosActionTypes,
  ActionTodosAdd,
  ActionTodosAdded,
  ActionTodosLoad,
  ActionTodosLoaded,
  ActionTodosEdit,
  ActionTodosToggle,
  ActionTodosRemoveDone
} from './todos.reducer';
import { Page } from '../../shared';

@Injectable()
export class TodosEffects {
  constructor(
    private actions$: Actions<Action>,
    private todosService: TodosService
  ) {}

  @Effect()
  loadTodos$(): Observable<Action> {
    return this.actions$.pipe(
      ofType(TodosActionTypes.LOAD),
      switchMap((action: ActionTodosLoad) => this.todosService.getTodoItems()),
      map((page: Page<TodoItem>) => new ActionTodosLoaded(page.items))
    );
  }

  @Effect()
  addTodo$(): Observable<Action> {
    return this.actions$.pipe(
      ofType(TodosActionTypes.ADD),
      switchMap((action: ActionTodosAdd) =>
        this.todosService.create(action.payload)
      ),
      map((item: TodoItem) => new ActionTodosAdded(item))
    );
  }

  @Effect({ dispatch: false })
  toggleTodo$(): Observable<Action> {
    return this.actions$.pipe(
      ofType(TodosActionTypes.TOGGLE),
      switchMap((action: ActionTodosToggle) => {
        return this.todosService.patch(action.payload, {
          ...action.payload,
          isCompleted: !action.payload.isCompleted
        });
      })
    );
  }

  @Effect({ dispatch: false })
  editTodo$(): Observable<Action> {
    return this.actions$.pipe(
      ofType(TodosActionTypes.EDIT),
      switchMap((action: ActionTodosEdit) => {
        return this.todosService.patch(
          action.payload.source,
          action.payload.updated
        );
      })
    );
  }

  @Effect({ dispatch: false })
  removeTodo$(): Observable<Action> {
    return this.actions$.pipe(
      ofType(TodosActionTypes.REMOVE, TodosActionTypes.REMOVE_DONE),
      switchMap((action: ActionTodosRemoveDone) =>
        this.todosService.removeRange(action.payload)
      )
    );
  }
}
