import { Injectable } from '@angular/core';
import { Tensor } from 'onnxruntime-web';

@Injectable({
  providedIn: 'root'
})
export class Img2tensorService {

  /**
   * Converts an image blob to a tensor.
   * @param blob - The image blob to convert.
   * @returns A promise that resolves to the converted tensor.
   */
  public async img2tensor(blob: Blob): Promise<Tensor> {
        const width = 224;
        const height = 224;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Failed to get context on canvas');
        }

        const img = await createImageBitmap(blob);
        ctx.drawImage(img, 0, 0, width, height);

        const imageData = ctx.getImageData(0, 0, width, height).data;
        // Convert the image to a ternsor

        const data = new Float32Array(width * height * 3);
        // Convert the image data to normalized values and store in the data array
        for (let i = 0; i < height * width; i++) {
          data[i] = imageData[i * 4] / 255;
          data[i + height * width] = imageData[i * 4 + 1] / 255;
          data[i + height * width * 2] = imageData[i * 4 + 2] / 255;
        }

        const tensor = new Tensor('float32', data, [1, 3, width, height]);
        return tensor;
      }
    }