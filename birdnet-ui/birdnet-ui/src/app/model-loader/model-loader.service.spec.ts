import { TestBed, waitForAsync } from '@angular/core/testing';

import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { firstValueFrom, of } from 'rxjs';
import { ModelLoaderService } from './model-loader.service';

describe('ModelLoaderService', () => {
  let service: ModelLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ModelLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load the model', waitForAsync(async () => {
    const httpClient = TestBed.inject(HttpClient);
    // Mock the http client to return a dummy ONNX model
    const dummyModel = new ArrayBuffer(0);
    spyOn(httpClient, 'get').and.returnValue(of(dummyModel)); 
    const session = await firstValueFrom(service.loadModel('assets/birdnet.onnx'));
    expect(session).toBeTruthy();
  }));
});
