import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { ChangelogComponent } from './changelog/changelog.component';

const routes: Routes = [
  {
    path: 'about',
    component: AboutComponent,
    data: {
      title: 'About',
      monitoring: {
        pageView: {
          name: 'about'
        }
      }
    }
  },
  {
    path: 'changelog',
    component: ChangelogComponent,
    data: {
      title: 'Change Log'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaticRoutingModule {}
