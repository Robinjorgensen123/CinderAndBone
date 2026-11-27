export interface PlayableClass {
  id: string;
  name: string;
  maxHp: number;
  attack: number;
  defense: number;
}

export const PLAYABLE_CLASSES = new Map<string, PlayableClass>([
  [
    "alchemist",
    {
      id: "alchemist",
      name: "Alchemist",
      maxHp: 16,
      attack: 5,
      defense: 1,
    },
  ],
  [
    "necromancer",
    {
      id: "necromancer",
      name: "Necromancer",
      maxHp: 15,
      attack: 4,
      defense: 1,
    },
  ],
]);
