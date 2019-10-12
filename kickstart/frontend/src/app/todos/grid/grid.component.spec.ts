import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import { SharedModule } from '@app/shared';

import { TodosService } from '../services/todos.service';
import { TodosGridComponent } from './grid.component';
import { EventEmitter } from '../../../../node_modules/@angular/core';

describe('TodosGridComponent', () => {
  const storeSpy = jasmine.createSpyObj('Store', ['dispatch']);
  const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
  const matSnackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
  const todosServiceSpy = jasmine.createSpyObj('TodosService', [
    'getTodoItems'
  ]);
  const mockPaginator: Partial<MatPaginator> = {
    length: 0,
    pageIndex: 0,
    page: new EventEmitter()
  };
  const mockSort: Partial<MatSort> = {
    sortChange: new EventEmitter()
  };

  const todoItem = {
    id: '1',
    title: 'test',
    description: null,
    isCompleted: false
  };
  const threeItems = [
    { id: '1', title: 'title1', description: null, isCompleted: false },
    { id: '2', title: 'title2', description: null, isCompleted: false },
    { id: '3', title: 'title3', description: null, isCompleted: true }
  ];

  let component: TodosGridComponent;
  let fixture: ComponentFixture<TodosGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule, SharedModule],
      providers: [
        { provide: Store, useValue: storeSpy },
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: MatSnackBar, useValue: matSnackBarSpy },
        { provide: TodosService, useValue: todosServiceSpy }
      ],
      declarations: [TodosGridComponent]
    }).compileComponents();

    todosServiceSpy.getTodoItems.and.returnValue(
      of({
        items: [],
        index: 1,
        size: 10,
        totalItems: 0,
        totalPages: 0
      })
    );
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodosGridComponent);
    component = fixture.componentInstance;

    component.paginator = <any>mockPaginator;
    component.sort = <any>mockSort;
    component.ngAfterViewInit();

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit()', () => {
    beforeEach(() => {
      storeSpy.dispatch.calls.reset();
      matSnackBarSpy.open.calls.reset();
    });

    it('should only execute its logic if the form is valid', () => {
      component.todoForm.setErrors({ customError: true });

      component.onSubmit();

      expect(storeSpy.dispatch).not.toHaveBeenCalled();
    });

    it('should dispatch, reset and show a notification when the form is valid', () => {
      const title = 'Title';
      component.todoForm.get('title').setValue(title);

      component.onSubmit();

      expect(storeSpy.dispatch).toHaveBeenCalled();

      const payload = storeSpy.dispatch.calls.first().args[0].payload;
      expect(payload.title).toBe(title);

      expect(component.todoForm.pristine).toBeTruthy();

      expect(matSnackBarSpy.open).toHaveBeenCalledWith(
        `"${title}" added`,
        undefined,
        jasmine.any(Object)
      );
    });
  });

  it('resetForm() should reset the form', () => {
    component.todoForm.get('title').setValue('Title');

    component.resetForm();

    expect(component.todoForm.pristine).toBeTruthy();
  });

  describe('edit()', () => {
    beforeEach(() => {
      component.todoDataSource.data = {
        items: [todoItem],
        index: 1,
        size: 1,
        totalPages: 1,
        totalItems: 1
      };
      component.selection.select(todoItem);

      matDialogSpy.open.calls.reset();
      matSnackBarSpy.open.calls.reset();
    });

    it('should show the editor and show a notification if the user saved the changes', async(() => {
      matDialogSpy.open.and.returnValue({
        afterClosed: () => of(true)
      });

      component.edit();

      expect(matDialogSpy.open).toHaveBeenCalled();
      expect(matSnackBarSpy.open).toHaveBeenCalledWith(
        'Changes made to the todo item have been saved!',
        undefined,
        jasmine.any(Object)
      );

      expect(component.selection.selected.length).toBe(0);
    }));

    it('should show the editor but no notification if the user cancelled', async(() => {
      matDialogSpy.open.and.returnValue({
        afterClosed: () => of(false)
      });

      component.edit();

      expect(matDialogSpy.open).toHaveBeenCalled();
      expect(matSnackBarSpy.open).not.toHaveBeenCalled();
      expect(component.selection.selected.length).toBe(0);
    }));
  });

  describe('removeSelected()', () => {
    beforeEach(() => {
      component.todoDataSource.data = {
        items: threeItems,
        index: 1,
        size: 10,
        totalPages: 1,
        totalItems: 3
      };

      storeSpy.dispatch.calls.reset();
      matSnackBarSpy.open.calls.reset();
    });

    it('should remove a single selected item', () => {
      component.selection.select(threeItems[1]); // The second item

      component.removeSelected();

      expect(storeSpy.dispatch).toHaveBeenCalled();
      expect(storeSpy.dispatch.calls.first().args[0].payload[0]).toBe(
        threeItems[1].id
      );

      expect(component.selection.selected.length).toBe(0);

      expect(matSnackBarSpy.open).toHaveBeenCalledWith(
        'Removed 1 todo item.',
        undefined,
        jasmine.any(Object)
      );
    });

    it('should remove multiple selected items', () => {
      component.selection.select(threeItems[0]); // The first item
      component.selection.select(threeItems[2]); // The third item

      component.removeSelected();

      expect(storeSpy.dispatch).toHaveBeenCalled();
      expect(storeSpy.dispatch.calls.first().args[0].payload[0]).toBe(
        threeItems[0].id
      );
      expect(storeSpy.dispatch.calls.first().args[0].payload[1]).toBe(
        threeItems[2].id
      );

      expect(component.selection.selected.length).toBe(0);

      expect(matSnackBarSpy.open).toHaveBeenCalledWith(
        'Removed 2 todo items.',
        undefined,
        jasmine.any(Object)
      );
    });
  });

  it('isAllSelected() should return true when there are no items', () => {
    component.todoDataSource.data = {
      items: [],
      index: 1,
      size: 10,
      totalPages: 0,
      totalItems: 0
    };

    const allSelected = component.isAllSelected();

    expect(allSelected).toBeTruthy();
  });

  describe('isAllSelected()', () => {
    beforeEach(() => {
      component.todoDataSource.data = {
        items: threeItems,
        index: 1,
        size: 10,
        totalPages: 1,
        totalItems: 3
      };
    });

    it('should return true when all items are selected', () => {
      threeItems.forEach(x => component.selection.select(x));

      const allSelected = component.isAllSelected();

      expect(allSelected).toBeTruthy();
    });

    it('should return false when no items have been selected', () => {
      const allSelected = component.isAllSelected();

      expect(allSelected).toBeFalsy();
    });

    it('should return false when some items have not been selected', () => {
      component.selection.select(threeItems[0]);

      const allSelected = component.isAllSelected();

      expect(allSelected).toBeFalsy();
    });
  });

  describe('masterToggle()', () => {
    beforeEach(() => {
      component.todoDataSource.data = {
        items: threeItems,
        index: 1,
        size: 10,
        totalPages: 1,
        totalItems: 3
      };
    });

    it('should select all items if none have been selected', () => {
      component.masterToggle();

      expect(component.selection.selected.length).toBe(threeItems.length);
    });

    it('should select all items if some have been selected', () => {
      component.selection.select(threeItems[0]);

      component.masterToggle();

      expect(component.selection.selected.length).toBe(threeItems.length);
    });

    it('should select no items if all have been selected', () => {
      threeItems.forEach(x => component.selection.select(x));

      component.masterToggle();

      expect(component.selection.selected.length).toBe(0);
    });
  });
});
