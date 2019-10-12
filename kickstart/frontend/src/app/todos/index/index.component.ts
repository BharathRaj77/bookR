import { Component } from '@angular/core';
import { routerTransition } from '@app/core';

@Component({
  selector: 'anms-todo',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  animations: [routerTransition]
})
export class TodoComponent {
  examples = [{ link: 'list', label: 'List' }, { link: 'grid', label: 'Grid' }];
}
