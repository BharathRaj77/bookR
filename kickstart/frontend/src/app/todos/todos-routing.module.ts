import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TodosListComponent } from './list/list.component';
import { TodosGridComponent } from './grid/grid.component';
import { TodoComponent } from './index/index.component';

const routes: Routes = [
  {
    path: '',
    component: TodoComponent,
    data: {
      title: `Todo's`,
      redirectToLogin: true
    },
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: TodosListComponent,
        data: {
          title: `Todo's (list)`,
          redirectToLogin: true
        }
      },
      {
        path: 'grid',
        component: TodosGridComponent,
        data: {
          title: `Todo's (grid)`,
          redirectToLogin: true
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TodosRoutingModule {}
