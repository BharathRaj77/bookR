import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticatedComponent } from './authenticated.component';
import { MockConfigService } from '../../mocks/config.service.mock';
import { SecuredService } from './services/secured.service';
import { MockWindowService } from '../../mocks/window.service.mock';
import { ConfigService, WindowService } from '../../core';
import { UserService } from '../../core/services/user.service';
import { of } from 'rxjs';

describe('AuthenticatedComponent', () => {
  let mockConfigService: MockConfigService;
  let component: AuthenticatedComponent;
  let fixture: ComponentFixture<AuthenticatedComponent>;

  beforeEach(async(() => {
    mockConfigService = new MockConfigService();
    mockConfigService.set({ apiUrl: '' });

    TestBed.configureTestingModule({
      providers: [
        {
          provide: SecuredService,
          useValue: {
            checkAdmin: () => of(''),
            checkEditor: () => of(''),
            checkUser: () => of(''),
            checkCustom: () => of('')
          }
        },
        {
          provide: UserService,
          useValue: {
            hasRole: (roles: string | string[]) => of(true),
            getRoles: () => of(['admin', 'editor', 'user'])
          }
        },
        { provide: WindowService, useValue: new MockWindowService() },
        { provide: ConfigService, useValue: mockConfigService }
      ],
      declarations: [AuthenticatedComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
