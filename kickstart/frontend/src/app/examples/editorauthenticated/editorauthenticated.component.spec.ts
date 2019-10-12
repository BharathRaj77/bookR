import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorAuthenticatedComponent } from './editorauthenticated.component';

describe('AuthenticatedComponent', () => {
  let component: EditorAuthenticatedComponent;
  let fixture: ComponentFixture<EditorAuthenticatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditorAuthenticatedComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorAuthenticatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
