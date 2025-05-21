"use client";

import Image from "next/image";
import { manufacturers } from "@/constants";
import { SearchManufacturerProps } from "@/types";

const SearchManufacturer = ({ manufacturer, setManufacturer }: SearchManufacturerProps) => {
  return (
    <div className="searchbar__item ml-4 shadow-md relative">
      {/* Car icon */}
      <Image
        src="/car-logo.svg"
        width={20}
        height={20}
        className="absolute top-3 left-3"
        alt="car logo"
      />

      {/* Dropdown select */}
      <select
        name="manufacturer"
        value={manufacturer}
        onChange={(e) => setManufacturer(e.target.value)}
        className="searchbar__input pl-12"
      >
        <option value="">Select Manufacturer...</option>
        {manufacturers.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchManufacturer;
