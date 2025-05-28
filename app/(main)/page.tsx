import {
  Brands,
  CallFixedButton,
  CarCard,
  ChatOnWhatsappFixed,
  ContactUs,
  CustomFilter,
  Hero,
  OtherAvailableCars,
  ProsAndCons,
  ScrollToTopButton,
  SearchBar,
  WhoAreWe,
  WhyChooseUs,
} from "@/components/landing-page";
import { fuels, yearsOfProduction } from "@/constants";
import { fetchCars } from "@/server actions/actions";
import { fetchContentData, type ContentDataResponse } from "@/server actions/content.actions"

// ISR Configuration - Revalidate every hour
export const revalidate = 3600

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
  // Fetch both car data and CMS content
  const [allCars, contentData] = await Promise.all([fetchCars(searchParams), fetchContentData()])

  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars

  // Fallback content if CMS data is not available
  const defaultContent: ContentDataResponse = {
    _id: "",
    hero: "Find Your Dream Car Today",
    subtitle: "Browse our wide selection of reliable vehicles",
    heroImage: "/hero.png",
    brands: [],
    whoAreWe: {
      heading: "Who Are We?",
      subtitle: "Your trusted automotive partner",
      listOfBenefits: ["Quality vehicles", "Great prices", "Excellent service"],
    },
    whyChooseUs: [],
    prosAndCons: {
      pros: {
        heading: "What You Get With Us",
        text: "Quality service and reliable vehicles",
      },
      cons: {
        heading: "Without Our Help",
        text: "Uncertainty and potential issues",
      },
    },
    getInTouch: {
      salesCard: {
        heading: "Contact Sales",
        subheading: "Get in touch with our sales team",
        buttonText: "Contact Us",
      },
      teamCard: {
        heading: "Contact Team",
        subheading: "Reach out to our support team",
        buttonText: "Message Us",
      },
    },
  }

  const content = contentData || defaultContent
  console.log(content)

  return (
    <main className="overflow-hidden relative">
      <Hero hero={content.hero} subtitle={content.subtitle} heroImage={content.heroImage} />
      <Brands brands={content.brands}  />
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

     <WhoAreWe whoAreWe={content.whoAreWe} />
       <WhyChooseUs whyChooseUs={content.whyChooseUs} />
    <ProsAndCons prosAndCons={content.prosAndCons} />
     
      {/* fixed elements */}
      <ScrollToTopButton/>
      <CallFixedButton/>
      <ChatOnWhatsappFixed/>
    </main>
  );
}
