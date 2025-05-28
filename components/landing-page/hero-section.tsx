"use client";

import React from "react";
import CustomButton from "./custom-button";
import { CustomButtonProps } from "@/types";
import Image from "next/image";

interface HeroProps {
  hero: string
  subtitle: string
  heroImage: string
}

const Hero = ({ hero, subtitle, heroImage }: HeroProps) => {
  const handleScroll = () => {};
  return (
    <div className="hero">
      <div className="flex-1 pt-36 padding-x">
        <h1 className="hero__title">{hero}</h1>
        <p className="hero__subtitle">
          {subtitle}
        </p>

        <CustomButton
          title="Explore Cars"
          containerStyles="bg-primary-blue text-white rounded-full mt-10"
          handleClick={handleScroll}
        />
      </div>
      <div className="hero__image-container">
        <div className="hero__image">
          <Image src={heroImage || '/hero.png'} alt="hero" fill className="object-contain" />
        </div>
        <div className="hero__image-overlay" />
      </div>
    </div>
  );
};

export default Hero;
