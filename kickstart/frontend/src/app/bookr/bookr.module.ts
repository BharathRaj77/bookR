import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { BookRRoutingModule } from './bookr.routing';
import { MatFormField } from '@angular/material/form-field';
import { ngModuleJitUrl } from '@angular/compiler';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [LoginComponent],
  imports: [FormsModule,
    BookRRoutingModule,
    CommonModule
  ]
})
export class BookrModule { }
