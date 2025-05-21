import {
  Brands,
  CarCard,
  ContactUs,
  CustomFilter,
  Hero,
  OtherAvailableCars,
  ProsAndCons,
  SearchBar,
  WhoAreWe,
  WhyChooseUs,
} from "@/components/landing-page";
import { fuels, yearsOfProduction } from "@/constants";
import { fetchCars } from "@/server actions/actions";


// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: {
    manufacturer?: string;
    priceRange?: string;
    fuel?: string;
    year?: string;
  };
}) {
  const allCars = await fetchCars(searchParams);
  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars;

  return (
    <main className="overflow-hidden">
      <Hero />
      <Brands />
      {/* catalogue section */}
      <div className="mt-12 padding-x padding-y max-width" id="discover">
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">Car Catalogue</h1>
          <p>Explore the cars you might like</p>
        </div>

        <div className="home__filters">
          <SearchBar />

          <div className="home__filter-container">
            <CustomFilter title="fuel" options={fuels} />
            <CustomFilter title="year" options={yearsOfProduction} />
          </div>
        </div>

        {!isDataEmpty ? (
          <section>
            <div className="home__cars-wrapper">
              {allCars?.map((car, index) => (
                <CarCard car={car} key={index} />
              ))}
            </div>
          </section>
        ) : (
          <>
            <div className="flex flex-col gap-10 mb-[40px]">
              <div className="home__error-container">
                <h2 className="text-black text-xl font-bold">
                  Oops, no results
                </h2>
              </div>
            </div>
            <OtherAvailableCars />
          </>
        )}
      </div>

      <WhoAreWe />
      <WhyChooseUs/>
      <ProsAndCons/>
      <ContactUs/>
    </main>
  );
}
