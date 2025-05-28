"use client";

import { useState } from "react";
import {
  Car,
  DollarSign,
  Upload,
  Edit3,
  BarChart3,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { DashboardDataTypes, CarProps } from "@/types";
import { fetchCarById, updateCar } from "@/server actions/actions";
import { useToast } from "@/hooks/use-toast";

interface DashboardPageClientProps {
  dashboardData: DashboardDataTypes;
}

export default function DashboardPageClient({
  dashboardData,
}: DashboardPageClientProps) {
  const [editingCar, setEditingCar] = useState<CarProps | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recentCars, setRecentCars] = useState(dashboardData.recentCars);
  const { toast } = useToast();

  const handleEditCar = async (carId: string) => {
    try {
      setIsLoading(true);
      // Fetch full car data by ID
      const fullCarData = await fetchCarById(carId);

      if (fullCarData) {
        setEditingCar(fullCarData);
        setIsEditDialogOpen(true);
      } else {
        toast({
          title: "Error",
          description: "Could not load car data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching car data:", error);
      toast({
        title: "Error",
        description: "Failed to load car data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCar = async () => {
    if (editingCar) {
      try {
        setIsLoading(true);
        const result = await updateCar(editingCar._id, editingCar);

        if (result.success) {
          // Update the recent cars list with updated data
          setRecentCars(
            recentCars.map((car) =>
              car.id === editingCar._id
                ? {
                    ...car,
                    make: editingCar.manufacturer || car.make,
                    model:
                      editingCar.name.split(" ").slice(1).join(" ") ||
                      car.model,
                    year: editingCar.year,
                    price: editingCar.price,
                    status:
                      editingCar.condition.toLowerCase() === "new"
                        ? "available"
                        : editingCar.condition.toLowerCase() === "used"
                        ? "available"
                        : editingCar.condition.toLowerCase(),
                  }
                : car
            )
          );

          setIsEditDialogOpen(false);
          setEditingCar(null);
          toast({
            title: "Success",
            description: "Car updated successfully!",
          });
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to update car",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error updating car:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (field: keyof CarProps, value: string | number) => {
    if (editingCar) {
      setEditingCar({
        ...editingCar,
        [field]: value,
      });
    }
  };

  const handleCancel = () => {
    setIsEditDialogOpen(false);
    setEditingCar(null);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6 md:gap-6 lg:gap-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Welcome back! Here's what's happening with your dealership today.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalCars}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Inventory Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{dashboardData.totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Average: ₦
              {Math.round(
                dashboardData.totalValue / dashboardData.totalCars
              ).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Button size="sm" className="w-full text-xs sm:text-sm" asChild>
              <Link href="/admin/upload">
                <Upload className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Upload New Car
              </Link>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs sm:text-sm"
              asChild
            >
              <Link href="/admin/edit-content">
                <Edit3 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Edit Content
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Cars Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Listings</CardTitle>
          <CardDescription>Latest cars added to your inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCars.map((car) => (
              <div
                key={car.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3 sm:gap-4"
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <Car className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm sm:text-base">
                      {car.year} {car.make} {car.model}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      ID: #{car.id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4">
                  <div className="text-left sm:text-right">
                    <p className="font-medium text-sm sm:text-base">
                      ₦{car.price.toLocaleString()}
                    </p>
                    <Badge
                      variant={
                        car.status === "available"
                          ? "default"
                          : car.status === "sold"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs"
                    >
                      {car.status}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs sm:text-sm"
                    onClick={() => handleEditCar(car.id)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <>
                        <Edit3 className="mr-2 h-3 w-3" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Car Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
            <DialogDescription>
              Update the vehicle information below.
            </DialogDescription>
          </DialogHeader>
          {editingCar && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Vehicle Name</Label>
                  <Input
                    id="name"
                    value={editingCar.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    value={editingCar.manufacturer ?? ""}
                    onChange={(e) =>
                      handleInputChange("manufacturer", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={editingCar.year}
                    onChange={(e) =>
                      handleInputChange("year", Number.parseInt(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    value={editingCar.price}
                    onChange={(e) =>
                      handleInputChange(
                        "price",
                        Number.parseInt(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mileage">Mileage</Label>
                  <Input
                    id="mileage"
                    type="number"
                    value={editingCar.mileage}
                    onChange={(e) =>
                      handleInputChange(
                        "mileage",
                        Number.parseInt(e.target.value)
                      )
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="body">Body Type</Label>
                  <Select
                    value={editingCar.body || ""}
                    onValueChange={(value) => handleInputChange("body", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select body type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sedan">Sedan</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="Truck">Truck</SelectItem>
                      <SelectItem value="Coupe">Coupe</SelectItem>
                      <SelectItem value="Hatchback">Hatchback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuelType">Fuel Type</Label>
                  <Select
                    value={editingCar.fuelType || ""}
                    onValueChange={(value) =>
                      handleInputChange("fuelType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="petrol">Petrol</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="plugin_hybrid">
                        Plug-in Hybrid
                      </SelectItem>
                      <SelectItem value="cng">CNG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transmission">Transmission</Label>
                  <Select
                    value={editingCar.transmission || ""}
                    onValueChange={(value) =>
                      handleInputChange("transmission", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automatic">Automatic</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="cvt">CVT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driveType">Drive Type</Label>
                  <Select
                    value={editingCar.driveType || ""}
                    onValueChange={(value) =>
                      handleInputChange("driveType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select drive type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fwd(Front-wheel-drive)">
                        FWD (Front-Wheel Drive)
                      </SelectItem>
                      <SelectItem value="rwd(Rear-wheel-drive)">
                        {" "}
                        RWD (Rear-Wheel Drive)
                      </SelectItem>
                      <SelectItem value="awd(All-wheel-drive">
                        {" "}
                        AWD (All-Wheel Drive)
                      </SelectItem>
                      <SelectItem value="4wd(Four-wheel-drive)">
                        {" "}
                        4WD (Four-Wheel Drive)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select
                    value={editingCar.condition || ""}
                    onValueChange={(value) =>
                      handleInputChange("condition", value)
                    }
                  >
                    <SelectTrigger>
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="engineSize">Engine Size</Label>
                  <Input
                    id="engineSize"
                    value={editingCar.engineSize ?? ""}
                    onChange={(e) =>
                      handleInputChange("engineSize", Number(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doors">Doors</Label>
                  <Input
                    id="doors"
                    type="number"
                    value={editingCar.doors}
                    onChange={(e) =>
                      handleInputChange(
                        "doors",
                        Number.parseInt(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    value={editingCar.color}
                    onChange={(e) => handleInputChange("color", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="overview">Overview</Label>
                <Textarea
                  id="overview"
                  value={editingCar.overview}
                  onChange={(e) =>
                    handleInputChange("overview", e.target.value)
                  }
                  className="min-h-[80px]"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCar} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Update Vehicle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
