import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'bookr',
    pathMatch: 'full'
  },
  {
    path: 'settings',
    component: SettingsComponent,
    data: {
      title: 'Settings'
    }
  },
  {
    path: 'examples',
    loadChildren: () => import('app/examples/examples.module').then(m => m.ExamplesModule)
  },
  {
    path: 'todos',
    loadChildren: () => import('app/todos/todos.module').then(m => m.TodosModule)
  },
  {
    path: 'bookr',
    loadChildren: () => import('app/bookr/bookr.module').then(m => m.BookrModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: false,
      scrollPositionRestoration: 'top'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
