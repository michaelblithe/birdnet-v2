import { TestBed } from '@angular/core/testing';

import { Img2tensorService } from './img2tensor.service';

describe('Img2tensorService', () => {
  let service: Img2tensorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Img2tensorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
