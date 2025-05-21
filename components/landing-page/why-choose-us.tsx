import { Car, Shield, Tag, Smartphone, PhoneCall, ShieldCheck } from "lucide-react";

const WhyChooseUs = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <h2 className="text-4xl font-bold mb-16 text-slate-900">
        Why Choose Us?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Wide Vehicle Selection */}
        <div className="flex flex-col items-start">
          <div className="w-12 h-12 mb-4 text-blue-500 flex items-center justify-center rounded-md">
            <Car className="w-10 h-10 stroke-blue-500" strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-slate-900">
            Wide Vehicle Selection
          </h3>
          <p className="text-slate-700">
            From affordable sedans to premium SUVs, our inventory is carefully
            curated to suit every budget and lifestyle.
          </p>
        </div>

        {/* Certified Vehicle Inspection */}
        <div className="flex flex-col items-start">
          <div className="w-12 h-12 mb-4 text-blue-500 flex items-center justify-center rounded-md">
            <ShieldCheck
              className="w-10 h-10 stroke-blue-500"
              strokeWidth={1.5}
            />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-slate-900">
            Certified Inspections
          </h3>
          <p className="text-slate-700">
            Every vehicle undergoes a thorough inspection by certified
            mechanics, giving you peace of mind before you buy.
          </p>
        </div>

        {/* Transparent Pricing */}
        <div className="flex flex-col items-start">
          <div className="w-12 h-12 mb-4 text-blue-500 flex items-center justify-center rounded-md">
            <Tag className="w-10 h-10 stroke-blue-500" strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-slate-900">
            Transparent Pricing
          </h3>
          <p className="text-slate-700">
            No hidden fees or surprise charges—what you see is what you pay. We
            offer honest pricing and great value.
          </p>
        </div>

        {/* Post-Sale Support */}
        <div className="flex flex-col items-start">
          <div className="w-12 h-12 mb-4 text-blue-500 flex items-center justify-center rounded-md">
            <PhoneCall
              className="w-10 h-10 stroke-blue-500"
              strokeWidth={1.5}
            />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-slate-900">
            Post-Sale Support
          </h3>
          <p className="text-slate-700">
            We don&apos;t disappear after the sale. Enjoy after-sales support,
            warranty options, and maintenance recommendations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
