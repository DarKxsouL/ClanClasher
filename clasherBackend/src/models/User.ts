import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  firebaseUid: string;
  email: string;
  displayName?: string;
  villages: mongoose.Types.ObjectId[]; // References to Saved Village Data
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  displayName: { type: String },
  villages: [{ type: Schema.Types.ObjectId, ref: 'Village' }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);