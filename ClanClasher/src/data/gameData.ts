export interface LevelData {
  level: number;
  value: number; // HP for buildings, Damage for troops/spells
  thRequired: number;
}

export interface GameItem {
  id: string;
  name: string;
  type: 'flat' | 'percent';
  levels: LevelData[];
}

export const BUILDINGS_DATA: GameItem[] = [
  {
    id: 'inferno_tower',
    name: 'Inferno Tower',
    type: 'flat',
    levels: [
      { level: 1, value: 1500, thRequired: 10 },
      { level: 5, value: 2700, thRequired: 12 },
      { level: 9, value: 4200, thRequired: 16 },
    ]
  },
  // Add Eagle Artillery, Air Defense, etc.
];

export const ATTACK_DATA = {
  equipments: [
    { id: 'fireball', name: 'Fireball', type: 'flat' as const, levels: [{ level: 1, value: 1000, thRequired: 11 }, { level: 18, value: 2500, thRequired: 16 }] },
    { id: 'giant_arrow', name: 'Giant Arrow', type: 'flat' as const, levels: [{ level: 1, value: 750, thRequired: 9 }, { level: 18, value: 2000, thRequired: 16 }] },
  ],
  spells: [
    { id: 'lightning', name: 'Lightning', type: 'flat' as const, levels: [{ level: 9, value: 560, thRequired: 13 }, { level: 11, value: 640, thRequired: 15 }] },
    { id: 'earthquake', name: 'Earthquake', type: 'percent' as const, levels: [{ level: 5, value: 29, thRequired: 12 }] },
  ],
  // ... add troops and siege machines
};