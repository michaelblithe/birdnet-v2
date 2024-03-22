import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { RouterOutlet } from '@angular/router';
import { InferenceSession } from 'onnxruntime-web';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { Img2tensorService } from './model-loader/img2tensor.service';
import { ModelInferenceService } from './model-loader/model-inference.service';
import { InferenceResult, ModelInterpreterService } from './model-loader/model-interpreter.service';
import { ModelLoaderService } from './model-loader/model-loader.service';

type State = 'loading' | 'complete' | 'error';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatInputModule, CommonModule, MatTableModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy {
  readonly displayedColumns = ['name', 'score'];

  private modelSubject: ReplaySubject<InferenceSession> = new ReplaySubject<InferenceSession>(1);
  readonly model$: Observable<InferenceSession> = this.modelSubject.asObservable();

  private stateSubject: ReplaySubject<State> = new ReplaySubject<State>(1);
  readonly state$: Observable<State> = this.stateSubject.asObservable();

  private modelOutputSubject: ReplaySubject<InferenceResult[]> = new ReplaySubject<InferenceResult[]>(1);
  readonly modelOutput$: Observable<InferenceResult[]> = this.modelOutputSubject.asObservable();

  dataSource = this.modelOutput$;

  private sub: Subscription = new Subscription();

  title = 'birdnet-ui';

  constructor(private modelLoader: ModelLoaderService, private img2tensor: Img2tensorService, 
    private modelInference: ModelInferenceService,
    private modelInterpreter: ModelInterpreterService) {
    this.modelLoader.loadModel('assets/bird_model.onnx').subscribe((model) => {
      this.modelSubject.next(model);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onFileChange($event: Event) {
    this.sub.add(this.model$.subscribe((model) => {
      // read the file contents as a buffer
      const file = ($event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async () => {
          this.stateSubject.next('loading');
          await this.processImage(reader.result as ArrayBuffer, model);
        };

        reader.readAsArrayBuffer(file);
      }
    }));
  }

  async processImage(data: ArrayBuffer, model: InferenceSession)  {
    const blob = new Blob([data]); 

    this.modelInference.inferModel(model, await this.img2tensor.img2tensor(blob)).subscribe((output) => {
      const labels = this.modelInterpreter.interpretOutput(output.data as Float32Array);
      this.stateSubject.next('complete');
      this.modelOutputSubject.next(labels);
      
    });
  }
}
