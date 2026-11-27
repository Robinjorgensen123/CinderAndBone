export interface EnemyTemplate {
  id: string;
  name: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number; // Hur mycket 'time' ett drag kostar (1.0 = normal)
}

export const ENEMY_TEMPLATES = new Map<string, EnemyTemplate>([
  [
    "sewer_rat",
    {
      id: "sewer_rat",
      name: "Sewer Rat",
      hp: 8,
      attack: 3,
      defense: 0,
      speed: 1.0,
    },
  ],
]);
