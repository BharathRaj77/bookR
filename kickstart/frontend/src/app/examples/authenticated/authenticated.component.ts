import { Component, OnInit } from '@angular/core';
import { SecuredService } from './services/secured.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'anms-authenticated',
  templateUrl: './authenticated.component.html',
  styleUrls: ['./authenticated.component.scss']
})
export class AuthenticatedComponent implements OnInit {
  userCheckResults: string[] = [];
  userRoles: string[] = [];
  constructor(
    private securedService: SecuredService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.securedService
      .checkAdmin()
      .subscribe(r =>
        this.userCheckResults.push('Checking for user admin => ' + r)
      );
    this.securedService.checkEditor().subscribe(r => {
      this.userCheckResults.push('Checking for user editor => ' + r);
    });
    this.securedService
      .checkUser()
      .subscribe(r =>
        this.userCheckResults.push('Checking for user regular => ' + r)
      );
    this.securedService
      .checkCustom()
      .subscribe(r =>
        this.userCheckResults.push('Checking for user custom => ' + r)
      );
    this.userService.getRoles().subscribe(roles => (this.userRoles = roles));
  }
}
