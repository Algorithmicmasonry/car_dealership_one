"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

import { CarProps } from "@/types";
import {
  BookmarkIcon,
  MessageCircle,
  Share,
  Copy,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  CheckCircle,
  CarTaxiFront,
  CircleGauge,
  Fuel,
  CalendarRange,
  Cpu,
  ShipWheel,
  UserRound,
  BrainCog,
  DoorOpen,
  Cylinder,
  Paintbrush,
  ArrowUpRightIcon,
  LocateIcon,
  PhoneCall,
  Link2,
} from "lucide-react";
import Image from "next/image";
import React, { useState, useRef } from "react";
import { Button } from "./ui/button";
import {
  formatCurrency,
  phoneNumber,
  phoneNumberWithoutFormatting,
} from "@/utils";
import Link from "next/link";

interface ListingDetailsPageProps {
  car: CarProps | null;
}

const ListingDetailsPage = ({ car }: ListingDetailsPageProps) => {
  const [shareDropdownOpen, setShareDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shareRef.current &&
        !shareRef.current.contains(event.target as Node)
      ) {
        setShareDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [shareRef]);

  // Copy URL function
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast({
      title: "Car url has been successfully copied",
      description: "You can now share the url anywehre",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  // Share to social media
  const shareToSocial = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(`Check out this ${car?.name} for sale!`);

    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${title}%20${url}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }

    setShareDropdownOpen(false);
  };

  if (!car) {
    return <p>Car not found.</p>;
  }

  const items = [
    {
      name: "Body",
      icon: <CarTaxiFront />,
      value: car.body,
    },
    {
      name: "Mileage",
      icon: <CircleGauge />,
      value: car.mileage,
    },
    {
      name: "Fuel Type",
      icon: <Fuel />,
      value: car.fuelType,
    },
    {
      name: "Year",
      icon: <CalendarRange />,
      value: car.year,
    },
    {
      name: "Transmission",
      icon: <Cpu />,
      value: car.transmission,
    },
    {
      name: "Drive Type",
      icon: <ShipWheel />,
      value: car.driveType,
    },
    {
      name: "Condition",
      icon: <CarTaxiFront />,
      value: car.body,
    },
    {
      name: "Condition",
      icon: <UserRound />,
      value: car.condition,
    },
    {
      name: "Engine Size",
      icon: <BrainCog />,
      value: car.engineSize,
    },
    {
      name: "Door",
      icon: <DoorOpen />,
      value: car.doors,
    },
    {
      name: "Cylinder",
      icon: <Cylinder />,
      value: car.cylinders,
    },
    {
      name: "Color",
      icon: <Paintbrush />,
      value: car.color,
    },
  ];

  return (
    <div className="py-4">
      <Card className="h-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl">{car.name}</CardTitle>
            <CardDescription className="text-lg md:text-xl">
              {car.name} for sale
            </CardDescription>
          </CardHeader>
          <div className="flex justify-between items-center gap-4 p-6 md:p-0">
            <div className="flex flex-col items-start gap-4 justify-between">
              <div className="text-3xl font-bold">
                ₦{formatCurrency(String(car.price))}
              </div>
              <div className="relative flex gap-2" ref={shareRef}>
                <button className="flex items-center justify-center gap-2 hover:text-green-500 transition-colors">
                  <span className="hidden sm:inline">Message</span>
                  <MessageCircle className="w-6 h-6 p-1 rounded-full border" />
                </button>
                <button
                  className="flex items-center justify-center gap-2 hover:text-blue-500 transition-colors"
                  onClick={() => setShareDropdownOpen(!shareDropdownOpen)}
                >
                  <span className="hidden sm:inline">Share</span>
                  <Share className="w-6 h-6 p-1 rounded-full border" />
                </button>

                {shareDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                    >
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={copyToClipboard}
                      >
                        {copied ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        {copied ? "Copied!" : "Copy link"}
                      </button>

                      <div className="border-t border-gray-100 my-1"></div>

                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => shareToSocial("facebook")}
                      >
                        <Facebook className="w-4 h-4 text-blue-600" />
                        Facebook
                      </button>

                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => shareToSocial("twitter")}
                      >
                        <Twitter className="w-4 h-4 text-blue-400" />
                        Twitter
                      </button>

                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => shareToSocial("linkedin")}
                      >
                        <Linkedin className="w-4 h-4 text-blue-700" />
                        LinkedIn
                      </button>

                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => shareToSocial("whatsapp")}
                      >
                        <Link2 className="w-4 h-4 text-green-500" />
                        WhatsApp
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* <button className="flex items-center justify-center gap-2 hover:text-blue-500 transition-colors">
              <span className="hidden sm:inline">Save</span>
              <BookmarkIcon className="w-6 h-6 p-1 rounded-full border"/>
            </button> */}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-6">
          {car.images.length > 0 &&
            car.images.map((img, index) => (
              <div className="h-64 w-full" key={index}>
                <Image
                  src={img}
                  alt="car image"
                  width={400}
                  height={400}
                  priority
                  className="rounded-sm w-full h-full object-cover"
                />
              </div>
            ))}
        </div>
        <div className="py-4 flex flex-col px-6 md:grid grid-cols-2">
          <div>
            <h1 className="font-semibold text-2xl ">Car Overview </h1>
            <div className="flex gap-2 flex-col mt-4">
              {items.map((item, index) => (
                <div
                  className="flex items-center gap-4 justify-between max-w-lg"
                  key={index}
                >
                  <div className=" flex items-center gap-3 space-y-2">
                    <div>{item.icon}</div>
                    <div>{item.name}</div>
                  </div>

                  <div>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 max-w-lg md:self-center">
            <Card>
              <CardHeader>
                <CardTitle>
                  Send us your offer price on whatsapp for this car
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-between gap-2 font-semibold">
                    <LocateIcon className="p-1 rounded-full bg-blue-200" /> Get
                    Direction
                  </div>
                  <div className="flex items-center justify-between gap-2 font-semibold">
                    {" "}
                    <PhoneCall className="p-1 rounded-full bg-blue-200" />{" "}
                    {phoneNumber}
                  </div>
                </div>

                <Link
                  href={`https://wa.me/${phoneNumberWithoutFormatting}?text=${encodeURIComponent(
                    `Hello, I'm interested in making an offer for the ${
                      car.year
                    } ${car.name} ${
                      car.manufacturer
                    } priced at ${formatCurrency(
                      String(car.price)
                    )}. My offer price is: `
                  )}`}
                  target="_blank"
                >
                  <Button
                    size="lg"
                    className="text-lg font-semibold bg-green-500 text-white hover:bg-blue-500 hover:text-white mt-4 w-full"
                  >
                    Message Dealer <ArrowUpRightIcon />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ListingDetailsPage;
