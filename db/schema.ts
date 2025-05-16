import mongoose, { Document, Types } from 'mongoose';

export interface ICar extends Document {
  id: number;
  name: string;
  overview: string;
  images: string[];
  body: string;
  mileage: number;
  fuelType: string;
  manufacturer: string;
  transmission: string;
  year: number;
  driveType: string;
  condition: string;
  engineSize: number;
  doors: number;
  price: number;
  cylinders: number;
  color: string;
}

// This represents the lean version of the document
export type CarLean = Omit<ICar, keyof Document> & {
  _id: Types.ObjectId;
  __v?: number;
};


const CarSchema = new mongoose.Schema<ICar>({
  name: { type: String, required: true },
  overview: { type: String },
  images: { type: [String], required: true },
  body: { type: String },
  mileage: { type: Number,},
  fuelType: { type: String, required: true },
  manufacturer: { type: String, required: true },
  transmission: { type: String, required: true },
  year: { type: Number, required: true },
  driveType: { type: String, required: true },
  condition: { type: String, required: true },
  engineSize: { type: Number },
  doors: { type: Number, required: true },
  price: { type: Number, required: true },
  cylinders: { type: Number},
  color: { type: String, required: true }
});

// Prevent model overwrite in development
const Car = mongoose.models.Car || mongoose.model<ICar>('Car', CarSchema);

export default Car;