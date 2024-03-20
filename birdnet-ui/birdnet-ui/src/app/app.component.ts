import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { RouterOutlet } from '@angular/router';
import { InferenceSession } from 'onnxruntime-web';
import { Observable, tap } from 'rxjs';
import { Img2tensorService } from './model-loader/img2tensor.service';
import { ModelInferenceService } from './model-loader/model-inference.service';
import { ModelInterpreterService } from './model-loader/model-interpreter.service';
import { ModelLoaderService } from './model-loader/model-loader.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatInputModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  model$: Observable<InferenceSession>;

  title = 'birdnet-ui';

  constructor(private modelLoader: ModelLoaderService, private img2tensor: Img2tensorService, 
    private modelInference: ModelInferenceService,
    private modelInterpreter: ModelInterpreterService) {
    this.model$ = this.modelLoader.loadModel('assets/bird_model.onnx').pipe(tap((session) => {
      console.log('Model loaded successfully');
    }));
  }

  onFileChange($event: Event) {
    this.model$.subscribe((model) => {
      // read the file contents as a buffer
      const file = ($event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async () => {
          await this.processImage(reader.result as ArrayBuffer, model);
        };

        reader.readAsArrayBuffer(file);
      }
    });
  }
  async processImage(data: ArrayBuffer, model: InferenceSession) {
    const blob = new Blob([data]); 

    this.modelInference.inferModel(model, await this.img2tensor.img2tensor(blob)).subscribe((output) => {
      console.log(output)
      const labels = this.modelInterpreter.interpretOutput(output.data as Float32Array);
      console.log(labels);
      
    });
  }
}
