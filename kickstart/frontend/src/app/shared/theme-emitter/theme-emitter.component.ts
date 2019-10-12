import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'anms-theme-emitter',
  template: `
    <div #primary id="theme-primary" class="primary"></div>
    <div #accent id="theme-accent" class="accent"></div>
    <div #warn id="theme-warn" class="warn"></div>
  `,
  styles: [':host { display: none; }']
})
export class ThemeEmitterComponent implements AfterViewInit {
  primaryColor: string;
  accentColor: string;
  warnColor: string;

  @ViewChild('primary', { static: true }) primaryElement: ElementRef;
  @ViewChild('accent', { static: true }) accentElement: ElementRef;
  @ViewChild('warn', { static: true }) warnElement: ElementRef;

  ngAfterViewInit() {
    this.primaryColor = getComputedStyle(
      this.primaryElement.nativeElement
    ).color;
    this.accentColor = getComputedStyle(this.accentElement.nativeElement).color;
    this.warnColor = getComputedStyle(this.primaryElement.nativeElement).color;
  }
}
