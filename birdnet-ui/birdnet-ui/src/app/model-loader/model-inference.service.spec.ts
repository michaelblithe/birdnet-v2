import { TestBed } from '@angular/core/testing';

import { ModelInferenceService } from './model-inference.service';

describe('ModelInferenceService', () => {
  let service: ModelInferenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelInferenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
