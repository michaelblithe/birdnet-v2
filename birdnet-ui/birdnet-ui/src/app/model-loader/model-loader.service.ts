import { Injectable } from '@angular/core';
import { InferenceSession } from 'onnxruntime-web';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModelLoaderService {


  public loadModel(url: string): Observable<InferenceSession> {
    // Load the inference session from the ONNX model file

    return new Observable<InferenceSession>((observer) => {
      InferenceSession.create(url).then((session) => {
        observer.next(session);
        observer.complete();
      });
    });
  }

}
