import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { catchError, filter, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'async-image',
  template: `
    <img [src]="img" *ngIf="img" /><ng-content *ngIf="!img"></ng-content>
  `
})
export class AsyncImageComponent implements OnInit {
  @Input() src: string;
  public img: any;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  public ngOnInit() {
    this.http
      .get(this.src, { responseType: 'blob' })
      .pipe(
        catchError(r => {
          console.log('Failed to load image: ' + this.src, r);
          this.img = '';
          return of(null);
        }),
        filter(blob => !!blob),
        map(blob => {
          const objectUrl = URL.createObjectURL(blob);
          const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            objectUrl
          );
          return safeUrl;
        })
      )
      .subscribe(url => {
        this.img = url;
      });
  }
}
