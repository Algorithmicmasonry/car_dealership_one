import { appName, sellingPoints } from "@/constants";
import { ArrowUpRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { WhoAreWe as WhoAreWeType } from "@/types/content"

interface WhoAreWeProps {
  whoAreWe: WhoAreWeType
}

const WhoAreWe = ({ whoAreWe }: WhoAreWeProps) => {
  return (
    <section id="who-are-we" className="mt-[30px] max-w-[1440px] padding-x padding-y flex flex-col items-center justify-center">
      <h1 className="relative inline-block text-center font-extrabold 2xl:text-[50px] sm:text-[64px] text-[50px] text-primary-blue py-[50px]">
        {whoAreWe.heading}
        <Image
          src="/Line-6.png"
          alt="scribbled underline"
          width={250}
          height={50}
          className="absolute bottom-9 left-1/2 -translate-x-1/2 z-[-1] pointer-events-none select-none"
        />
      </h1>

      <div className="flex flex-col md:flex-row justify-evenly items-center rounded-xl ">
        <div className="w-full md:w-1/2">
          <Image
            src="/car dealership.webp"
            alt="car dealership image"
            width={800}
            height={1000}
            className=" h-[200px] md:min-h-screen rounded-t-xl md:rounded-t-none md:rounded-l-xl"
          />
        </div>
        <div className="w-full md:w-1/2 bg-blue-100 p-4 md:p-6 max-w-4xl min-h-screen rounded-b-xl md:rounded-b-none md:rounded-r-xl flex md:items-center justify-start ">
          <div className="pl-[16px]">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
             {whoAreWe.subtitle}
            </h1>

            <div className="mb-8">
              <p className="text-lg mb-2">
                Looking for a place to purchase{" "}
                <span className="font-semibold">high quality cars? </span>
                You&apos;ve come to the right place! {appName}.com is the best
                place to find premium and high quality cars
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              {whoAreWe.listOfBenefits.map((point, index) => (
                <li key={index} className="flex items-start justify-start">
                  <Check className="h-6 w-6 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-800">{point}</span>
                </li>
              ))}
            </ul>

            <Link
              href="#contact"
              className="inline-flex items-center bg-white hover:bg-primary-blue hover:text-white text-primary-blue  py-3 px-6 transition-colors font-semibold rounded-xl text-lg"
            >
              Contact Us Today
              <ArrowUpRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoAreWe;
