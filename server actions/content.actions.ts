"use server"

import { connectToDB } from "@/db/connectToDB"
import { SiteContent, type SiteContentLean } from "@/db/schema" // Remove ISiteContent import
import { revalidatePath } from "next/cache"

// Create a plain interface for the return type (without Mongoose Document methods)
export interface ContentDataResponse {
  _id: string
  hero: string
  subtitle: string
  heroImage: string
  brands: Array<{
    name: string
    image: string
  }>
  whoAreWe: {
    heading: string
    subtitle: string
    listOfBenefits: string[]
  }
  whyChooseUs: Array<{
    heading: string
    description: string
    text: string
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
  createdAt?: Date
  updatedAt?: Date
}

export async function fetchContentData(): Promise<ContentDataResponse | null> {
  try {
    await connectToDB()

    // Get the latest content (assuming you have one main content document)
    const content = await SiteContent.findOne().sort({ updatedAt: -1 }).lean<SiteContentLean>()

    if (!content) return null

    // Return a plain object that matches our interface
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
    }
  } catch (error) {
    console.error("Error fetching content data:", error)
    return null
  }
}

export async function updateContentData(
  contentData: Partial<ContentDataResponse>,
): Promise<{ success: boolean; message: string }> {
  try {
    await connectToDB()

    // Update the main content document using SiteContent model
    const updatedContent = await SiteContent.findOneAndUpdate(
      {}, // Find the first/main content document
      contentData,
      { new: true, upsert: true }, // Create if doesn't exist
    )

    if (!updatedContent) {
      return { success: false, message: "Failed to update content" }
    }

    // Trigger ISR revalidation for homepage
    revalidatePath("/")
    revalidatePath("/admin")
    revalidatePath("/admin/inventory")

    return { success: true, message: "Content updated successfully" }
  } catch (error: any) {
    console.error("Error updating content:", error.message)
    return { success: false, message: "Failed to update content: " + error.message }
  }
}

export async function addBrand(brand: { name: string; image: string }): Promise<{ success: boolean; message: string }> {
  try {
    await connectToDB()

    const content = await SiteContent.findOne()
    if (!content) {
      return { success: false, message: "Content not found" }
    }

    content.brands.push(brand)
    await content.save()

    revalidatePath("/")

    return { success: true, message: "Brand added successfully" }
  } catch (error: any) {
    console.error("Error adding brand:", error.message)
    return { success: false, message: "Failed to add brand: " + error.message }
  }
}

export async function removeBrand(brandIndex: number): Promise<{ success: boolean; message: string }> {
  try {
    await connectToDB()

    const content = await SiteContent.findOne()
    if (!content) {
      return { success: false, message: "Content not found" }
    }

    content.brands.splice(brandIndex, 1)
    await content.save()

    revalidatePath("/")

    return { success: true, message: "Brand removed successfully" }
  } catch (error: any) {
    console.error("Error removing brand:", error.message)
    return { success: false, message: "Failed to remove brand: " + error.message }
  }
}

// Helper function to create initial content if none exists
export async function createInitialContent(): Promise<{ success: boolean; message: string }> {
  try {
    await connectToDB()

    const existingContent = await SiteContent.findOne()
    if (existingContent) {
      return { success: true, message: "Content already exists" }
    }

    const initialContent = new SiteContent({
      hero: "Find Your Dream Car Today",
      subtitle: "Browse our wide selection of reliable vehicles",
      heroImage: "/hero.png",
      brands: [
        { name: "Mercedes-Benz", image: "/mercedes log.webp" },
        { name: "Lexus", image: "/lexus logo.webp" },
        { name: "Toyota", image: "/Toyota logo.webp" },
        { name: "BMW", image: "/bmw logo.webp" },
      ],
      whoAreWe: {
        heading: "Who Are We?",
        subtitle: "Your trusted automotive partner",
        listOfBenefits: ["Quality vehicles", "Great prices", "Excellent service", "Nationwide delivery"],
      },
      whyChooseUs: [
        {
          heading: "Wide Selection",
          description: "Extensive inventory",
          text: "Choose from hundreds of quality vehicles",
        },
        {
          heading: "Quality Assured",
          description: "Certified vehicles",
          text: "All vehicles undergo thorough inspection",
        },
      ],
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
    })

    await initialContent.save()

    return { success: true, message: "Initial content created successfully" }
  } catch (error: any) {
    console.error("Error creating initial content:", error.message)
    return { success: false, message: "Failed to create initial content: " + error.message }
  }
}
