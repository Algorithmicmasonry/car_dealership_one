"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Upload, X } from "lucide-react";
import { formatCurrency } from "@/utils";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { manufacturers } from "@/constants";
import { vendored } from "next/dist/server/future/route-modules/pages/module.compiled";
// Assuming you use a toast library like sonner

// Define the car interface based on the schema
interface CarFormData {
  name: string;
  overview: string;
  images: File[];
  body: string;
  mileage: string;
  fuelType: string;
  manufacturer: string;
  transmission: string;
  year: string;
  driveType: string;
  condition: string;
  engineSize: string;
  doors: string;
  price: string;
  cylinders: string;
  color: string;
}

/**
 * Uploads a file to Cloudinary and returns the secure URL
 */
async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
  );

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || "Failed to upload image");
  }

  return data.secure_url;
}

/**
 * Uploads multiple images to Cloudinary
 */
async function uploadImages(files: File[]): Promise<string[]> {
  try {
    const uploadPromises = files.map((file) => uploadToCloudinary(file));
    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw new Error("Failed to upload one or more images");
  }
}

export default function CarForm() {
  const [formData, setFormData] = useState<CarFormData>({
    name: "",
    overview: "",
    images: [],
    body: "",
    mileage: "",
    fuelType: "",
    manufacturer: "",
    transmission: "",
    year: String(new Date().getFullYear()),
    driveType: "",
    condition: "",
    engineSize: "",
    doors: "",
    price: "",
    cylinders: "",
    color: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "price") {
      // Format the value as the user types, ensuring it's a string
      const formattedValue = formatCurrency(value);

      setFormData({
        ...formData,
        [name]: formattedValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);

      // Create preview URLs for the new files
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));

      setFormData({
        ...formData,
        images: [...formData.images, ...newFiles],
      });

      setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    // Remove the image from the formData
    const newImages = [...formData.images];
    newImages.splice(index, 1);

    // Remove the preview URL and revoke the object URL to free memory
    const newPreviewUrls = [...imagePreviewUrls];
    URL.revokeObjectURL(newPreviewUrls[index]);
    newPreviewUrls.splice(index, 1);

    setFormData({
      ...formData,
      images: newImages,
    });
    setImagePreviewUrls(newPreviewUrls);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form
      if (
        !formData.name ||
        !formData.manufacturer ||
        formData.images.length === 0
      ) {
        toast({
          title: "Error",
          description:
            "Please fill in all required fields and upload at least one image",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // First upload images to Cloudinary
      toast({ title: "Uploading images..." });
      const imageUrls = await uploadImages(formData.images);

      // Create FormData with all the car details
      const submitFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "images") {
          // Skip the images array of Files
          submitFormData.append(key, String(value)); // Ensure values are converted to strings
        }
      });

      // Add the Cloudinary image URLs as JSON string
      submitFormData.append("images", JSON.stringify(imageUrls));

      // Submit to your backend API
      toast({ title: "Creating Car listing" });
      const response = await fetch("/api/cars", {
        method: "POST",
        body: submitFormData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Server error: ${response.status}`
        );
      }

      const result = await response.json();

      if (result.success) {
        toast({ title: "Car listing created successfully!" });

      } else {
        throw new Error(result.message || "Failed to create car listing");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        variant: "destructive",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
      
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 max-w-4xl mx-auto p-6 mt-4"
    >
      <div className="text-2xl font-bold">Add New Car Listing</div>

      {/* Basic Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Car Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Toyota Camry XSE"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="manufacturer">Manufacturer *</Label>
            <Select
              value={formData.manufacturer}
              onValueChange={(value) =>
                handleSelectChange("manufacturer", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select manufacturer" />
              </SelectTrigger>
              <SelectContent>
                {manufacturers.map((maker) => (
                  <SelectItem key={maker} value={maker}>
                    {maker}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="overview">Overview</Label>
          <Textarea
            id="overview"
            name="overview"
            value={formData.overview}
            onChange={handleInputChange}
            placeholder="Brief description of the vehicle"
            rows={3}
          />
        </div>
      </div>

      {/* Images Upload */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Images *</h2>
        <div
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={triggerFileInput}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
          />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
        </div>

        {/* Image Previews */}
        {imagePreviewUrls.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
            {imagePreviewUrls.map((url, index) => (
              <Card key={index} className="relative overflow-hidden group">
                <CardContent className="p-2">
                  <div className="relative aspect-square">
                    <img
                      src={url || "/placeholder.svg"}
                      alt={`Car image ${index + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Vehicle Details */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Vehicle Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="year">Year *</Label>
            <Input
              id="year"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              min={1900}
              max={new Date().getFullYear() + 1}
              required
            />
          </div>

          <div className="space-y-2 bg-white">
            <Label htmlFor="body">Body Style</Label>
            <Select
              value={formData.body}
              onValueChange={(value) => handleSelectChange("body", value)}
            >
              <SelectTrigger id="body">
                <SelectValue placeholder="Select body style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedan">Sedan</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="coupe">Coupe</SelectItem>
                <SelectItem value="truck">Truck</SelectItem>
                <SelectItem value="hatchback">Hatchback</SelectItem>
                <SelectItem value="convertible">Convertible</SelectItem>
                <SelectItem value="wagon">Wagon</SelectItem>
                <SelectItem value="van">Van</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Color *</Label>
            <Input
              id="color"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              placeholder="e.g. Midnight Black"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mileage">Mileage</Label>
            <Input
              id="mileage"
              name="mileage"
              value={formData.mileage}
              onChange={handleInputChange}
              placeholder="e.g. 15000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="doors">Doors *</Label>
            <Input
              id="doors"
              name="doors"
              value={formData.doors}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (₦) *</Label>
            <Input
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
      </div>

      {/* Engine & Transmission */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Engine & Transmission</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fuelType">Fuel Type *</Label>
            <Select
              value={formData.fuelType}
              onValueChange={(value) => handleSelectChange("fuelType", value)}
              required
            >
              <SelectTrigger id="fuelType">
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="petrol">Petrol</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="plugin_hybrid">Plug-in Hybrid</SelectItem>
                <SelectItem value="cng">CNG</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transmission">Transmission *</Label>
            <Select
              value={formData.transmission}
              onValueChange={(value) =>
                handleSelectChange("transmission", value)
              }
              required
            >
              <SelectTrigger id="transmission">
                <SelectValue placeholder="Select transmission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="automatic">Automatic</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="cvt">CVT</SelectItem>
                <SelectItem value="semi-automatic">Semi-Automatic</SelectItem>
                <SelectItem value="dual-clutch">Dual-Clutch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="driveType">Drive Type *</Label>
            <Select
              value={formData.driveType}
              onValueChange={(value) => handleSelectChange("driveType", value)}
              required
            >
              <SelectTrigger id="driveType">
                <SelectValue placeholder="Select drive type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fwd(Front-wheel-drive)">
                  FWD (Front-Wheel Drive)
                </SelectItem>
                <SelectItem value="rwd(Rear-wheel-drive)">
                  RWD (Rear-Wheel Drive)
                </SelectItem>
                <SelectItem value="awd(All-wheel-drive">
                  AWD (All-Wheel Drive)
                </SelectItem>
                <SelectItem value="4wd(Four-wheel-drive)">
                  4WD (Four-Wheel Drive)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="engineSize">Engine Size (L)</Label>
            <Input
              id="engineSize"
              name="engineSize"
              value={formData.engineSize}
              onChange={handleInputChange}
              placeholder="e.g. 2.5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cylinders">Cylinders</Label>
            <Input
              id="cylinders"
              name="cylinders"
              value={formData.cylinders}
              onChange={handleInputChange}
              placeholder="e.g. 4"
            />
          </div>
        </div>
      </div>

      {/* Condition */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Condition</h2>

        <div className="space-y-2">
          <Label htmlFor="condition">Vehicle Condition *</Label>
          <Select
            value={formData.condition}
            onValueChange={(value) => handleSelectChange("condition", value)}
            required
          >
            <SelectTrigger id="condition">
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">Brand New</SelectItem>
              <SelectItem value="foreignUsed">Foreign Used</SelectItem>
              <SelectItem value="localUsed">Local Used</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          size="lg"
          className="border-2 border-blue-700"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoading ? "Uploading..." : "Submit Listing"}
        </Button>
      </div>
    </form>
  );
}
