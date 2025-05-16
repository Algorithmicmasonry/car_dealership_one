// api/cars/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/db/connectToDB";
import Car from "@/db/schema";
import { carSchema } from "@/types"; 


export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const formData = await req.formData();
    const get = (key: string) => formData.get(key);

    // Parse images array from form data
    let images: string[] = [];
    try {
      images = JSON.parse(get("images") as string || "[]");
    } catch (parseError) {
      return NextResponse.json(
        { success: false, message: "Invalid images format", errors: parseError },
        { status: 400 }
      );
    }

    // Create car data object
    const carData = {
      name: get("name") as string,
      overview: get("overview") as string,
      images, // These are now secure_urls from Cloudinary
      body: get("body") as string,
      mileage: Number(get("mileage")),
      fuelType: get("fuelType") as string,
      manufacturer: get("manufacturer") as string,
      transmission: get("transmission") as string,
      year: Number(get("year")),
      driveType: get("driveType") as string,
      condition: get("condition") as string,
      engineSize: get("engineSize") as string,
      doors: Number(get("doors")),
    price: Number((get("price") as string).replace(/[^0-9.]/g, "")),// Remove currency formatting
      cylinders: Number(get("cylinders")),
      color: get("color") as string,
    };

    // Validate data
    const parsed = carSchema.safeParse(carData);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Save to database
    const newCar = new Car(parsed.data);
    await newCar.save();

    return NextResponse.json(
      { success: true, message: "Car created successfully", data: newCar },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating car:", error.message);
    return NextResponse.json(
      { success: false, message: "Failed to create car", error: error.message },
      { status: 500 }
    );
  }
}