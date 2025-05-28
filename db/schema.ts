// models/index.ts
import mongoose, { Document, Types } from 'mongoose';

// Car Interface and Model (your existing code)
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

export type CarLean = Omit<ICar, keyof Document> & {
  _id: Types.ObjectId;
  __v?: number;
};

const CarSchema = new mongoose.Schema<ICar>({
  name: { type: String, required: true },
  overview: { type: String },
  images: { type: [String], required: true },
  body: { type: String },
  mileage: { type: Number },
  fuelType: { type: String, required: true },
  manufacturer: { type: String, required: true },
  transmission: { type: String, required: true },
  year: { type: Number, required: true },
  driveType: { type: String, required: true },
  condition: { type: String, required: true },
  engineSize: { type: Number },
  doors: { type: Number, required: true },
  price: { type: Number, required: true },
  cylinders: { type: Number },
  color: { type: String, required: true }
});

// Site Content Interface and Model
export interface IBrand {
  name: string;
  image: string;
}

export interface IWhyChooseUsItem {
  heading: string;
  text: string;
}

export interface IWhoAreWe {
  heading: string;
  subtitle: string;
  listOfBenefits: string[];
}

export interface IProsAndCons {
  pros: {
    heading: string;
    text: string;
  };
  cons: {
    heading: string;
    text: string;
  };
}

export interface IGetInTouch {
  salesCard: {
    heading: string;
    subheading: string;
    buttonText: string;
  };
  teamCard: {
    heading: string;
    subheading: string;
    buttonText: string;
  };
}

export interface ISiteContent extends Document {
  _id: string;
  hero: string;
  subtitle: string;
  heroImage: string;
  brands: IBrand[];
  whoAreWe: IWhoAreWe;
  whyChooseUs: IWhyChooseUsItem[];
  prosAndCons: IProsAndCons;
  getInTouch: IGetInTouch;
  createdAt?: Date;
  updatedAt?: Date;
}

export type SiteContentLean = Omit<ISiteContent, keyof Document> & {
  _id: Types.ObjectId;
  __v?: number;
};

const siteContentSchema = new mongoose.Schema<ISiteContent>({
  hero: { type: String, required: true },
  subtitle: { type: String, required: true },
  heroImage: { type: String },
  brands: [{
    name: { type: String, required: true },
    image: { type: String, required: true }
  }],
  whoAreWe: {
    heading: { type: String, required: true },
    subtitle: { type: String, required: true },
    listOfBenefits: [{ type: String }]
  },
  whyChooseUs: [{
    heading: { type: String, required: true },
    text: { type: String, required: true }
  }],
  prosAndCons: {
    pros: {
      heading: { type: String, required: true },
      text: { type: String, required: true }
    },
    cons: {
      heading: { type: String, required: true },
      text: { type: String, required: true }
    }
  },
  getInTouch: {
    salesCard: {
      heading: { type: String, required: true },
      subheading: { type: String, required: true },
      buttonText: { type: String, required: true }
    },
    teamCard: {
      heading: { type: String, required: true },
      subheading: { type: String, required: true },
      buttonText: { type: String, required: true }
    }
  }
}, {
  timestamps: true
});

// Prevent model overwrite in development
export const Car = mongoose.models.Car || mongoose.model<ICar>('Car', CarSchema);
export const SiteContent = mongoose.models.SiteContent || mongoose.model<ISiteContent>('SiteContent', siteContentSchema);

// Default brands data
export const defaultBrands: IBrand[] = [
  { name: "Mercedes-Benz", image: "/mercedes log.webp" },
  { name: "Lexus", image: "/lexus logo.webp" },
  { name: "Toyota", image: "/Toyota logo.webp" },
  { name: "Rolls-Royce", image: "/Roll royce lgog.webp" },
  { name: "Range-Rover", image: "/land rover logo.webp" },
  { name: "Bentley", image: "/bentley logo.webp" },
  { name: "Ford", image: "/ford logo.webp" },
  { name: "BMW", image: "/bmw logo.webp" },
  { name: "GAC", image: "/GAC logo.webp" },
  { name: "Innoson", image: "/innoson logo.webp" },
  { name: "NORD", image: "/nord logo.webp" },
  { name: "Peugeot", image: "/peugeot logo.webp" }
];