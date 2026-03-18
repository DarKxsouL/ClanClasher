import mongoose, { Schema, Document } from 'mongoose';

const LevelSchema = new Schema({
  level: Number,
  build_cost: Number,
  build_time: Number, // in seconds
  required_townhall: Number,
  hitpoints: Number,
  dps: Number
});

const BuildingDataSchema = new Schema({
  _id: Number,
  name: String,
  type: String,
  upgrade_resource: String,
  village: String,
  levels: [LevelSchema]
});

export default mongoose.model('BuildingData', BuildingDataSchema);