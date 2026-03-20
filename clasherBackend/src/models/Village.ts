import mongoose, { Schema, Document } from 'mongoose';

export interface IVillage extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;      // Added
  rawData: any;
  townHallLevel: number;
  updatedAt: Date;
}

const VillageSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: false },
  name: { type: String, default: "Main Base" }, // Added
  rawData: { type: Object, required: true },
  townHallLevel: { type: Number, default: 1 },
  updatedAt: { type: Date, default: Date.now }
});

// Ensure there are no unique indexes on userId alone in Atlas
export default mongoose.model<IVillage>('Village', VillageSchema);