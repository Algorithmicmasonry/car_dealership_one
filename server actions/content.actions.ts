"use server"
import { connectToDB } from "@/db/connectToDB"
import { brands } from "@/constants"
import { revalidatePath } from "next/cache"
import { SiteContent, type SiteContentLean } from "@/db/schema";



// Types for better type safety
interface SiteContentData {
  _id?: string
  hero: string
  subtitle: string
  heroImage: string
  brands: Array<{
    name: string
    image: string
    isActive?: boolean
    _id?: string
  }>
  whoAreWe: {
    heading: string
    subtitle: string
    description?: string
    listOfBenefits: string[]
  }
  whyChooseUs: Array<{
    heading: string
    text: string
    _id?: string
  }>
  prosAndCons: {
    pros: {
      heading: string
      text: string
    }
    cons: {
      heading: string
      text: string
    }
  }
  getInTouch: {
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
  createdAt?: string
  updatedAt?: string
  __v?: number
}

export interface ActionResult {
  success: boolean
  message: string
  data?: any
  error?: string
}


// Helper function to convert Mongoose document to plain object
const convertToPlainObject = (mongooseDoc: any): SiteContentData => {
  if (mongooseDoc.toObject) {
    return mongooseDoc.toObject()
  }
  return JSON.parse(JSON.stringify(mongooseDoc))
}

// Get site content - equivalent to GET route
export async function getSiteContent(): Promise<ActionResult> {
  try {
    await connectToDB()

    let siteContent = await SiteContent.findOne().lean()

    // If no content exists, create default content
    if (!siteContent) {
      const defaultContent = {
        hero: "Find Your Dream Ride Today!",
        subtitle:
          "Browse our wide selection of reliable new and foreign used vehicles. Great prices, financing options, and nationwide delivery available",
        heroImage: "/hero.png",
        brands: brands,
        whoAreWe: {
          heading: "Who Are We?",
          subtitle: "Welcome to DurieAutos.com - Your Trusted Source For High Quality Vehicle",
          description:
            "Looking for a place to purchase high quality cars? You've come to the right place! carhub.com is the best place to find premium and high quality cars",
          listOfBenefits: [
            "Certified quality and inspection guarantee",
            "Transparent Pricing with No Hidden Fees",
            "24/7 Customer Support Team Available",
            "Easy-to-use website to compare vehicles",
          ],
        },
        whyChooseUs: [
          {
            heading: "Wide Vehicle Selection",
            text: "From affordable sedans to premium SUVs, our inventory is carefully curated to suit every budget and lifestyle..",
          },
          {
            heading: "Certified Inspections",
            text: "Every vehicle undergoes a thorough inspection by certified mechanics, giving you peace of mind before you buy.",
          },
          {
            heading: "Transparent Pricing",
            text: "No hidden fees or surprise charges—what you see is what you pay. We offer honest pricing and great value.",
          },
          {
            heading: "Post-Sale Support",
            text: "We don't disappear after the sale. Enjoy after-sales support, warranty options, and maintenance recommendations.",
          },
        ],
        prosAndCons: {
          pros: {
            heading: "What You Get With Us",
            text: "Shop with confidence. We offer a curated selection of verified cars, transparent pricing, and a smooth buying process. No hidden charges, no stress — just peace of mind from test drive to key handover.",
          },
          cons: {
            heading: "Without Our Help",
            text: "Endless calls, shady sellers, overpriced vehicles, and wasting time chasing unverified listings. Buying a car shouldn't feel like a gamble. Avoid regret and shop smart — choose a dealership that puts you first.",
          },
        },
        getInTouch: {
          salesCard: {
            heading: "Speak to Someone in Sales",
            subheading:
              "To create a more value-added solution, it is essential to analyze the possibilities of improvement.",
            buttonText: "Send an Email",
          },
          teamCard: {
            heading: "Contact Our Team",
            subheading:
              "To create a more value-added solution, it is essential to analyze the possibilities of improvement.",
            buttonText: "Message us on WhatsApp",
          },
        },
      }

      const newSiteContent = new SiteContent(defaultContent)
      siteContent = await newSiteContent.save()
    }

    return {
      success: true,
      message: "Site content fetched successfully",
      data: convertToPlainObject(siteContent),
    }
  } catch (error) {
    console.error("Error fetching site content:", error)
    return {
      success: false,
      message: "Failed to fetch site content",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Update site content - equivalent to PUT route
export async function updateSiteContent(updatedContent: Partial<SiteContentData>): Promise<ActionResult> {
  try {
    await connectToDB()

    // Validation
    if (!updatedContent.hero || !updatedContent.subtitle) {
      return {
        success: false,
        message: "Hero and subtitle are required",
        error: "Validation failed",
      }
    }

    let siteContent = await SiteContent.findOne()

    if (siteContent) {
      // Update existing content
      const result = await SiteContent.findByIdAndUpdate(siteContent._id, updatedContent, {
        new: true, // Return updated document
        runValidators: true, // Run schema validation
        overwrite: false, // Don't overwrite entire document
      })

      // Revalidate paths
      revalidatePath("/")
      revalidatePath("/admin")
      revalidatePath("/admin/edit-content")

      return {
        success: true,
        message: "Site content updated successfully",
        data: convertToPlainObject(result),
      }
    } else {
      // Create new content
      siteContent = new SiteContent(updatedContent)
      const savedContent = await siteContent.save()

      // Revalidate paths
      revalidatePath("/")
      revalidatePath("/admin")
      revalidatePath("/admin/edit-content")

      return {
        success: true,
        message: "Site content created successfully",
        data: convertToPlainObject(savedContent),
      }
    }
  } catch (error) {
    console.error("Error updating site content:", error)
    return {
      success: false,
      message: "Failed to update site content",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Additional helper actions for specific operations
export async function addBrandToContent(brand: { name: string; image: string }): Promise<ActionResult> {
  try {
    await connectToDB()

    const content = await SiteContent.findOne()
    if (!content) {
      return {
        success: false,
        message: "Content not found",
        error: "No content document exists",
      }
    }

    content.brands.push(brand)
    const savedContent = await content.save()

    revalidatePath("/")
    revalidatePath("/admin/edit-content")

    return {
      success: true,
      message: "Brand added successfully",
      data: convertToPlainObject(savedContent),
    }
  } catch (error) {
    console.error("Error adding brand:", error)
    return {
      success: false,
      message: "Failed to add brand",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function removeBrandFromContent(brandIndex: number): Promise<ActionResult> {
  try {
    await connectToDB()

    const content = await SiteContent.findOne()
    if (!content) {
      return {
        success: false,
        message: "Content not found",
        error: "No content document exists",
      }
    }

    if (brandIndex < 0 || brandIndex >= content.brands.length) {
      return {
        success: false,
        message: "Invalid brand index",
        error: "Brand index out of range",
      }
    }

    content.brands.splice(brandIndex, 1)
    const savedContent = await content.save()

    revalidatePath("/")
    revalidatePath("/admin/edit-content")

    return {
      success: true,
      message: "Brand removed successfully",
      data: convertToPlainObject(savedContent),
    }
  } catch (error) {
    console.error("Error removing brand:", error)
    return {
      success: false,
      message: "Failed to remove brand",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export interface ContentDataResponse {
  _id: string;
  hero: string;
  subtitle: string;
  heroImage: string;

  brands: Array<{
    name: string;
    image: string;
  }>;

  whoAreWe: {
    heading: string;
    subtitle: string;
    listOfBenefits: string[];
  };

  whyChooseUs: Array<{
    heading: string;
    description: string;
    text: string;
  }>;

  prosAndCons: {
    pros: {
      heading: string;
      text: string;
    };
    cons: {
      heading: string;
      text: string;
    };
  };

  getInTouch: {
    salesCard: {
      heading: string;
      subheading: string;
      buttonText: string;
    };
    teamCard: {
      heading: string;
      subheading: string;
      buttonText: string;
    };
  };

  createdAt?: Date;
  updatedAt?: Date;
}



export async function fetchContentData(): Promise<ContentDataResponse | null> {
  try {
    await connectToDB();

    const content = await SiteContent.findOne().sort({ updatedAt: -1 }).lean<SiteContentLean>();

    if (!content) return null;

    return {
      _id: content._id.toString(),
      hero: content.hero,
      subtitle: content.subtitle,
      heroImage: content.heroImage || "",
      brands: content.brands.map((brand: any) => ({
        name: brand.name,
        image: brand.image,
      })),
      whoAreWe: {
        heading: content.whoAreWe.heading,
        subtitle: content.whoAreWe.subtitle,
        listOfBenefits: content.whoAreWe.listOfBenefits,
      },
      whyChooseUs: content.whyChooseUs.map((item: any) => ({
        heading: item.heading,
        description: item.description,
        text: item.text,
      })),
      prosAndCons: {
        pros: {
          heading: content.prosAndCons.pros.heading,
          text: content.prosAndCons.pros.text,
        },
        cons: {
          heading: content.prosAndCons.cons.heading,
          text: content.prosAndCons.cons.text,
        },
      },
      getInTouch: {
        salesCard: {
          heading: content.getInTouch.salesCard.heading,
          subheading: content.getInTouch.salesCard.subheading,
          buttonText: content.getInTouch.salesCard.buttonText,
        },
        teamCard: {
          heading: content.getInTouch.teamCard.heading,
          subheading: content.getInTouch.teamCard.subheading,
          buttonText: content.getInTouch.teamCard.buttonText,
        },
      },
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
    };
  } catch (error) {
    console.error("Error fetching content data:", error);
    return null;
  }
}