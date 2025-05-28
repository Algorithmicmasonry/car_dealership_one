export interface ContentData {
  _id: string
  hero: string
  subtitle: string
  heroImage: string
  brands: Brand[]
  whoAreWe: WhoAreWe
  whyChooseUs: WhyChooseUsItem[]
  prosAndCons: ProsAndCons
  getInTouch: GetInTouch
  createdAt?: Date
  updatedAt?: Date
}

export interface Brand {
  name: string
  image: string
}

export interface WhoAreWe {
  heading: string
  subtitle: string
  listOfBenefits: string[]
}

export interface WhyChooseUsItem {
  heading: string
  description: string // Added this field from your schema
  text: string
}

export interface ProsAndCons {
  pros: {
    heading: string
    text: string
  }
  cons: {
    heading: string
    text: string
  }
}

export interface GetInTouch {
  salesCard: {
    heading: string
    subheading: string
    buttonText: string
  }
  teamCard: {
    heading: string
    subheading: string
    buttonText: string
  }
}

// Re-export your schema types for consistency
export type {
  ISiteContent,
  SiteContentLean,
  IBrand,
  IWhyChooseUsItem,
  IWhoAreWe,
  IProsAndCons,
  IGetInTouch,
} from "@/db/schema"
