import mongoose, { Schema } from 'mongoose';

// Level schema used across multiple document types
interface Level {
  level: number;
  [key: string]: any;
}

const levelSchema = new Schema({
  level: { type: Number, required: true },
}, { strict: false, _id: false });

// ===== BUILDINGS SCHEMA =====
interface Building {
  _id: number;
  name: string;
  info?: string;
  TID?: {
    name: string;
    info: string;
  };
  type?: string;
  upgrade_resource?: string;
  village?: string;
  width?: number;
  superchargeable?: boolean;
  levels?: Level[];
}

const buildingSchema = new Schema<Building>({
  _id: { type: Number, required: true },
  name: { type: String, required: true },
  info: String,
  TID: {
    name: String,
    info: String,
  },
  type: String,
  upgrade_resource: String,
  village: String,
  width: Number,
  superchargeable: Boolean,
  levels: [levelSchema],
}, { timestamps: true });

// ===== TRAPS SCHEMA =====
interface Trap {
  _id: number;
  name: string;
  info?: string;
  TID?: {
    name: string;
    info: string;
  };
  type?: string;
  upgrade_resource?: string;
  village?: string;
  levels?: Level[];
}

const trapSchema = new Schema<Trap>({
  _id: { type: Number, required: true },
  name: { type: String, required: true },
  info: String,
  TID: {
    name: String,
    info: String,
  },
  type: String,
  upgrade_resource: String,
  village: String,
  levels: [levelSchema],
}, { timestamps: true });

// ===== TROOPS SCHEMA =====
interface Troop {
  _id: number;
  name: string;
  info?: string;
  TID?: {
    name: string;
    info: string;
  };
  production_building?: string;
  production_building_level?: number;
  upgrade_resource?: string;
  is_flying?: boolean;
  is_air_targeting?: boolean;
  is_ground_targeting?: boolean;
  movement_speed?: number;
  attack_speed?: number;
  attack_range?: number;
  housing_space?: number;
  village?: string;
  levels?: Level[];
}

const troopSchema = new Schema<Troop>({
  _id: { type: Number, required: true },
  name: { type: String, required: true },
  info: String,
  TID: {
    name: String,
    info: String,
  },
  production_building: String,
  production_building_level: Number,
  upgrade_resource: String,
  is_flying: Boolean,
  is_air_targeting: Boolean,
  is_ground_targeting: Boolean,
  movement_speed: Number,
  attack_speed: Number,
  attack_range: Number,
  housing_space: Number,
  village: String,
  levels: [levelSchema],
}, { timestamps: true });

// ===== GUARDIANS SCHEMA =====
interface Guardian {
  _id: number;
  name: string;
  info?: string;
  TID?: {
    name: string;
    info: string;
  };
  village?: string;
  levels?: Level[];
  [key: string]: any;
}

const guardianSchema = new Schema<Guardian>({
  _id: { type: Number, required: true },
  name: { type: String, required: true },
  info: String,
  TID: {
    name: String,
    info: String,
  },
  village: String,
  levels: [levelSchema],
}, { timestamps: true, strict: false });

// ===== SPELLS SCHEMA =====
interface Spell {
  _id: number;
  name: string;
  info?: string;
  TID?: {
    name: string;
    info: string;
  };
  production_building?: string;
  production_building_level?: number;
  upgrade_resource?: string;
  housing_space?: number;
  levels?: Level[];
}

const spellSchema = new Schema<Spell>({
  _id: { type: Number, required: true },
  name: { type: String, required: true },
  info: String,
  TID: {
    name: String,
    info: String,
  },
  production_building: String,
  production_building_level: Number,
  upgrade_resource: String,
  housing_space: Number,
  levels: [levelSchema],
}, { timestamps: true });

// ===== HEROES SCHEMA =====
interface Hero {
  _id: number;
  name: string;
  info?: string;
  TID?: {
    name: string;
    info: string;
  };
  village?: string;
  levels?: Level[];
  [key: string]: any;
}

const heroSchema = new Schema<Hero>({
  _id: { type: Number, required: true },
  name: { type: String, required: true },
  info: String,
  TID: {
    name: String,
    info: String,
  },
  village: String,
  levels: [levelSchema],
}, { timestamps: true, strict: false });

// ===== PETS SCHEMA =====
interface Pet {
  _id: number;
  name: string;
  info?: string;
  TID?: {
    name: string;
    info: string;
  };
  levels?: Level[];
  [key: string]: any;
}

const petSchema = new Schema<Pet>({
  _id: { type: Number, required: true },
  name: { type: String, required: true },
  info: String,
  TID: {
    name: String,
    info: String,
  },
  levels: [levelSchema],
}, { timestamps: true, strict: false });

// ===== EQUIPMENT SCHEMA =====
interface Equipment {
  _id: number;
  name: string;
  info?: string;
  TID?: {
    name: string;
    info: string;
  };
  levels?: Level[];
  [key: string]: any;
}

const equipmentSchema = new Schema<Equipment>({
  _id: { type: Number, required: true },
  name: { type: String, required: true },
  info: String,
  TID: {
    name: String,
    info: String,
  },
  levels: [levelSchema],
}, { timestamps: true, strict: false });

// ===== HELPERS SCHEMA =====
interface Helper {
  _id: number;
  name: string;
  info?: string;
  TID?: {
    name: string;
    info: string;
  };
  levels?: Level[];
  [key: string]: any;
}

const helperSchema = new Schema<Helper>({
  _id: { type: Number, required: true },
  name: { type: String, required: true },
  info: String,
  TID: {
    name: String,
    info: String,
  },
  levels: [levelSchema],
}, { timestamps: true, strict: false });

// Create models for each collection
export const BuildingModel = mongoose.model<Building>('Building', buildingSchema);
export const TrapModel = mongoose.model<Trap>('Trap', trapSchema);
export const TroopModel = mongoose.model<Troop>('Troop', troopSchema);
export const GuardianModel = mongoose.model<Guardian>('Guardian', guardianSchema);
export const SpellModel = mongoose.model<Spell>('Spell', spellSchema);
export const HeroModel = mongoose.model<Hero>('Hero', heroSchema);
export const PetModel = mongoose.model<Pet>('Pet', petSchema);
export const EquipmentModel = mongoose.model<Equipment>('Equipment', equipmentSchema);
export const HelperModel = mongoose.model<Helper>('Helper', helperSchema);

export default {
  BuildingModel,
  TrapModel,
  TroopModel,
  GuardianModel,
  SpellModel,
  HeroModel,
  PetModel,
  EquipmentModel,
  HelperModel,
};
