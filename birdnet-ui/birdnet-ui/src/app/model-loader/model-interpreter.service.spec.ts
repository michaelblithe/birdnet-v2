import { TestBed } from '@angular/core/testing';

import { ModelInterpreterService } from './model-interpreter.service';

describe('ModelInterpreterService', () => {
  let service: ModelInterpreterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelInterpreterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
