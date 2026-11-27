import { type Actor, type Tile } from "./types";
import { ENEMY_TEMPLATES } from "./enemies";
import { PLAYABLE_CLASSES } from "./classes";

export class Engine {
  width = 18;
  height = 12;
  tiles: Tile[][] = [];
  actors: Actor[] = [];
  logs: string[] = ["Welcome to Cinder and Bone!"];

  constructor() {
    this.initMap();
    this.spawnActors();
  }

  private initMap() {
    const layout = [
      "##################",
      "#......#.........#",
      "#......#.........#",
      "#......+.........#",
      "#......#.........#",
      "#......#....>....#",
      "##################",
    ];

    this.height = layout.length;
    this.width = layout[0].length;

    this.tiles = layout.map((row) =>
      row.split("").map((ch) => ({
        Terrain:
          ch === "#"
            ? "WALL"
            : ch === "+"
              ? "DOOR_CLOSED"
              : ch === ">"
                ? "STAIRS_DOWN"
                : "FLOOR",
        explored: true,
        visible: true,
        hasCorpse: false,
      })),
    );
  }

  private spawnActors() {
    const playerClass = PLAYABLE_CLASSES.get("alchemist")!;
    const ratTemplate = ENEMY_TEMPLATES.get("sewer_rat")!;

    this.actors = [
      {
        id: "player",
        name: playerClass.name,
        pos: { x: 2, y: 2 },
        hp: playerClass.maxHp,
        maxHp: playerClass.maxHp,
        attack: playerClass.attack,
        defence: playerClass.defense,
        time: 0,
        isPlayer: true,
      },
      {
        id: "rat1",
        name: ratTemplate.name,
        pos: { x: 5, y: 5 },
        hp: ratTemplate.hp,
        maxHp: ratTemplate.hp,
        attack: ratTemplate.attack,
        defence: ratTemplate.defense,
        time: 0,
        isPlayer: false,
      },
    ];
  }

  getPlayer(): Actor {
    return this.actors.find((a) => a.isPlayer)!;
  }

  getActorAt(x: number, y: number): Actor | undefined {
    return this.actors.find((a) => a.hp > 0 && a.pos.x === x && a.pos.y === y);
  }

  handleTileTap(targetX: number, targetY: number): boolean {
    const player = this.getPlayer();
    if (player.hp <= 0) return false;

    // Tryck på dig själv = vänta 1 tur
    if (targetX === player.pos.x && targetY === player.pos.y) {
      player.time += 1.0;
      this.logs = ["You wait a turn.", ...this.logs].slice(0, 6);
      this.processEnemyTurns();
      return true;
    }

    const dx = Math.sign(targetX - player.pos.x);
    const dy = Math.sign(targetY - player.pos.y);

    // 4-vägs rörelse (horisontellt först, annars vertikalt)
    const nextX = dx !== 0 ? player.pos.x + dx : player.pos.x;
    const nextY = dx !== 0 ? player.pos.y : player.pos.y + dy;

    const tile = this.tiles[nextY]?.[nextX];
    if (!tile || tile.Terrain === "WALL") return false;

    const targetActor = this.getActorAt(nextX, nextY);
    if (targetActor && !targetActor.isPlayer) {
      this.attack(player, targetActor);
      player.time += 1.0;
    } else {
      if (tile.Terrain === "DOOR_CLOSED") {
        tile.Terrain = "DOOR_OPEN";
        this.logs = ["You open the door.", ...this.logs].slice(0, 6);
      }
      player.pos = { x: nextX, y: nextY };
      player.justMovedThroughDoor = tile.Terrain === "DOOR_OPEN";
      player.time += 1.0;
    }

    this.processEnemyTurns();
    return true;
  }

  private processEnemyTurns() {
    const player = this.getPlayer();

    while (true) {
      const next = this.actors
        .filter((a) => a.hp > 0)
        .sort((a, b) => a.time - b.time)[0];

      if (!next || next.isPlayer) break;

      const dx = Math.sign(player.pos.x - next.pos.x);
      const dy = Math.sign(player.pos.y - next.pos.y);
      const stepX = dx !== 0 ? next.pos.x + dx : next.pos.x;
      const stepY = dx !== 0 ? next.pos.y : next.pos.y + dy;

      if (stepX === player.pos.x && stepY === player.pos.y) {
        this.attack(next, player);
      } else {
        const tile = this.tiles[stepY]?.[stepX];
        if (tile && tile.Terrain !== "WALL" && !this.getActorAt(stepX, stepY)) {
          if (tile.Terrain === "DOOR_CLOSED") tile.Terrain = "DOOR_OPEN";
          next.pos = { x: stepX, y: stepY };
          next.justMovedThroughDoor = tile.Terrain === "DOOR_OPEN";
        }
      }

      next.time += 1.0;
    }
  }

  private attack(attacker: Actor, defender: Actor) {
    const isSurprise =
      attacker.isPlayer && Boolean(defender.justMovedThroughDoor);
    const dmg = Math.max(
      1,
      attacker.attack - defender.defence + (isSurprise ? 3 : 0),
    );
    defender.hp -= dmg;
    defender.justMovedThroughDoor = false;

    const prefix = isSurprise ? "SURPRISE! " : "";
    this.logs = [
      `${prefix}${attacker.name} hits ${defender.name} for ${dmg}.`,
      ...this.logs,
    ].slice(0, 6);

    if (defender.hp <= 0) {
      this.tiles[defender.pos.y][defender.pos.x].hasCorpse = true;
      this.logs = [`${defender.name} is defeated!`, ...this.logs].slice(0, 6);
    }
  }
}
