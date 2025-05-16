// actions/car.actions.ts
'use server';

import { FilterQuery } from 'mongoose';
import { connectToDB } from '@/db/connectToDB';
import Car, { CarLean } from '@/db/schema';
import { CarProps } from '@/types';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export async function fetchCars(filters: {
  manufacturer?: string;
  model?: string;
  fuel?: string;
  year?: string;
  body?: string;
  minPrice?: string;
  maxPrice?: string;
}): Promise<CarProps[]> {
  try {
    await connectToDB();

    const query: FilterQuery<typeof Car> = {};

    if (filters.manufacturer) {
      query.manufacturer = { $regex: filters.manufacturer, $options: 'i' };
    }

    if (filters.model) {
      query.name = { $regex: filters.model, $options: 'i' };
    }

    if (filters.fuel) {
      query.fuelType = filters.fuel;
    }

    if (filters.year) {
      query.year = parseInt(filters.year);
    }

    if (filters.body) {
      query.body = filters.body;
    }

    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = parseInt(filters.minPrice);
      if (filters.maxPrice) query.price.$lte = parseInt(filters.maxPrice);
    }

 const cars = await Car.find(query).lean<CarLean[]>();
 
    return cars.map(car => ({
      _id: car._id.toString(), // Convert ObjectId to string
      name: car.name,
      overview: car.overview,
      images: car.images,
      body: car.body,
      mileage: car.mileage,
      fuelType: car.fuelType,
      manufacturer: car.manufacturer,
      transmission: car.transmission,
      year: car.year,
      driveType: car.driveType,
      condition: car.condition,
      engineSize: car.engineSize,
      doors: car.doors,
      price: car.price,
      cylinders: car.cylinders,
      color: car.color
    }));
  } catch (error) {
    console.error('Error fetching cars:', error);
    return [];
  }
}



export async function fetchCarById(_id: string): Promise<CarProps | null> {
  try {
    await connectToDB();
    const car = await Car.findById(_id).lean<CarLean>();
    
    if (!car) return null;

    return {
      _id: car._id.toString(),
      name: car.name,
      overview: car.overview,
      images: car.images,
      body: car.body,
      mileage: car.mileage,
      fuelType: car.fuelType,
      manufacturer: car.manufacturer,
      transmission: car.transmission,
      year: car.year,
      driveType: car.driveType,
      condition: car.condition,
      engineSize: car.engineSize,
      doors: car.doors,
      price: car.price,
      cylinders: car.cylinders,
      color: car.color
    };
  } catch (error) {
    console.error('Error fetching car:', error);
    return null;
  }
}

 const carSchema = z.object({
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

async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "YOUR_UPLOAD_PRESET"); // Set in your Cloudinary settings

  const res = await fetch("https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error?.message || "Failed to upload image");

  return data.secure_url; // The image URL
}


export async function createCar(formData: FormData): Promise<void> {
  try {
    await connectToDB();

    const get = (key: string) => formData.get(key);

    let images: string[] = [];
    try {
      images = JSON.parse(get('images') as string || '[]');
    } catch (parseError) {
      console.log( { success: false, message: 'Invalid images format', errors: parseError })
    }

    const carData = {
      name: get('name') as string,
      overview: get('overview') as string,
      images,
      body: get('body') as string,
      mileage: Number(get('mileage')),
      fuelType: get('fuelType') as string,
      manufacturer: get('manufacturer') as string,
      transmission: get('transmission') as string,
      year: Number(get('year')),
      driveType: get('driveType') as string,
      condition: get('condition') as string,
      engineSize: get('engineSize') as string,
      doors: Number(get('doors')),
      price: Number(get('price')),
      cylinders: Number(get('cylinders')),
      color: get('color') as string
    };

    const parsed = carSchema.safeParse(carData);
    if (!parsed.success) {
      console.log( { success: false, message: 'Validation failed', errors: parsed.error.flatten() })
    }

    const newCar = new Car(parsed.data);
    await newCar.save();

    console.log({ success: true, message: 'Car created successfully' })
    revalidatePath("/")
  } catch (error: any) {
    console.error('Error creating car:', error.message);
    console.log( { success: false, message: 'Failed to create car' })
  }
}

