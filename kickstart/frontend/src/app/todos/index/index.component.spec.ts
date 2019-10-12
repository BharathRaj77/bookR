import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';

import { TodoComponent } from './index.component';
import { ConfigService } from '../../core/config/config.service';
import { MockConfigService } from '../../mocks/config.service.mock';
import { WindowService } from '../../core/services/window.service';
import { MockWindowService } from '../../mocks/window.service.mock';

describe('TodoComponent', () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterTestingModule,
        CoreModule,
        SharedModule
      ],
      declarations: [TodoComponent],
      providers: [
        { provide: WindowService, useValue: new MockWindowService() },
        { provide: ConfigService, useValue: new MockConfigService() }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
