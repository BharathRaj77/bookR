import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';

import { EditTodoComponent } from './edit.component';
import { ConfigService } from '../../core/config/config.service';
import { MockConfigService } from '../../mocks/config.service.mock';
import { WindowService } from '../../core/services/window.service';
import { MockWindowService } from '../../mocks/window.service.mock';

describe('EditTodoComponent', () => {
  const storeSpy = jasmine.createSpyObj('Store', ['dispatch']);
  const matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

  const todoItem = {
    id: '1',
    title: 'test',
    description: null,
    isCompleted: false
  };

  let component: EditTodoComponent;
  let fixture: ComponentFixture<EditTodoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterTestingModule,
        CoreModule,
        SharedModule
      ],
      providers: [
        { provide: Store, useValue: storeSpy },
        { provide: MAT_DIALOG_DATA, useValue: todoItem },
        { provide: MatDialogRef, useValue: matDialogRefSpy },
        { provide: WindowService, useValue: new MockWindowService() },
        { provide: ConfigService, useValue: new MockConfigService() }
      ],
      declarations: [EditTodoComponent]
    }).compileComponents();
  }));

  /*
  @Inject(MAT_DIALOG_DATA) private todoItem: TodoItem,
  private dialogRef: MatDialogRef<EditTodoComponent>,
  private formBuilder: FormBuilder,
  private store: Store<any>
  */

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(component.todoForm).toBeTruthy();
  });

  describe('onSubmit()', () => {
    beforeEach(() => {
      storeSpy.dispatch.calls.reset();
      matDialogRefSpy.close.calls.reset();
    });

    it('should only execute its logic if the form is valid', () => {
      component.todoForm.setErrors({ customError: true });

      component.onSubmit();

      expect(storeSpy.dispatch).not.toHaveBeenCalled();
      expect(matDialogRefSpy.close).not.toHaveBeenCalled();
    });

    it('should dispatch and close the dialog when the form is valid', () => {
      const title = 'Test updated';
      component.todoForm.get('title').setValue(title);

      component.onSubmit();

      expect(storeSpy.dispatch).toHaveBeenCalled();
      const payload = storeSpy.dispatch.calls.first().args[0].payload;
      expect(payload.source.title).toBe(todoItem.title);
      expect(payload.updated.title).toBe(title);

      expect(matDialogRefSpy.close).toHaveBeenCalledWith(true);
    });
  });
});
