import { Engine } from "../core/Engine";
import { PALETTE, SPRITES, type SpriteName } from "./sprites";
import { SpriteSheet, type SpriteRegion } from "./SpriteSheet";

// Mappa spelets objekt till (kolumn, rad) i ditt 16x16 PNG-spritesheet
const SHEET_MAP: Record<string, SpriteRegion> = {
  FLOOR: { col: 1, row: 4 },
  WALL: { col: 2, row: 1 },
  DOOR_CLOSED: { col: 5, row: 6 },
  DOOR_OPEN: { col: 6, row: 6 },
  STAIRS_DOWN: { col: 7, row: 6 },
  ALCHEMIST: { col: 8, row: 2 },
  SEWER_RAT: { col: 23, row: 8 },
  CORPSE: { col: 14, row: 11 },
};

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private sheet: SpriteSheet;

  readonly pixelScale = 3;
  readonly tileSize = 16 * 3; // 48px per ruta
  readonly viewCols = 15; // Antal rutor synliga i sidled
  readonly viewRows = 11; // Antal rutor synliga i höjdled

  // Kamerans övre vänstra hörn i pixelkoordinater (världskoordinater)
  cameraX = 0;
  cameraY = 0;

  constructor(canvas: HTMLCanvasElement, onAssetLoad?: () => void) {
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Could not initialize 2D context");
    }
    this.ctx = context;
    this.sheet = new SpriteSheet("/assets/dungeon.png", 16, onAssetLoad);
  }

  private updateCamera(engine: Engine) {
    const { tileSize, viewCols, viewRows } = this;
    const player = engine.getPlayer();

    const viewWidth = viewCols * tileSize;
    const viewHeight = viewRows * tileSize;
    const worldWidth = engine.width * tileSize;
    const worldHeight = engine.height * tileSize;

    // Centrera kameran på spelaren
    const targetX = player.pos.x * tileSize + tileSize / 2 - viewWidth / 2;
    const targetY = player.pos.y * tileSize + tileSize / 2 - viewHeight / 2;

    // Kläm fast kameran inom kartans gränser (eller centrera om kartan är mindre än skärmen)
    this.cameraX =
      worldWidth <= viewWidth
        ? (worldWidth - viewWidth) / 2
        : Math.max(0, Math.min(targetX, worldWidth - viewWidth));

    this.cameraY =
      worldHeight <= viewHeight
        ? (worldHeight - viewHeight) / 2
        : Math.max(0, Math.min(targetY, worldHeight - viewHeight));
  }

  private drawFallbackSprite(name: SpriteName, px: number, py: number) {
    const { ctx, pixelScale } = this;
    const rows = SPRITES[name];
    for (let y = 0; y < rows.length; y++) {
      for (let x = 0; x < rows[y].length; x++) {
        const color = PALETTE[rows[y][x]];
        if (!color) continue;
        ctx.fillStyle = color;
        ctx.fillRect(
          px + x * pixelScale,
          py + y * pixelScale,
          pixelScale,
          pixelScale,
        );
      }
    }
  }

  private drawEntity(
    key: string,
    fallback: SpriteName | null,
    px: number,
    py: number,
  ) {
    const region = SHEET_MAP[key];
    if (
      region &&
      this.sheet.draw(this.ctx, region, px, py, this.tileSize, this.tileSize)
    ) {
      return;
    }
    if (fallback) {
      this.drawFallbackSprite(fallback, px, py);
    }
  }

  render(engine: Engine) {
    const { ctx, tileSize, pixelScale, viewCols, viewRows } = this;
    ctx.canvas.width = viewCols * tileSize;
    ctx.canvas.height = viewRows * tileSize;
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = "#080a0f";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    this.updateCamera(engine);

    ctx.save();
    ctx.translate(-Math.round(this.cameraX), -Math.round(this.cameraY));

    // Räkna ut vilka rutor som faktiskt syns i kameran (prestanda för stora våningar!)
    const startCol = Math.max(0, Math.floor(this.cameraX / tileSize));
    const endCol = Math.min(
      engine.width - 1,
      Math.ceil((this.cameraX + ctx.canvas.width) / tileSize),
    );
    const startRow = Math.max(0, Math.floor(this.cameraY / tileSize));
    const endRow = Math.min(
      engine.height - 1,
      Math.ceil((this.cameraY + ctx.canvas.height) / tileSize),
    );

    for (let y = startRow; y <= endRow; y++) {
      for (let x = startCol; x <= endCol; x++) {
        const tile = engine.tiles[y][x];
        if (!tile.explored) continue;

        const px = x * tileSize;
        const py = y * tileSize;

        // Rita golv under allt utom väggar
        if (tile.Terrain !== "WALL") {
          if (
            !this.sheet.draw(ctx, SHEET_MAP.FLOOR, px, py, tileSize, tileSize)
          ) {
            ctx.fillStyle = "#262c3a";
            ctx.fillRect(px, py, tileSize, tileSize);
          }
        }

        switch (tile.Terrain) {
          case "WALL":
            if (
              !this.sheet.draw(ctx, SHEET_MAP.WALL, px, py, tileSize, tileSize)
            ) {
              ctx.fillStyle = "#40495e";
              ctx.fillRect(px, py, tileSize, tileSize);
            }
            break;
          case "DOOR_CLOSED":
            this.drawEntity("DOOR_CLOSED", null, px, py);
            break;
          case "DOOR_OPEN":
            this.drawEntity("DOOR_OPEN", null, px, py);
            break;
          case "STAIRS_DOWN":
            this.drawEntity("STAIRS_DOWN", "STAIRS_DOWN", px, py);
            break;
        }

        if (tile.hasCorpse) {
          this.drawEntity("CORPSE", "CORPSE", px, py);
        }

        if (!tile.visible) {
          ctx.fillStyle = "rgba(8, 11, 18, 0.58)";
          ctx.fillRect(px, py, tileSize, tileSize);
        }
      }
    }

    for (const actor of engine.actors) {
      if (actor.hp <= 0) continue;
      const tile = engine.tiles[actor.pos.y]?.[actor.pos.x];
      if (!tile?.visible) continue;

      const px = actor.pos.x * tileSize;
      const py = actor.pos.y * tileSize;

      // Markskugga
      ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
      ctx.fillRect(
        px + 3 * pixelScale,
        py + 14 * pixelScale,
        10 * pixelScale,
        2 * pixelScale,
      );

      if (actor.isPlayer) {
        this.drawEntity("ALCHEMIST", "ALCHEMIST", px, py);
      } else {
        this.drawEntity("SEWER_RAT", "SEWER_RAT", px, py);
      }

      if (!actor.isPlayer && actor.hp < actor.maxHp) {
        const barWidth = 12 * pixelScale;
        const barHeight = 2 * pixelScale;
        const bx = px + 2 * pixelScale;
        const by = py + pixelScale;

        ctx.fillStyle = "#0b0d12";
        ctx.fillRect(bx - 1, by - 1, barWidth + 2, barHeight + 2);
        ctx.fillStyle = "#e06c75";
        ctx.fillRect(
          bx,
          by,
          Math.round(barWidth * (actor.hp / actor.maxHp)),
          barHeight,
        );
      }
    }

    // Ljusfall runt spelaren i världskoordinater
    const player = engine.getPlayer();
    const lightX = player.pos.x * tileSize + tileSize / 2;
    const lightY = player.pos.y * tileSize + tileSize / 2;
    const gradient = ctx.createRadialGradient(
      lightX,
      lightY,
      tileSize * 0.5,
      lightX,
      lightY,
      tileSize * 5.5,
    );
    gradient.addColorStop(0, "rgba(255, 214, 153, 0.14)");
    gradient.addColorStop(0.5, "rgba(255, 190, 120, 0.03)");
    gradient.addColorStop(1, "rgba(6, 8, 14, 0.58)");
    ctx.fillStyle = gradient;
    ctx.fillRect(
      this.cameraX,
      this.cameraY,
      ctx.canvas.width,
      ctx.canvas.height,
    );

    ctx.restore();
  }
}
