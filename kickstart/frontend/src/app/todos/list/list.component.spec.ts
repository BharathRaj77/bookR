import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { defer, of } from 'rxjs';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';

import { TodosListComponent } from './list.component';
import { ActionTodosLoad } from '../effects/todos.reducer';
import { ConfigService } from '../../core/config/config.service';
import { MockConfigService } from '../../mocks/config.service.mock';
import { WindowService } from '../../core/services/window.service';
import { MockWindowService } from '../../mocks/window.service.mock';

describe('TodosListComponent', () => {
  let component: TodosListComponent;
  let fixture: ComponentFixture<TodosListComponent>;

  const storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'pipe']);
  const matSnackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

  const threeItems = () => [
    { id: '1', title: 'title1', description: null, isCompleted: false },
    { id: '2', title: 'title2', description: null, isCompleted: false },
    { id: '3', title: 'title3', description: null, isCompleted: true }
  ];

  beforeEach(async(() => {
    storeSpy.pipe.and.returnValue(of({ items: [], filter: 'ALL' }));
    matSnackBarSpy.open.calls.reset();

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, CoreModule, SharedModule],
      providers: [
        { provide: Store, useValue: storeSpy },
        { provide: MatSnackBar, useValue: matSnackBarSpy },
        { provide: WindowService, useValue: new MockWindowService() },
        { provide: ConfigService, useValue: new MockConfigService() }
      ],
      declarations: [TodosListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit() should dispatch a load action', () => {
    storeSpy.dispatch.calls.reset();

    component.ngOnInit();

    expect(storeSpy.dispatch).toHaveBeenCalled();
    expect(storeSpy.dispatch.calls.first().args[0].type).toBe(
      new ActionTodosLoad().type
    );
  });

  describe('get filteredTodos', () => {
    beforeEach(() => {
      component.todos = {
        items: threeItems(),
        filter: 'ALL'
      };
    });

    it('should return all todo items', () => {
      const filtered = component.filteredTodos;

      expect(filtered.length).toBe(3);
    });

    it('should return all completed todo items', () => {
      component.todos.filter = 'DONE';

      const filtered = component.filteredTodos;

      expect(filtered.length).toBe(1);
    });

    it('should return all active todo items', () => {
      component.todos.filter = 'ACTIVE';

      const filtered = component.filteredTodos;

      expect(filtered.length).toBe(2);
    });
  });

  describe('get isAddTodoDisabled', () => {
    const disabledTestData = ['', 'a', 'ab', 'abc'];
    const enabledTestData = ['acbd', 'abcde', 'abcdef'];

    disabledTestData.forEach(test => {
      it(`should return true when the new Todo's length is less than 4`, () => {
        component.newTodo = test;

        expect(component.isAddTodoDisabled).toBeTruthy();
      });
    });

    enabledTestData.forEach(test => {
      it(`should return false when the new Todo's length is 4 or more`, () => {
        component.newTodo = test;

        expect(component.isAddTodoDisabled).toBeFalsy();
      });
    });
  });

  describe('get isRemoveDoneTodosDisabled', () => {
    beforeEach(() => {
      component.todos.items = threeItems();
    });

    it('should return false if at least one item is completed', () => {
      expect(component.isRemoveDoneTodosDisabled).toBeFalsy();
    });

    it('should return true if there are no completed items', () => {
      component.todos.items.forEach(x => (x.isCompleted = false));

      expect(component.isRemoveDoneTodosDisabled).toBeTruthy();
    });
  });

  it('onNewTodoChange() should update the state', () => {
    component.newTodo = 'first';

    component.onNewTodoChange('second');

    expect(component.newTodo).toBe('second');
  });

  it('onNewTodoClear() should clear the state', () => {
    component.newTodo = 'first';

    component.onNewTodoClear();

    expect(component.newTodo).toBe('');
  });

  it('onAddTodo should add a new todo item', () => {
    const title = 'new todo';
    storeSpy.dispatch.calls.reset();
    component.newTodo = title;

    component.onAddTodo();

    expect(storeSpy.dispatch).toHaveBeenCalled();
    expect(storeSpy.dispatch.calls.first().args[0].payload.title).toBe(title);
    expect(matSnackBarSpy.open).toHaveBeenCalledWith(
      `"${title}" added`,
      undefined,
      jasmine.any(Object)
    );
    expect(component.newTodo).toBe('');
  });

  describe('onToggleTodo', () => {
    beforeEach(() => {
      component.todos.items = threeItems();

      matSnackBarSpy.open.and.returnValue({
        onAction: () => defer(() => {})
      });
    });

    it('onToggleTodo should complete a todo item', () => {
      storeSpy.dispatch.calls.reset();
      const item = threeItems()[0];

      component.onToggleTodo(item);

      expect(storeSpy.dispatch).toHaveBeenCalled();
      expect(storeSpy.dispatch.calls.first().args[0].payload.id).toBe(item.id);
      expect(matSnackBarSpy.open).toHaveBeenCalledWith(
        `Toggled "${item.title}" to done`,
        'Undo',
        jasmine.any(Object)
      );
    });

    it('onToggleTodo should uncomplete a todo item', () => {
      storeSpy.dispatch.calls.reset();
      const item = threeItems()[2];

      component.onToggleTodo(item);

      expect(storeSpy.dispatch).toHaveBeenCalled();
      expect(storeSpy.dispatch.calls.first().args[0].payload.id).toBe(item.id);
      expect(matSnackBarSpy.open).toHaveBeenCalledWith(
        `Toggled "${item.title}" to active`,
        'Undo',
        jasmine.any(Object)
      );
    });
  });

  it('onRemoveDoneTodos() should remove all completed todos', () => {
    storeSpy.dispatch.calls.reset();
    component.todos.items = threeItems();

    component.onRemoveDoneTodos();

    expect(storeSpy.dispatch).toHaveBeenCalled();
    expect(storeSpy.dispatch.calls.first().args[0].payload[0]).toBe(
      component.todos.items[2].id
    );
    expect(matSnackBarSpy.open).toHaveBeenCalledWith(
      'Removed done todos',
      undefined,
      jasmine.any(Object)
    );
  });

  it('onFilterTodos() should filter the todos', () => {
    storeSpy.dispatch.calls.reset();

    component.onFilterTodos('DONE');

    expect(storeSpy.dispatch).toHaveBeenCalled();
    expect(storeSpy.dispatch.calls.first().args[0].payload.filter).toBe('DONE');
    expect(matSnackBarSpy.open).toHaveBeenCalledWith(
      'Filtered to done',
      undefined,
      jasmine.any(Object)
    );
  });
});
