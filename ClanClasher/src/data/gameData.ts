// This file is now deprecated - data comes from backend API
// Keeping for type definitions that might be used elsewhere

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

// Deprecated - use data from /api/village/game-data instead
export const BUILDINGS_DATA: GameItem[] = [];

export const ATTACK_DATA = {
  equipments: [] as GameItem[],
  spells: [] as GameItem[],
};