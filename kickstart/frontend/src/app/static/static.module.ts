import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { StaticRoutingModule } from './static-routing.module';
import { AboutComponent } from './about/about.component';
import { ChangelogComponent } from './changelog/changelog.component';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  imports: [SharedModule, StaticRoutingModule, MarkdownModule.forRoot()],
  declarations: [AboutComponent, ChangelogComponent]
})
export class StaticModule {}
