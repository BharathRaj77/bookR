import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import { TodoItem } from '../models/todos.model';
import { ActionTodosEdit } from '../effects/todos.reducer';

@Component({
  templateUrl: './edit.component.html',
  styleUrls: ['edit.component.scss']
})
export class EditTodoComponent {
  todoForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private todoItem: TodoItem,
    private dialogRef: MatDialogRef<EditTodoComponent>,
    private formBuilder: FormBuilder,
    private store: Store<any>
  ) {
    this.createForm();
  }

  onSubmit() {
    if (this.todoForm.valid) {
      this.store.dispatch(
        new ActionTodosEdit({
          source: this.todoItem,
          updated: { ...this.todoForm.value, id: this.todoItem.id }
        })
      );

      this.dialogRef.close(true); // To indicate save success in the calling component
    }
  }

  private createForm(): void {
    this.todoForm = this.formBuilder.group({
      title: [this.todoItem.title, Validators.required],
      description: this.todoItem.description,
      isCompleted: this.todoItem.isCompleted
    });
  }
}
