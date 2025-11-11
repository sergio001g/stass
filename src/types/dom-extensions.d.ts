declare global {
  interface HTMLMediaElement {
    captureStream(frameRate?: number): MediaStream;
  }
}

export {}