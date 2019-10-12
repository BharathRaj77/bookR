import { Action } from '@ngrx/store';

import { TodoItem, NewTodoItem } from '../models/todos.model';

export enum TodosActionTypes {
  LOAD = '[Todos] Load',
  LOAD_SUCCESS = '[Todos] Load succeeded',
  ADD = '[Todos] Add',
  ADDED = '[Todos] Added',
  EDIT = '[Todos] Edit',
  TOGGLE = '[Todos] Toggle',
  REMOVE = '[Todos] Remove',
  REMOVE_DONE = '[Todos] Remove Done',
  FILTER = '[Todos] Filter'
}

export class ActionTodosLoad implements Action {
  readonly type = TodosActionTypes.LOAD;
}

export class ActionTodosLoaded implements Action {
  readonly type = TodosActionTypes.LOAD_SUCCESS;
  constructor(public payload: TodoItem[]) {}
}

export class ActionTodosAdd implements Action {
  readonly type = TodosActionTypes.ADD;
  constructor(public payload: NewTodoItem) {}
}

export class ActionTodosAdded implements Action {
  readonly type = TodosActionTypes.ADDED;
  constructor(public payload: TodoItem) {}
}

export class ActionTodosEdit implements Action {
  readonly type = TodosActionTypes.EDIT;
  constructor(public payload: { source: TodoItem; updated: TodoItem }) {}
}

export class ActionTodosToggle implements Action {
  readonly type = TodosActionTypes.TOGGLE;
  constructor(public payload: TodoItem) {}
}

export class ActionTodosRemove implements Action {
  readonly type = TodosActionTypes.REMOVE;
  constructor(public payload: string[]) {}
}

export class ActionTodosRemoveDone implements Action {
  readonly type = TodosActionTypes.REMOVE_DONE;
  constructor(public payload: string[]) {}
}

export class ActionTodosFilter implements Action {
  readonly type = TodosActionTypes.FILTER;
  constructor(public payload: { filter: TodosFilter }) {}
}

export type TodosActions =
  | ActionTodosLoad
  | ActionTodosLoaded
  | ActionTodosAdded
  | ActionTodosEdit
  | ActionTodosToggle
  | ActionTodosRemove
  | ActionTodosRemoveDone
  | ActionTodosFilter;

export const initialState: TodosState = {
  items: [],
  filter: 'ALL'
};

export const selectorTodos = state => state.todos;

export function todosReducer(
  state: TodosState = initialState,
  action: TodosActions
): TodosState {
  switch (action.type) {
    case TodosActionTypes.LOAD_SUCCESS:
      return { ...state, items: action.payload };
    case TodosActionTypes.ADDED:
      return { ...state, items: [...state.items, action.payload] };
    case TodosActionTypes.EDIT:
      return {
        ...state,
        items: state.items.map((item: TodoItem) =>
          item.id === action.payload.source.id ? action.payload.updated : item
        )
      };

    case TodosActionTypes.TOGGLE:
      return {
        ...state,
        items: state.items.map((item: TodoItem) =>
          item.id === action.payload.id
            ? { ...item, isCompleted: !item.isCompleted }
            : item
        )
      };

    case TodosActionTypes.REMOVE:
      return {
        ...state,
        items: state.items.filter(
          (item: TodoItem) => !action.payload.includes(item.id)
        )
      };

    case TodosActionTypes.REMOVE_DONE:
      return {
        ...state,
        items: state.items.filter((item: TodoItem) => !item.isCompleted)
      };

    case TodosActionTypes.FILTER:
      return { ...state, filter: action.payload.filter };

    default:
      return state;
  }
}

export type TodosFilter = 'ALL' | 'DONE' | 'ACTIVE';

export interface TodosState {
  items: TodoItem[];
  filter: TodosFilter;
}
