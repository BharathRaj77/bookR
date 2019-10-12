import { async } from '@angular/core/testing';
import { MatPaginator } from '@angular/material/paginator';
import { of, throwError } from 'rxjs';

import { TodoDataSource } from './grid.datasource';
import { TodoItem } from '../models/todos.model';
import { Page } from '../../shared';

describe('Datasource: TodoDataSource', () => {
  const todoItems: TodoItem[] = [
    {
      id: 'a1b2-c3d4e5f6-g7h8-i9j10',
      title: 'todo',
      description: null,
      isCompleted: false
    }
  ];
  const todoItemPage: Page<TodoItem> = {
    items: todoItems,
    index: 1,
    size: 10,
    totalItems: 1,
    totalPages: 1
  };

  let datasource: TodoDataSource;
  let mockTodosService: { getTodoItems: jasmine.Spy };
  const mockPaginator: Partial<MatPaginator> = {
    length: 0
  };

  beforeEach(() => {
    mockTodosService = jasmine.createSpyObj('TodosService', ['getTodoItems']);
    datasource = new TodoDataSource(<any>mockTodosService);
    datasource.paginator = <any>mockPaginator;
  });

  describe('loadPage()', () => {
    it('should indicate loading state when getTodoItems() fails', async(() => {
      const loadingState: boolean[] = [];
      datasource.loading$.subscribe(state => loadingState.push(state));

      mockTodosService.getTodoItems.and.returnValue(
        throwError('500 Internal Server Error')
      );

      datasource.loadPage();

      expect(loadingState.length).toBe(3);
      expect(loadingState[0]).toBeFalsy();
      expect(loadingState[1]).toBeTruthy();
      expect(loadingState[2]).toBeFalsy();
    }));

    it('should indicate loading state when getTodoItems() succeeds', async(() => {
      const loadingState: boolean[] = [];
      datasource.loading$.subscribe(state => loadingState.push(state));

      mockTodosService.getTodoItems.and.returnValue(of(todoItemPage));

      datasource.loadPage();

      expect(loadingState.length).toBe(3);
      expect(loadingState[0]).toBeFalsy();
      expect(loadingState[1]).toBeTruthy();
      expect(loadingState[2]).toBeFalsy();
    }));

    it('should reset the data to empty array when getTodoItems() fails', async(() => {
      mockTodosService.getTodoItems.and.returnValue(
        throwError('500 Internal Server Error')
      );

      datasource.loadPage();

      expect(datasource.data).toBeTruthy();
      expect(datasource.data.items.length).toBe(0);
    }));

    it('should update the data when getTodoItems() succeeds', async(() => {
      const newData = [
        {
          id: 'new1',
          title: 'new1',
          description: null,
          isCompleted: true
        },
        {
          id: 'new2',
          title: 'new2',
          description: null,
          isCompleted: false
        }
      ];
      const newPage = {
        items: newData,
        index: 2,
        size: 10,
        totalItems: 12,
        totalPages: 2
      };

      mockTodosService.getTodoItems.and.returnValue(of(newPage));

      datasource.loadPage();

      expect(datasource.data.items.length).toBe(2);
      expect(datasource.data.items[0].id).toBe(newData[0].id);
      expect(datasource.data.items[1].id).toBe(newData[1].id);
    }));
  });
});
