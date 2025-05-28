import { MouseEventHandler } from "react";
import { z } from 'zod';

export interface CustomButtonProps {
  title: string;
  containerStyles?: string;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
  btnType?: "button" | "submit";
  textStyles?: string;
  rightIcon?:string;
  isDisabled?:boolean
}

export interface SearchManufacturerProps {
  manufacturer: string;
  setManufacturer: (manufacturer: string) => void;
}

 // types.ts
export interface CarProps {
  _id: string;  // Changed from id: number to use MongoDB's _id
  name: string;
  overview: string;
  images: string[];
  body: string;
  mileage: number;
  fuelType: string;
  manufacturer: string | null;
  transmission: string;
  year: number;
  driveType: string;
  condition: string;
  engineSize: number | null;
  doors: number;
  price: number;
  cylinders: number | null;
  color: string;
}

export  const carSchema = z.object({
  name: z.string(),
  overview: z.string(),
  images: z.array(z.string()),
  body: z.string(),
  mileage: z.number(),
  fuelType: z.string(),
  manufacturer: z.string(),
  transmission: z.string(),
  year: z.number(),
  driveType: z.string(),
  condition: z.string(),
  engineSize: z.string(),
  doors: z.number(),
  price: z.number(),
  cylinders: z.number(),
  color: z.string()
});
  export interface CarDetailsProps {
    isOpen:boolean,
    closeModal: () => void;
    car:CarProps
  }

  export interface FilterProps{
    manufacturer: string;
    year: number;
    fuel: string;
    limit: number;
    model: string;
  }
   export interface OptionProps {
    title: string;
    value:string
  }
  
  export interface CustomFilterProps {
    title: string,
    options: OptionProps[];
    
  }

  // Define your types
type CarStatus = "available" | "sold" | "pending";
 
type Car = {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  status: string;
};

interface RecentCar {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  status: string;
}

export interface DashboardDataTypes {
  totalCars: number;
  totalValue: number;
  recentCars: Car[];
};