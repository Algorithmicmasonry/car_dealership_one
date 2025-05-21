import Link from "next/link";
import { fetchAllCars } from "@/server actions/actions";
import CarCard from "./car-card";
import { LucideArrowUpRight } from "lucide-react";

const OtherAvailableCars = async () => {
  const allCars = await fetchAllCars();

  const showCount = allCars.length >= 6 ? 6 : 3;
  const visibleCars = allCars.slice(0, showCount);

  return (
    <section className="py-6 px-10 bg-primary-blue w-full max-w-[1440px] rounded-xl">
      <h1 className="pt-[70px] font-bold text-white text-3xl">
        Other Available Cars
      </h1>
      <div className="grid 2xl:grid-cols-3 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 w-full gap-8 mt-[30px]">
        {visibleCars.map((car, index) => (
          <CarCard car={car} key={index} />
        ))}
      </div>

      {allCars.length > showCount && (
        <div className="flex justify-center mt-8">
          <Link
            href="/listing" // Make sure this route exists
            className="flex items-center gap-1 bg-white text-blue-600 py-2 px-4 rounded-xl hover:bg-blue-600 hover:text-white transition font-semibold text-lg"
          >
            Show more listings
            <LucideArrowUpRight />
          </Link>
        </div>
      )}
    </section>
  );
};

export default OtherAvailableCars;
