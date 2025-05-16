"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CarProps } from "@/types";
import CustomButton from "./custom-button";
import CarDetails from "./car-details";
import { generateCarImageUrl } from "@/utils";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowUpRight, Bookmark } from "lucide-react";
import Link from "next/link";

interface CarCardProps {
  car: CarProps;
}

const CarCard = ({ car }: CarCardProps) => {
  const { name, price, transmission, fuelType, images, _id } = car;
  const carPrice = 14000000;
  const cityMPG = 14;
  const [isOpen, setIsOpen] = useState(false);

  function formatNaira(amount: number): string {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  return (
    <div className="overflow-hidden rounded-xl border-0 shadow-md h-full">
      <div className="relative">
        <Image
          src={images[0]}
          alt={name}
          width={400}
          height={300}
          className="w-full h-[200px] object-cover"
        />
        <Button
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full h-8 w-8"
        >
          <Bookmark className="h-4 w-4 text-gray-700" />
          <span className="sr-only">Bookmark</span>
        </Button>
      </div>

      <div className="bg-[#0a0f24] text-white p-4 h-full">
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-sm text-gray-300 truncate">{name + " For Sale"}</p>

        <div className="grid grid-cols-3 gap-2 mt-4 mb-4 text-center text-sm ">
          <div className="flex flex-col items-center">
            <Image
              src="/steering-wheel.svg"
              width={20}
              height={20}
              alt="steering wheel"
            />
            <p className="text-[14px]">{transmission}</p>
          </div>
          <div className="flex flex-col  items-center">
            <Image src="/gas.svg" width={20} height={20} alt="steering wheel" />
            <p className="text-[14px]">{fuelType}</p>
          </div>
          <div className="flex flex-col items-center ">
            <Image src="/tire.svg" width={20} height={20} alt="tire" />
            KM
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <p className="text-xl font-bold">{formatNaira(price)}</p>
          <Link href={`/listing/${_id}`}>
            <Button className="text-white hover:bg-transparent p-0 flex items-cente gap-1">
              View Details
              <ArrowUpRight className="w-[16px] h-[16px]" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
