import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import type { ContentDataResponse } from "@/server actions/content.actions"

interface ProsAndConsProps {
  prosAndCons: ContentDataResponse["prosAndCons"]
}

export default function ProsAndCons({ prosAndCons }: ProsAndConsProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto p-4 my-[50px]">
      {/* With Us Section */}
      <div className="flex-1 bg-blue-50 rounded-lg p-8 flex flex-col justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-4">{prosAndCons.pros.heading}</h2>
          <p className="text-gray-700 mb-8">{prosAndCons.pros.text}</p>
        </div>
        <div className="flex items-end justify-between">
          <Link
            href="#discover"
            className="bg-emerald-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-emerald-700 transition-colors"
          >
            Start Browsing <ArrowUpRight size={18} />
          </Link>
          {/* Uncomment and add image URL to CMS if needed */}
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
          <h2 className="text-3xl font-bold mb-4">{prosAndCons.cons.heading}</h2>
          <p className="text-gray-700 mb-8">{prosAndCons.cons.text}</p>
        </div>
        <div className="flex items-end justify-between">
          <div></div>
          {/* Uncomment and add image URL to CMS if needed */}
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
  )
}
