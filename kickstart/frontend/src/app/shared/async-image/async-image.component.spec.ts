import { TestBed, async, inject } from '@angular/core/testing';
import {
  HttpClientModule,
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { AsyncImageComponent } from './async-image.component';
import { DomSanitizer } from '@angular/platform-browser';
import { b64toBlob } from '../../core/b64-to-blob';

describe('AsyncImageComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      declarations: [AsyncImageComponent],
      providers: [
        {
          provide: DomSanitizer,
          useValue: { bypassSecurityTrustResourceUrl: p => p }
        }
      ]
    }).compileComponents();
  }));

  it('should create the component', async(() => {
    const fixture = TestBed.createComponent(AsyncImageComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should call get on http client', async(
    inject([HttpTestingController], (backend: HttpTestingController) => {
      const fixture = TestBed.createComponent(AsyncImageComponent);
      fixture.componentInstance.src = 'https://example.com/logo.png';
      fixture.detectChanges();

      const request = backend.expectOne({
        url: 'https://example.com/logo.png',
        method: 'GET'
      });

      expect(request).toBeTruthy();
    })
  ));

  it('should not fail when http client return error', async(
    inject([HttpTestingController], (backend: HttpTestingController) => {
      const fixture = TestBed.createComponent(AsyncImageComponent);
      fixture.componentInstance.img = '';
      fixture.componentInstance.src = 'https://example.com/logo.png';
      fixture.detectChanges();
      backend
        .expectOne({
          url: 'https://example.com/logo.png',
          method: 'GET'
        })
        .error(new ErrorEvent('Failed request'));

      backend.verify();
      expect(fixture.componentInstance.img).toBeFalsy();
    })
  ));

  it('img should have a value', async(
    inject([HttpTestingController], (backend: HttpTestingController) => {
      const fixture = TestBed.createComponent(AsyncImageComponent);
      fixture.componentInstance.src = 'https://example.com/logo.png';
      fixture.detectChanges();
      backend
        .expectOne({
          url: 'https://example.com/logo.png',
          method: 'GET'
        })
        .flush(
          b64toBlob(
            'iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAB+FBMVEUAAAA/mUPidDHiLi5Cn0XkNTPmeUrkdUg/m0Q0pEfc' +
              'pSbwaVdKskg+lUP4zA/iLi3msSHkOjVAmETdJSjtYFE/lkPnRj3sWUs8kkLeqCVIq0fxvhXqUkbVmSjwa1n1yBLepyX1xxP0xRXqUkboST' +
              '9KukpHpUbuvRrzrhF/ljbwaljuZFM4jELaoSdLtElJrUj1xxP6zwzfqSU4i0HYnydMtUlIqUfywxb60AxZqEXaoifgMCXptR9MtklHpEY2' +
              'iUHWnSjvvRr70QujkC+pUC/90glMuEnlOjVMt0j70QriLS1LtEnnRj3qUUXfIidOjsxAhcZFo0bjNDH0xxNLr0dIrUdmntVTkMoyfL8jcL' +
              'BRuErhJyrgKyb4zA/5zg3tYFBBmUTmQTnhMinruBzvvhnxwxZ/st+Ktt5zp9hqota2vtK6y9FemNBblc9HiMiTtMbFtsM6gcPV2r6dwros' +
              'eLrMrbQrdLGdyKoobKbo3Zh+ynrgVllZulTsXE3rV0pIqUf42UVUo0JyjEHoS0HmsiHRGR/lmRz/1hjqnxjvpRWfwtOhusaz0LRGf7FEfb' +
              'DVmqHXlJeW0pbXq5bec3fX0nTnzmuJuWvhoFFhm0FtrziBsjaAaDCYWC+uSi6jQS3FsSfLJiTirCOkuCG1KiG+wSC+GBvgyhTszQ64Z77K' +
              'AAAARXRSTlMAIQRDLyUgCwsE6ebm5ubg2dLR0byXl4FDQzU1NDEuLSUgC+vr6urq6ubb29vb2tra2tG8vLu7u7uXl5eXgYGBgYGBLiUALa' +
              'bIAAABsElEQVQoz12S9VPjQBxHt8VaOA6HE+AOzv1wd7pJk5I2adpCC7RUcHd3d3fXf5PvLkxheD++z+yb7GSRlwD/+Hj/APQCZWxM5M+g' +
              'oF+RMbHK594v+tPoiN1uHxkt+xzt9+R9wnRTZZQpXQ0T5uP1IQxToyOAZiQu5HEpjeA4SWIoksRxNiGC1tRZJ4LNxgHgnU5nJZBDvuDdl8' +
              'lzQRBsQ+s9PZt7s7Pz8wsL39/DkIfZ4xlB2Gqsq62ta9oxVlVrNZpihFRpGO9fzQw1ms0NDWZz07iGkJmIFH8xxkc3a/WWlubmFkv9AB2S' +
              'EpDvKxbjidN2faseaNV3zoHXvv7wMODJdkOHAegweAfFPx4G67KluxzottCU9n8CUqXzcIQdXOytAHqXxomvykhEKN9EFutG22p//0rbNv' +
              'HVxiJywa8yS2KDfV1dfbu31H8jF1RHiTKtWYeHxUvq3bn0pyjCRaiRU6aDO+gb3aEfEeVNsDgm8zzLy9egPa7Qt8TSJdwhjplk06HH43ZN' +
              'J3s91KKCHQ5x4sw1fRGYDZ0n1L4FKb9/BP5JLYxToheoFCVxz57PPS8UhhEpLBVeAAAAAElFTkSuQmCC',
            'image/png'
          ),
          {
            headers: new HttpHeaders({
              'Content-Type': 'image/png'
            })
          }
        );

      expect(fixture.componentInstance.img).toBeTruthy();
    })
  ));
});
