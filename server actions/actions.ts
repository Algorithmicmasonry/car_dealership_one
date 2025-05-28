// actions/car.actions.ts
'use server';

import { FilterQuery } from 'mongoose';
import { connectToDB } from '@/db/connectToDB';
import { Car, CarLean } from '@/db/schema';
import { CarProps } from '@/types';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export async function fetchCars(filters: {
  manufacturer?: string;
  priceRange?: string;
  fuel?: string;
  year?: string;
  body?: string;
}): Promise<CarProps[]> {
  try {
    await connectToDB();

    const query: FilterQuery<typeof Car> = {};

  if (filters.manufacturer) {
 query.manufacturer = {
  $regex: filters.manufacturer.split(/[\s-]/).join(".*"),
  $options: "i",
};

  };



    if (filters.fuel) {
      query.fuelType = filters.fuel;
    }

    if (filters.year) {
      query.year = parseInt(filters.year);
    }

    if (filters.body) {
      query.body = filters.body;
    }

    if (filters.priceRange) {
      const range = filters.priceRange;

      if (range.includes("-")) {
        const [min, max] = range.split("-").map(Number);
        query.price = { $gte: min * 1_000_000, $lte: max * 1_000_000 };
      } else if (range.includes("+")) {
        const min = parseInt(range.replace("+", ""));
        query.price = { $gte: min * 1_000_000 };
      }
    }

    const cars = await Car.find(query).lean<CarLean[]>();

    return cars.map(car => ({
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
      color: car.color,
    }));
  } catch (error) {
    console.error("Error fetching cars:", error);
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

export async function fetchAllCars(): Promise<CarProps[]> {
  try {
    await connectToDB();

    const cars = await Car.find({}).lean<CarLean[]>();

    return cars.map(car => ({
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
    }));
  } catch (error) {
    console.error('Error fetching all cars:', error);
    return [];
  }
}

 const carSchema = z.object({
  name: z.string(),
  overview: z.string().optional(),
  images: z.array(z.string()),
  body: z.string().optional(),
  mileage: z.number().optional(),
  fuelType: z.string(),
  manufacturer: z.string(),
  transmission: z.string(),
  year: z.number(),
  driveType: z.string(),
  condition: z.string(),
  engineSize: z.number().nullable().optional(), // Changed from string to number
  doors: z.number(),
  price: z.number(),
  cylinders: z.number().nullable().optional(),
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


interface RecentCar {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  status: string;
}

export async function fetchDashboardData(): Promise<{
  totalCars: number;
  totalValue: number;
  recentCars: RecentCar[];
}> {
  try {
    await connectToDB();

    // Get total count of cars
    const totalCars = await Car.countDocuments();

    // Calculate total inventory value using aggregation
    const inventoryResult = await Car.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: "$price" }
        }
      }
    ]);

    const totalValue = inventoryResult.length > 0 ? inventoryResult[0].totalValue : 0;

    // Fetch recent cars (last 5 cars, sorted by creation date)
    const recentCarsData = await Car.find({})
      .sort({ _id: -1 }) // Sort by _id descending (most recent first)
      .limit(5)
      .lean<CarLean[]>();

    // Transform recent cars to match the required format
    const recentCars: RecentCar[] = recentCarsData.map(car => {
      // Extract make and model from name or manufacturer
      // Assuming name format is "Make Model" or using manufacturer as make
      const nameParts = car.name.split(' ');
      const make = car.manufacturer || nameParts[0] || 'Unknown';
      const model = nameParts.length > 1 ? nameParts.slice(1).join(' ') : car.name;

      return {
        id: car._id.toString(),
        make,
        model,
        year: car.year,
        price: car.price,
        status: car.condition.toLowerCase() === 'new' ? 'available' : 
                car.condition.toLowerCase() === 'used' ? 'available' : 
                car.condition.toLowerCase()
      };
    });

    return {
      totalCars,
      totalValue,
      recentCars
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    // Return default values instead of null
    return {
      totalCars: 0,
      totalValue: 0,
      recentCars: []
    };
  }
}



export async function updateCar(carId: string, carData: Partial<CarProps>): Promise<{ success: boolean; message: string }> {
  try {
    console.log("The update function is being called");
    console.log("Car data received:", carData);
    
    await connectToDB();

    // Validate the car data using partial schema
    const updateData = carSchema.partial().safeParse(carData);
    
    if (!updateData.success) {
      console.log("Validation errors:", updateData.error.flatten());
      return { 
        success: false, 
        message: 'Validation failed: ' + JSON.stringify(updateData.error.flatten().fieldErrors)
      };
    }

    console.log("Validated data:", updateData.data);

    // Update the car in the database
    const updatedCar = await Car.findByIdAndUpdate(
      carId,
      updateData.data,
      { new: true, runValidators: true }
    );

    if (!updatedCar) {
      return { success: false, message: 'Car not found' };
    }

    console.log("Car updated successfully:", updatedCar);

    // Revalidate the paths that might show this car data
    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/admin/inventory');

    return { success: true, message: 'Car updated successfully' };
  } catch (error: any) {
    console.error('Error updating car:', error.message);
    return { success: false, message: 'Failed to update car: ' + error.message };
  }
}
// Optional: Add a delete function as well
export async function deleteCar(carId: string): Promise<{ success: boolean; message: string }> {
  try {
    await connectToDB();

    const deletedCar = await Car.findByIdAndDelete(carId);

    if (!deletedCar) {
      return { success: false, message: 'Car not found' };
    }

    revalidatePath('/');
    revalidatePath('/inventory');

    return { success: true, message: 'Car deleted successfully' };
  } catch (error: any) {
    console.error('Error deleting car:', error.message);
    return { success: false, message: 'Failed to delete car' };
  }
}





