import { TestBed } from '@angular/core/testing';

import { BookServiceService } from './bok-service.service';

describe('BokServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BokServiceService = TestBed.get(BokServiceService);
    expect(service).toBeTruthy();
  });
});
