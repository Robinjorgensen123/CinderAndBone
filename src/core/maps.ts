import { type TerrainType, type Tile } from "./types";

export function buildTilesFromLayout(layout: string[]): {
  width: number;
  height: number;
  tiles: Tile[][];
} {
  const height = layout.length;
  const width = layout[0].length;

  const charToTerrain: Record<string, TerrainType> = {
    "#": "WALL",
    "+": "DOOR_CLOSED",
    ">": "STAIRS_DOWN",
  };

  const tiles: Tile[][] = layout.map((row) =>
    row.split("").map((ch) => ({
      Terrain: charToTerrain[ch] ?? "FLOOR",
      explored: true,
      visible: true,
      hasCorpse: false,
    })),
  );

  return { width, height, tiles };
}
