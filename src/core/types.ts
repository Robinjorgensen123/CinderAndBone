export type TerrainType =
  | "WALL"
  | "FLOOR"
  | "DOOR_CLOSED"
  | "DOOR_OPEN"
  | "STAIRS_DOWN";

export interface Position {
  x: number;
  y: number;
}

export interface Tile {
  Terrain: TerrainType;
  explored: boolean;
  visible: boolean;
  hasCorpse: boolean;
}

export interface Actor {
  id: string;
  name: string;
  pos: Position;
  hp: number;
  maxHp: number;
  attack: number;
  defence: number;
  time: number;
  isPlayer: boolean;
  justMovedThroughDoor?: boolean;
}


