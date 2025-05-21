"use client";

import Image from "next/image";
import React from "react";
import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { brands } from "@/constants";
import { useRouter } from "next/navigation";

// Split brands into two rows
const firstRowBrands = brands.slice(0, 6);
const secondRowBrands = brands.slice(6, 12);

const Brands = () => {
  const router = useRouter();
  
  // Refs for both carousel rows
  const firstRowRef = useRef<HTMLDivElement | null>(null);
  const secondRowRef = useRef<HTMLDivElement | null>(null);

  // State for first row arrows
  const [showFirstRowLeftArrow, setShowFirstRowLeftArrow] =
    useState<boolean>(false);
  const [showFirstRowRightArrow, setShowFirstRowRightArrow] =
    useState<boolean>(true);

  // State for second row arrows
  const [showSecondRowLeftArrow, setShowSecondRowLeftArrow] =
    useState<boolean>(false);
  const [showSecondRowRightArrow, setShowSecondRowRightArrow] =
    useState<boolean>(true);

  const handleFirstRowScroll = (): void => {
    if (firstRowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = firstRowRef.current;
      setShowFirstRowLeftArrow(scrollLeft > 0);
      setShowFirstRowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Function to handle scroll events for the second row
  const handleSecondRowScroll = (): void => {
    if (secondRowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = secondRowRef.current;
      setShowSecondRowLeftArrow(scrollLeft > 0);
      setShowSecondRowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Functions to scroll the first row
  const scrollFirstRowLeft = (): void => {
    if (firstRowRef.current) {
      firstRowRef.current.scrollBy({ left: -250, behavior: "smooth" });
    }
  };

  const scrollFirstRowRight = (): void => {
    if (firstRowRef.current) {
      firstRowRef.current.scrollBy({ left: 250, behavior: "smooth" });
    }
  };

  // Functions to scroll the second row
  const scrollSecondRowLeft = (): void => {
    if (secondRowRef.current) {
      secondRowRef.current.scrollBy({ left: -250, behavior: "smooth" });
    }
  };

  const scrollSecondRowRight = (): void => {
    if (secondRowRef.current) {
      secondRowRef.current.scrollBy({ left: 250, behavior: "smooth" });
    }
  };

  // Function to update search parameters when a brand is clicked
  const updateSearchParams = (manufacturer: string): void => {
    // Create a new URLSearchParams object using the current URL search parameters
    const searchParams = new URLSearchParams(window.location.search);
    
    // Update or delete the 'manufacturer' search parameter based on the value
    if (manufacturer) {
      searchParams.set("manufacturer", manufacturer);
    } else {
      searchParams.delete("manufacturer");
    }
    
    // Generate the new pathname with the updated search parameters
    const newPathname = `${window.location.pathname}?${searchParams.toString()}`;
    router.push(newPathname);
  };

  // Handler for when a brand is clicked
  const handleBrandClick = (brandName: string): void => {
    updateSearchParams(brandName);
  };

  return (
    <section className="w-screen h-full rounded-xl md:rounded-2xl max-w-[1440px] mx-auto bg-primary-blue py-6 px-8 mt-[80px]">
      <div className="px-[20px]">
        <h1 className="pt-[70px] font-bold text-white text-3xl">
          Cars Available For Sale
        </h1>
        <p className="text-white pt-[25px] text-lg">
          Looking to buy a car? Search through our dealership of premium cars at
          your fingertips, certified by experts and friendly to your pocket
        </p>
        <p className="text-white text-md pt-[35px] text-xl md:text-3xl">
          Explore Our Premium Brands
        </p>

        {/* Mobile carousel view - First Row */}
        <div className="md:hidden relative mt-[30px]">
          {/* Left arrow - First Row */}
          {showFirstRowLeftArrow && (
            <button
              onClick={scrollFirstRowLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 z-10 shadow-md"
              aria-label="Scroll left first row"
            >
              <ChevronLeft size={24} className="text-primary-blue" />
            </button>
          )}

          {/* Scrollable container - First Row */}
          <div
            ref={firstRowRef}
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-4 pb-4 px-2"
            onScroll={handleFirstRowScroll}
          >
            {firstRowBrands.map((brand, index) => (
              <div
                className="snap-start shrink-0 w-[calc(50%-8px)] rounded-2xl p-6 flex flex-col items-center justify-center bg-white hover:border-2 border-primary-blue cursor-pointer"
                key={index}
                onClick={() => handleBrandClick(brand.name)}
              >
                <div>
                  <Image
                    src={brand.image}
                    alt={`${brand.name} logo`}
                    width={50}
                    height={50}
                    priority
                  />
                </div>
                <div className="text-xl hover:text-primary-blue">
                  {brand.name}
                </div>
              </div>
            ))}
          </div>

          {/* Right arrow - First Row */}
          {showFirstRowRightArrow && (
            <button
              onClick={scrollFirstRowRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 z-10 shadow-md"
              aria-label="Scroll right first row"
            >
              <ChevronRight size={24} className="text-primary-blue" />
            </button>
          )}
        </div>

        {/* Mobile carousel view - Second Row */}
        <div className="md:hidden relative mt-[20px] mb-[40px]">
          {/* Left arrow - Second Row */}
          {showSecondRowLeftArrow && (
            <button
              onClick={scrollSecondRowLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 z-10 shadow-md"
              aria-label="Scroll left second row"
            >
              <ChevronLeft size={24} className="text-primary-blue" />
            </button>
          )}

          {/* Scrollable container - Second Row */}
          <div
            ref={secondRowRef}
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-4 pb-4 px-2"
            onScroll={handleSecondRowScroll}
          >
            {secondRowBrands.map((brand, index) => (
              <div
                className="snap-start shrink-0 w-[calc(50%-8px)] rounded-2xl p-6 flex flex-col items-center justify-center bg-white hover:border-2 border-primary-blue cursor-pointer"
                key={index}
                onClick={() => handleBrandClick(brand.name)}
              >
                <div>
                  <Image
                    src={brand.image}
                    alt={`${brand.name} logo`}
                    width={50}
                    height={50}
                    priority
                  />
                </div>
                <div className="text-xl hover:text-primary-blue">
                  {brand.name}
                </div>
              </div>
            ))}
          </div>

          {/* Right arrow - Second Row */}
          {showSecondRowRightArrow && (
            <button
              onClick={scrollSecondRowRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 z-10 shadow-md"
              aria-label="Scroll right second row"
            >
              <ChevronRight size={24} className="text-primary-blue" />
            </button>
          )}
        </div>

        {/* Desktop grid view */}
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-4 mt-[50px] mb-[40px]">
          {brands.map((brand, index) => (
            <div
              className="rounded-2xl p-6 flex flex-col items-center justify-center bg-white hover:border-2 border-primary-blue cursor-pointer"
              key={index}
              onClick={() => handleBrandClick(brand.name)}
            >
              <div>
                <Image
                  src={brand.image}
                  alt={`${brand.name} logo`}
                  width={50}
                  height={50}
                  priority
                />
              </div>
              <div className="text-xl hover:text-primary-blue">
                {brand.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Brands;