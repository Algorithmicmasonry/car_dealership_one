import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProsAndCons = () => {
  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto p-4 my-[50px]">
      {/* With Us Section */}
      <div className="flex-1 bg-blue-50 rounded-lg p-8 flex flex-col justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-4">
            What You Get <br />
            With Us
          </h2>
          <p className="text-gray-700 mb-8">
            Shop with confidence. We offer a curated selection of verified cars,
            transparent pricing, and a smooth buying process. No hidden charges,
            no stress — just peace of mind from test drive to key handover.
          </p>
        </div>
        <div className="flex items-end justify-between">
          <Link  href="#discover" className="bg-emerald-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-emerald-700 transition-colors">
            Start Browsing <ArrowUpRight size={18} />
          </Link>
          {/* <div className="w-24 h-24">
            <Image
              src="/car-happy.svg"
              width={96}
              height={96}
              alt="Happy customer"
              className="object-contain"
            />
          </div> */}
        </div>
      </div>

      {/* Without Us Section */}
      <div className="flex-1 bg-red-50 rounded-lg p-8 flex flex-col justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-4">
            Without <br />
            Our Help
          </h2>
          <p className="text-gray-700 mb-8">
            Endless calls, shady sellers, overpriced vehicles, and wasting time
            chasing unverified listings. Buying a car shouldn't feel like a gamble.
            Avoid regret and shop smart — choose a dealership that puts you first.
          </p>
        </div>
        <div className="flex items-end justify-between">
          <div></div>
          {/* <div className="w-24 h-24">
            <Image
              src="/car-stress.svg"
              width={96}
              height={96}
              alt="Frustrated buyer"
              className="object-contain"
            />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ProsAndCons;
