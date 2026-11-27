export const PALETTE: Record<string, string> = {
  ".": "", // Transparent
  k: "#0b0d12", // Skarp mörk kontur
  s: "#171c26", // Djup skugga
  g: "#3b4458", // Mellangrå sten
  l: "#5d6a85", // Ljusare stenhighlight
  d: "#252b38", // Mörkare sten
  w: "#6b3e1d", // Mörkt trä
  W: "#a66734", // Ljust trä
  y: "#e0b15c", // Guld / mässing
  i: "#9aa6ba", // Järn
  b: "#263f61", // Mörkblå mantel
  B: "#4e82c4", // Ljusblå mantel
  h: "#e8c29d", // Hudton
  H: "#c4966e", // Skuggad hud
  p: "#2ed573", // Alkemistbrygd (grön)
  P: "#b8ffd6", // Ljusglans i brygden
  r: "#75554c", // Råttpäls
  R: "#a87e72", // Ljus råttpäls
  t: "#d98996", // Rosa svans & öron
  e: "#ff4757", // Rött öga
  c: "#8a2634", // Blod
  C: "#ded7c8", // Ben / skalle
  f: "#ff9f43", // Varm glöd / gnista
};

export const SPRITES = {
  ALCHEMIST: [
    ".....kkkkkk.....",
    "....kBBBBBBk....",
    "...kBBBBBBBBk...",
    "...kBkkkkkkBk...",
    "....khhhhhhk....",
    "....khkhhkhk....",
    "....kHHHHHHk....",
    "...kbbbbbbbbk...",
    "..kBBBBbbbbBBk..",
    ".kBBbBBBBBBbBBk.",
    ".khhbBBBBBBbPpk.",
    "..kkbbbbbbbbppk.",
    "...kbbbbbbbbkk..",
    "...kbbbbbbbbk...",
    "....kbb..bbk....",
    "....kss..ssk....",
  ],
  SEWER_RAT: [
    "................",
    "................",
    "....kk....kk....",
    "...kttk..kttk...",
    "...ktrrrrrrtk...",
    "....kRRRRRRk....",
    "...kRReRRReRk...",
    "..kRRRRRRRRRRk..",
    ".kRRRRRRRRRRRRk.",
    ".krrrrrrrrrrrrk.",
    "..kkrrrrrrrrkk.k",
    "...krrk..krrk.kt",
    "...kkk....kkk.kt",
    ".............ktk",
    "..............kk",
    "................",
  ],
  CORPSE: [
    "................",
    "................",
    "................",
    "......kkkk......",
    ".....kCCCCk.....",
    "....kCCCCCCk....",
    "....kCkCCkCk....",
    ".....kCCCCk.....",
    "...cc.kCCk.cc...",
    "..cccckkkkcccc..",
    ".cccccccccccccc.",
    "..cccckkkkcccc..",
    "....cc....cc....",
    "................",
    "................",
    "................",
  ],
  STAIRS_DOWN: [
    "kkkkkkkkkkkkkkkk",
    "kggggggggggggggk",
    "kgssssssssssssgk",
    "kgsllllllllllsgk",
    "kgsddddddddddsgk",
    "kgssssssssssssgk",
    "kgsllllllllllsgk",
    "kgsddddddddddsgk",
    "kgssssssssssssgk",
    "kgsllllllllllsgk",
    "kgsddddddddddsgk",
    "kgssssssssssssgk",
    "kgsllllllllllsgk",
    "kgssssssssssssgk",
    "kggggggggggggggk",
    "kkkkkkkkkkkkkkkk",
  ],
} as const;

export type SpriteName = keyof typeof SPRITES;
