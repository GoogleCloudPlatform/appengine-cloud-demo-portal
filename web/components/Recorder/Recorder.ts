/**
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export type Canvas = {
  width: number;
  height: number;
  context: CanvasRenderingContext2D;
};

class DisplayRecorder {
  stream: MediaStream | null;
  recorder: MediaRecorder | null;
  chunks: Blob[];
  callback: ((blob: Blob) => Promise<void>) | null;
  canvas: Canvas;

  constructor(canvas: Canvas) {
    this.stream = null;
    this.recorder = null;
    this.chunks = [];
    this.callback = null;
    this.canvas = canvas;
  }

  async start(): Promise<void> {
    if (this.stream !== null) {
      throw new Error("already recording (stream is not null)");
    }
    if (this.recorder !== null) {
      throw new Error("already recording");
    }

    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.visualize(this.stream);

    this.recorder = new MediaRecorder(this.stream);
    this.recorder.onstop = this.onStop;
    this.recorder.ondataavailable = this.onDataAvailable;
    this.recorder.start();
  }

  stop(callback: (blob: Blob) => Promise<void>): void {
    if (this.recorder === null) {
      throw new Error("not recording");
    }
    this.callback = callback;
    this.recorder.stop();
  }

  onDataAvailable = (event: BlobEvent): void => {
    this.chunks.push(event.data);
  };

  onStop: EventListener = async () => {
    if (this.stream === null) throw new Error("not recording");
    try {
      this.stream.getAudioTracks()[0].stop();
      const blob = new Blob(this.chunks, { type: "audio/webm" });
      if (this.callback !== null) {
        await this.callback(blob);
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.recorder = null;
      this.stream = null;
      this.chunks = [];
    }
  };

  visualize(stream: MediaStream): void {
    const context = new AudioContext();
    const source = context.createMediaStreamSource(stream);
    const analyser = context.createAnalyser();
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);

    const canvas = this.canvas;

    const draw = (): void => {
      requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      canvas.context.fillStyle = "rgb(255, 255, 255)";
      canvas.context.fillRect(0, 0, canvas.width, canvas.height);

      canvas.context.lineWidth = 2;
      if (this.recorder === null) {
        canvas.context.strokeStyle = "rgb(230, 230, 230)";
      } else {
        canvas.context.strokeStyle = "rgb(0, 0, 0)";
      }

      canvas.context.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          canvas.context.moveTo(x, y);
        } else {
          canvas.context.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvas.context.lineTo(canvas.width, canvas.height / 2);
      canvas.context.stroke();
    };

    draw();
  }
}

export { DisplayRecorder };
