import { Component, OnInit } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Router } from '@angular/router';
import { UserLibrary } from '../user-Library.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'anms-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userName: string;
  hyperlink: string;
  constructor(private router: Router, private httpClient: HttpClient) { }

  ngOnInit() {
    this.hyperlink = "";
    this.userName = "";
  }

  createHyperlink() {
    if (this.userName.length != 0) {
      var data = new UserLibrary();
      data.UserName = this.userName;
      data.GUID = UUID.UUID();
      this.httpClient.get("http://localhost52083/api/createlibrary/" + this.userName)
        .subscribe(response => {
          this.hyperlink = window.location.origin + "/library/" + this.userName + "?key=" + response;
        });
    }
    //console.log(this.hyperlink);
  }

}
