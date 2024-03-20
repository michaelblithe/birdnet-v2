import { Injectable } from '@angular/core';
import { InferenceSession, Tensor } from 'onnxruntime-web';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModelInferenceService {

  public inferModel(session: InferenceSession, input: Tensor): Observable<Tensor> {

    return new Observable<Tensor>((observer) => {
      session.run({ 'input': input }).then((output) => {
        this.applySoftmax(output['output']).then(o => {
          observer.next(o);
          observer.complete();
        });
      });
    });
  }
  private async applySoftmax(t: Tensor): Promise<Tensor> {
    const originalData = await t.getData() as Float32Array;
    const total = originalData.map((x) => Math.exp(x)).reduce((a, b) => a + b);
    const newData = originalData.map(x => Math.exp(x) / total);
    return new Tensor('float32', newData, t.dims);
  }


}
