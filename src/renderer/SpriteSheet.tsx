export interface SpriteRegion {
  col: number;
  row: number;
  w?: number; // antal 16px-rutor bred (default 1)
  h?: number; // antal 16px-rutor hög (default 1)
}

export class SpriteSheet {
  private image: HTMLImageElement;
  private loaded = false;
  readonly cellSize: number;

  constructor(src: string, cellSize = 16, onLoad?: () => void) {
    this.cellSize = cellSize;
    this.image = new Image();
    this.image.src = src;
    this.image.onload = () => {
      this.loaded = true;
      onLoad?.();
    };
  }

  get isReady(): boolean {
    return this.loaded;
  }

  draw(
    ctx: CanvasRenderingContext2D,
    region: SpriteRegion,
    dx: number,
    dy: number,
    destWidth: number,
    destHeight: number,
  ) {
    if (!this.loaded) return false;

    const sx = region.col * this.cellSize;
    const sy = region.row * this.cellSize;
    const sw = (region.w ?? 1) * this.cellSize;
    const sh = (region.h ?? 1) * this.cellSize;

    ctx.drawImage(this.image, sx, sy, sw, sh, dx, dy, destWidth, destHeight);
    return true;
  }
}
