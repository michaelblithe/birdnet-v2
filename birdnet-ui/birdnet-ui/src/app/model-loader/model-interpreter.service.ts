import { Injectable } from '@angular/core';
// import labels.json file from assets folder
import labels from '../../assets/labels.json';

export interface InferenceResult {
  name: string;
  score: number;
}

@Injectable({
  providedIn: 'root'
})
export class ModelInterpreterService {

  public interpretOutput(output: Float32Array): InferenceResult[] {
    // Get the top 5 results from the output

    // Create an array of indices from 0 to 99
    const indices = Array.from(Array(output.length).keys());

    // Sort the indices based on the output values
    indices.sort((a, b) => output[b] - output[a]);

    // Get the top 5 indices
    const top5Indices = indices.slice(0, 5);

    console.log(labels);
    // Map the indices to their corresponding labels and return the pair

    const top5Labels = top5Indices.map((index) => {
      return {name: labels[index], score: output[index]};
    });

    return top5Labels;
  }

}
