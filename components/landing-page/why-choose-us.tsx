import { Car, Shield, Tag, Smartphone, PhoneCall, ShieldCheck } from "lucide-react"
import type { ContentDataResponse } from "@/server actions/content.actions"

interface WhyChooseUsProps {
  whyChooseUs: ContentDataResponse["whyChooseUs"]
}

// Default icons mapping - you can extend this or make it configurable via CMS
const getIconForIndex = (index: number) => {
  const icons = [Car, ShieldCheck, Tag, PhoneCall, Shield, Smartphone]
  const IconComponent = icons[index % icons.length]
  return IconComponent
}

export default function WhyChooseUs({ whyChooseUs }: WhyChooseUsProps) {
  if (!whyChooseUs || whyChooseUs.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <h2 className="text-4xl font-bold mb-16 text-slate-900">Why Choose Us?</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {whyChooseUs.map((item, index) => {
          const IconComponent = getIconForIndex(index)

          return (
            <div key={index} className="flex flex-col items-start">
              <div className="w-12 h-12 mb-4 text-blue-500 flex items-center justify-center rounded-md">
                <IconComponent className="w-10 h-10 stroke-blue-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">{item.heading}</h3>
              <p className="text-slate-700">{item.text}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
