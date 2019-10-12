import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '@app/shared';

import { TodosRoutingModule } from './todos-routing.module';
import { TodoComponent } from './index/index.component';
import { TodosListComponent } from './list/list.component';
import { TodosGridComponent } from './grid/grid.component';
import { EditTodoComponent } from './edit/edit.component';
import { TodosEffects } from './effects/todos.effects';
import { todosReducer } from './effects/todos.reducer';
import { TodosService } from './services/todos.service';

@NgModule({
  imports: [
    SharedModule,
    TodosRoutingModule,
    StoreModule.forFeature('todos', todosReducer),
    EffectsModule.forFeature([TodosEffects])
  ],
  declarations: [
    TodoComponent,
    TodosListComponent,
    TodosGridComponent,
    EditTodoComponent
  ],
  providers: [TodosService],
  entryComponents: [EditTodoComponent]
})
export class TodosModule {
  constructor() {}
}
