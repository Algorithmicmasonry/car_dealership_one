"use client";

import { useState } from "react";
import { Edit, Trash2, Search, Filter, Plus, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { CarProps } from "@/types";
import { deleteCar, updateCar } from "@/server actions/actions";
import { useToast } from "@/hooks/use-toast"; // or your preferred toast library

type Props = {
  dummyCars: CarProps[];
};

export default function InventoryPage({ dummyCars }: Props) {
  const [cars, setCars] = useState<CarProps[]>(dummyCars);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCar, setEditingCar] = useState<CarProps | null>(null);
  const [deletingCarId, setDeletingCarId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // Filter cars based on search term
  const filteredCars = cars.filter(
    (car) =>
      car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (car.manufacturer ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      car.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditCar = (car: CarProps) => {
    console.log("Editing car:", car); // Add this line to debug
    setEditingCar({ ...car });
    setIsEditDialogOpen(true);
  };
  const { toast } = useToast();

  const handleDeleteCar = async (carId: string) => {
    try {
      setDeletingCarId(carId);
      const result = await deleteCar(carId);

      if (result.success) {
        toast({
          title: "Car deleted succesfully",
        });
      } else {
        toast({
          title: result.message || "Failed to delete car",
        });
      }
    } catch (error) {
      console.error("Error deleting car: ", error);
      toast({
        title: "An unexpected error occured",
        variant: "destructive",
      });
    }
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingCarId) {
      setCars(cars.filter((car) => car._id !== deletingCarId));
      setDeletingCarId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleCancel = async () => {
    setIsEditDialogOpen(false);
    setIsLoading(false);
  };

  const handleUpdateCar = async () => {
    if (editingCar) {
      try {
        setIsLoading(true);
        // Call the server action to update in database
        const result = await updateCar(editingCar._id, editingCar);
        console.log(result);

        if (result.success) {
          // Update local state only if database update was successful
          setCars(
            cars.map((car) => (car._id === editingCar._id ? editingCar : car))
          );
          setIsLoading(false);
          setIsEditDialogOpen(false);
          setEditingCar(null);

          // Show success message
          toast({ title: "Car updated successfully!" });
        } else {
          // Show error message
          toast({
            title: result.message || "Failed to update car",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error updating car:", error);
        toast({
          title: "An unexpected error occurred",
          variant: "destructive",
        });
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

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6 md:gap-6 lg:gap-8">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Vehicle Inventory
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your car inventory with editing and deletion capabilities.
          </p>
        </div>
        <Link href="/admin/upload">
          <Button className="text-sm" onClick={() => setIsLoading(true)}>
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add New Vehicle
              </>
            )}
          </Button>
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, manufacturer, or body type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="text-sm">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-2xl font-bold">{cars.length}</div>
            <p className="text-xs text-muted-foreground">Total Vehicles</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-2xl font-bold">
              ₦{cars.reduce((sum, car) => sum + car.price, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total Value</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-2xl font-bold">
              ₦
              {Math.round(
                cars.reduce((sum, car) => sum + car.price, 0) / cars.length
              ).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Average Price</p>
          </CardContent>
        </Card>
      </div>

      {/* Cars Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredCars.map((car) => (
          <Card key={car._id} className="overflow-hidden">
            <div className="aspect-video relative bg-muted">
              <img
                src={car.images[0] || "/placeholder.svg"}
                alt={car.name}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-2 left-2" variant="secondary">
                {car.condition}
              </Badge>
            </div>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{car.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {car.year} • {car.mileage.toLocaleString()} miles
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">
                    ₦{car.price.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-4">
                <div>Body: {car.body}</div>
                <div>Fuel: {car.fuelType}</div>
                <div>Drive: {car.driveType}</div>
                <div>Doors: {car.doors}</div>
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {car.overview}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEditCar(car)}
                >
                  <Edit className="mr-2 h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteCar(car._id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
                      <SelectItem value="Petrol">Petrol</SelectItem>
                      <SelectItem value="Gas">Gas</SelectItem>
                      <SelectItem value="Electricity">Electricity</SelectItem>
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
                      <SelectItem value="Automatic">Automatic</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                      <SelectItem value="CVT">CVT</SelectItem>
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
                      <SelectItem value="FWD">FWD</SelectItem>
                      <SelectItem value="RWD">RWD</SelectItem>
                      <SelectItem value="AWD">AWD</SelectItem>
                      <SelectItem value="4WD">4WD</SelectItem>
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
                      <SelectItem value="New">Brand New</SelectItem>
                      <SelectItem value="Used">Foreign Used</SelectItem>
                      <SelectItem value="Certified">Local Used</SelectItem>
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
            <Button onClick={handleUpdateCar}>
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Update Vehicle"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              vehicle from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? <Loader2 className="animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}