"use client"

import { Edit3, Save, Eye, Plus, Trash2, Upload, ImageIcon, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

// Define plain object types for React state (without Mongoose methods)

export const dynamic = 'force-dynamic'
interface IBrand {
  name: string
  image: string
  isActive: boolean
  _id?: string
}

interface IWhoAreWe {
  heading: string
  subtitle: string
  listOfBenefits: string[]
}

interface IWhyChooseUsItem {
  heading: string
  text: string
  _id?: string
}

interface IProsAndCons {
  pros: {
    heading: string
    text: string
  }
  cons: {
    heading: string
    text: string
  }
}

interface IGetInTouch {
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

// Plain object interface for React state (no Mongoose methods)
interface SiteContentData {
  _id?: string
  hero: string
  subtitle: string
  heroImage: string
  brands: IBrand[]
  whoAreWe: IWhoAreWe
  whyChooseUs: IWhyChooseUsItem[]
  prosAndCons: IProsAndCons
  getInTouch: IGetInTouch
  createdAt?: string
  updatedAt?: string
}

// Sample data matching the API structure
const initialData: SiteContentData = {
  hero: "Find Your Dream Ride Today!",
  subtitle:
    "Browse our wide selection of reliable new and foreign used vehicles. Great prices, financing options, and nationwide delivery available",
  heroImage: "/hero.png",
  brands: [
    { name: "Mercedes-Benz", image: "/mercedes log.webp", isActive: true },
    { name: "Lexus", image: "/lexus logo.webp", isActive: true },
    { name: "Toyota", image: "/Toyota logo.webp", isActive: true },
    { name: "Rolls-Royce", image: "/Roll royce lgog.webp", isActive: true },
    { name: "Range-Rover", image: "/land rover logo.webp", isActive: true },
    { name: "Bentley", image: "/bentley logo.webp", isActive: true },
    { name: "Ford", image: "/ford logo.webp", isActive: true },
    { name: "BMW", image: "/bmw logo.webp", isActive: true },
    { name: "GAC", image: "/GAC logo.webp", isActive: true },
    { name: "Innoson", image: "/innoson logo.webp", isActive: true },
    { name: "NORD", image: "/nord logo.webp", isActive: true },
    { name: "Peugeot", image: "/peugeot logo.webp", isActive: true },
  ],
  whoAreWe: {
    heading: "Who Are We?",
    subtitle: "Welcome to DurieAutos.com - Your Trusted Source For High Quality Vehicle",
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
      subheading: "To create a more value-added solution, it is essential to analyze the possibilities of improvement.",
      buttonText: "Send an Email",
    },
    teamCard: {
      heading: "Contact Our Team",
      subheading: "To create a more value-added solution, it is essential to analyze the possibilities of improvement.",
      buttonText: "Message us on WhatsApp",
    },
  },
}

export default function EditContentPage() {
  // Use the plain object type for state
  const [contentData, setContentData] = useState<SiteContentData>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // Add this useEffect after the state declarations
  useEffect(() => {
    loadContentData()
  }, [])

  // Helper function to convert Mongoose document to plain object
  const convertToPlainObject = (mongooseDoc: any): SiteContentData => {
    // Method 1: Use toObject() if it's a Mongoose document
    if (mongooseDoc.toObject) {
      return mongooseDoc.toObject()
    }

    // Method 2: Use JSON.parse(JSON.stringify()) to strip Mongoose methods
    return JSON.parse(JSON.stringify(mongooseDoc))
  }

  const saveChanges = async () => {
    setIsSaving(true)
    try {
      // Filter out inactive brands before saving
      const activeBrands = contentData.brands.filter((brand) => brand.isActive)
      const inactiveBrandsCount = contentData.brands.length - activeBrands.length

      // Show warning if there are inactive brands that will be removed
      if (inactiveBrandsCount > 0) {
        toast({
          title: "Saving Active Brands Only",
          description: `${inactiveBrandsCount} inactive brand(s) will be removed from the database.`,
        })
      }

      // First, fetch the latest version to avoid conflicts
      const latestResponse = await fetch("/api/cms")
      if (latestResponse.ok) {
        const latestData = await latestResponse.json()

        // Prepare data with only active brands
        const dataToSave = {
          ...contentData,
          brands: activeBrands, // Only save active brands
          _id: latestData._id,
          __v: latestData.__v,
        }

        const response = await fetch("/api/cms", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSave),
        })

        if (!response.ok) {
          const errorData = await response.json()
          if (errorData.code === "VERSION_CONFLICT") {
            toast({
              title: "Conflict Detected",
              description: "The content was modified by another user. Please refresh the page and try again.",
              variant: "destructive",
            })
            return
          }
          throw new Error(errorData.error || "Failed to save changes")
        }

        const result = await response.json()

        toast({
          title: "Success!",
          description: `Changes saved successfully. ${activeBrands.length} active brand(s) saved to database.`,
        })

        // Don't update local state with server response to keep inactive brands visible
        // Only update the _id and __v for version tracking
        if (result.data) {
          setContentData((prev) => ({
            ...prev,
            _id: result.data._id,
            __v: result.data.__v,
            updatedAt: result.data.updatedAt,
          }))
        }
      }
    } catch (error) {
      console.error("Error saving content:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save changes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Example of how to load data from API
  const loadContentData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/cms")

      if (!response.ok) {
        throw new Error("Failed to load content")
      }

      const mongooseData = await response.json()
      const plainData = convertToPlainObject(mongooseData)

      // Create a map of existing brands for quick lookup
      const existingBrandsMap = new Map()
      contentData.brands.forEach((brand) => {
        existingBrandsMap.set(brand.name, { ...brand, isActive: false })
      })

      // Update active status for brands from API
      if (plainData.brands && Array.isArray(plainData.brands)) {
        plainData.brands.forEach((apiBrand) => {
          if (existingBrandsMap.has(apiBrand.name)) {
            // Update existing brand to active
            existingBrandsMap.set(apiBrand.name, {
              ...existingBrandsMap.get(apiBrand.name),
              ...apiBrand,
              isActive: true,
            })
          } else {
            // Add new brand from API as active
            existingBrandsMap.set(apiBrand.name, { ...apiBrand, isActive: true })
          }
        })
      }

      // Convert map back to array
      const mergedBrands = Array.from(existingBrandsMap.values())

      // Update state with merged data
      setContentData({
        ...plainData,
        brands: mergedBrands,
      })
    } catch (error) {
      console.error("Error loading content:", error)
      toast({
        title: "Error",
        description: "Failed to load content. Please refresh the page.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addBrand = () => {
    setContentData((prev) => ({
      ...prev,
      brands: [...prev.brands, { name: "", image: "", isActive: true }],
    }))
  }

  const toggleBrand = (index: number) => {
    setContentData((prev) => ({
      ...prev,
      brands: prev.brands.map((brand, i) => (i === index ? { ...brand, isActive: !brand.isActive } : brand)),
    }))
  }

  const updateBrand = (index: number, field: "name" | "image" | "isActive", value: string | boolean) => {
    setContentData((prev) => ({
      ...prev,
      brands: prev.brands.map((brand, i) => (i === index ? { ...brand, [field]: value } : brand)),
    }))
  }

  const addBenefit = () => {
    setContentData((prev) => ({
      ...prev,
      whoAreWe: {
        ...prev.whoAreWe,
        listOfBenefits: [...prev.whoAreWe.listOfBenefits, ""],
      },
    }))
  }

  const removeBenefit = (index: number) => {
    setContentData((prev) => ({
      ...prev,
      whoAreWe: {
        ...prev.whoAreWe,
        listOfBenefits: prev.whoAreWe.listOfBenefits.filter((_, i) => i !== index),
      },
    }))
  }

  const updateBenefit = (index: number, value: string) => {
    setContentData((prev) => ({
      ...prev,
      whoAreWe: {
        ...prev.whoAreWe,
        listOfBenefits: prev.whoAreWe.listOfBenefits.map((benefit, i) => (i === index ? value : benefit)),
      },
    }))
  }

  const addWhyChooseUs = () => {
    setContentData((prev) => ({
      ...prev,
      whyChooseUs: [...prev.whyChooseUs, { heading: "", text: "" }],
    }))
  }

  const removeWhyChooseUs = (index: number) => {
    setContentData((prev) => ({
      ...prev,
      whyChooseUs: prev.whyChooseUs.filter((_, i) => i !== index),
    }))
  }

  const updateWhyChooseUs = (index: number, field: "heading" | "text", value: string) => {
    setContentData((prev) => ({
      ...prev,
      whyChooseUs: prev.whyChooseUs.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

  const removeBrand = (index: number) => {
    setContentData((prev) => ({
      ...prev,
      brands: prev.brands.filter((_, i) => i !== index),
    }))
  }

  // Get counts for display
  const activeBrandsCount = contentData.brands.filter((brand) => brand.isActive).length
  const inactiveBrandsCount = contentData.brands.length - activeBrandsCount

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6 md:gap-6 lg:gap-8">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Website Content Editor</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Edit your dealership website content and sections.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <Eye className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Preview
            </Button>
          </Link>
          <Button onClick={saveChanges} disabled={isSaving} size="sm" className="text-xs sm:text-sm">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Hero Section
            </CardTitle>
            <CardDescription>Main banner content displayed on the homepage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hero">Main Headline</Label>
              <Input
                id="hero"
                value={contentData.hero}
                onChange={(e) => setContentData((prev) => ({ ...prev, hero: e.target.value }))}
                placeholder="Enter main headline"
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Textarea
                id="subtitle"
                value={contentData.subtitle}
                onChange={(e) =>
                  setContentData((prev) => ({
                    ...prev,
                    subtitle: e.target.value,
                  }))
                }
                placeholder="Enter subtitle text"
                className="min-h-[60px] sm:min-h-[80px] text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroImage">Hero Image Path</Label>
              <div className="flex gap-2">
                <Input
                  id="heroImage"
                  value={contentData.heroImage}
                  onChange={(e) =>
                    setContentData((prev) => ({
                      ...prev,
                      heroImage: e.target.value,
                    }))
                  }
                  placeholder="/hero.png"
                  className="text-sm"
                  disabled
                />
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brands Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Edit3 className="h-5 w-5" />
                Car Brands
              </span>
              <Button onClick={addBrand} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Brand
              </Button>
            </CardTitle>
            <CardDescription>
              Manage the car brands displayed on your website. Only active brands will be saved to the database, but
              inactive brands remain visible here for reactivation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Save Warning */}
            {inactiveBrandsCount > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> {inactiveBrandsCount} inactive brand(s) will not be saved to the database but
                  will remain visible here for reactivation. Only {activeBrandsCount} active brand(s) will be saved.
                </p>
              </div>
            )}

            {contentData.brands.map((brand, index) => (
              <div
                key={index}
                className={`flex gap-2 items-end p-3 rounded-lg border transition-all ${
                  brand.isActive ? "bg-background border-border" : "bg-muted/50 border-muted opacity-60"
                }`}
              >
                <div className="flex-1 space-y-2">
                  <Label>Brand Name</Label>
                  <Input
                    value={brand.name}
                    onChange={(e) => updateBrand(index, "name", e.target.value)}
                    placeholder="e.g., Mercedes-Benz"
                    className="text-sm"
                    disabled={!brand.isActive}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label>Logo Image Path</Label>
                  <Input
                    value={brand.image}
                    onChange={(e) => updateBrand(index, "image", e.target.value)}
                    placeholder="/brand-logo.webp"
                    className="text-sm"
                    disabled={!brand.isActive}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => toggleBrand(index)}
                    variant={brand.isActive ? "default" : "outline"}
                    size="sm"
                    className={
                      brand.isActive ? "bg-green-600 hover:bg-green-700" : "text-green-600 hover:text-green-700"
                    }
                  >
                    {brand.isActive ? "Active" : "Inactive"}
                  </Button>
                  <Button
                    onClick={() => removeBrand(index)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {/* Show summary of active/inactive brands */}
            <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
              <span>
                <span className="text-green-600 font-medium">{activeBrandsCount} active</span>
                {inactiveBrandsCount > 0 && (
                  <>
                    , <span className="text-amber-600 font-medium">{inactiveBrandsCount} inactive</span>
                  </>
                )}
                {inactiveBrandsCount > 0 && (
                  <span className="text-xs ml-2 text-amber-600">(will be removed on save)</span>
                )}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const allActive = contentData.brands.every((brand) => brand.isActive)
                  setContentData((prev) => ({
                    ...prev,
                    brands: prev.brands.map((brand) => ({
                      ...brand,
                      isActive: !allActive,
                    })),
                  }))
                }}
              >
                {contentData.brands.every((brand) => brand.isActive) ? "Deactivate All" : "Activate All"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Who Are We Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              Who Are We Section
            </CardTitle>
            <CardDescription>About section with benefits list</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="whoAreWeHeading">Section Heading</Label>
                <Input
                  id="whoAreWeHeading"
                  value={contentData.whoAreWe.heading}
                  onChange={(e) =>
                    setContentData((prev) => ({
                      ...prev,
                      whoAreWe: { ...prev.whoAreWe, heading: e.target.value },
                    }))
                  }
                  placeholder="Section heading"
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whoAreWeSubtitle">Subtitle</Label>
                <Input
                  id="whoAreWeSubtitle"
                  value={contentData.whoAreWe.subtitle}
                  onChange={(e) =>
                    setContentData((prev) => ({
                      ...prev,
                      whoAreWe: { ...prev.whoAreWe, subtitle: e.target.value },
                    }))
                  }
                  placeholder="Section subtitle"
                  className="text-sm"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Benefits List</Label>
                <Button onClick={addBenefit} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Benefit
                </Button>
              </div>
              {contentData.whoAreWe.listOfBenefits.map((benefit, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={benefit}
                    onChange={(e) => updateBenefit(index, e.target.value)}
                    placeholder="Enter benefit"
                    className="text-sm"
                  />
                  <Button
                    onClick={() => removeBenefit(index)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Why Choose Us Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Edit3 className="h-5 w-5" />
                Why Choose Us
              </span>
              <Button onClick={addWhyChooseUs} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Feature
              </Button>
            </CardTitle>
            <CardDescription>Features and benefits that set you apart</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {contentData.whyChooseUs.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Feature {index + 1}</Label>
                  <Button
                    onClick={() => removeWhyChooseUs(index)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Heading</Label>
                  <Input
                    value={item.heading}
                    onChange={(e) => updateWhyChooseUs(index, "heading", e.target.value)}
                    placeholder="Feature heading"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={item.text}
                    onChange={(e) => updateWhyChooseUs(index, "text", e.target.value)}
                    placeholder="Feature description"
                    className="min-h-[60px] text-sm"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pros and Cons Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              Pros and Cons Section
            </CardTitle>
            <CardDescription>Comparison section highlighting your advantages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-3">
                <Label className="text-base font-medium">Pros (With Your Service)</Label>
                <div className="space-y-2">
                  <Label>Heading</Label>
                  <Input
                    value={contentData.prosAndCons.pros.heading}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        prosAndCons: {
                          ...prev.prosAndCons,
                          pros: {
                            ...prev.prosAndCons.pros,
                            heading: e.target.value,
                          },
                        },
                      }))
                    }
                    placeholder="Pros heading"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={contentData.prosAndCons.pros.text}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        prosAndCons: {
                          ...prev.prosAndCons,
                          pros: {
                            ...prev.prosAndCons.pros,
                            text: e.target.value,
                          },
                        },
                      }))
                    }
                    placeholder="Pros description"
                    className="min-h-[80px] text-sm"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">Cons (Without Your Service)</Label>
                <div className="space-y-2">
                  <Label>Heading</Label>
                  <Input
                    value={contentData.prosAndCons.cons.heading}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        prosAndCons: {
                          ...prev.prosAndCons,
                          cons: {
                            ...prev.prosAndCons.cons,
                            heading: e.target.value,
                          },
                        },
                      }))
                    }
                    placeholder="Cons heading"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={contentData.prosAndCons.cons.text}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        prosAndCons: {
                          ...prev.prosAndCons,
                          cons: {
                            ...prev.prosAndCons.cons,
                            text: e.target.value,
                          },
                        },
                      }))
                    }
                    placeholder="Cons description"
                    className="min-h-[80px] text-sm"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Get In Touch Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              Get In Touch Section
            </CardTitle>
            <CardDescription>Contact cards for sales and team communication</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-3">
                <Label className="text-base font-medium">Sales Card</Label>
                <div className="space-y-2">
                  <Label>Heading</Label>
                  <Input
                    value={contentData.getInTouch.salesCard.heading}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        getInTouch: {
                          ...prev.getInTouch,
                          salesCard: {
                            ...prev.getInTouch.salesCard,
                            heading: e.target.value,
                          },
                        },
                      }))
                    }
                    placeholder="Sales card heading"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subheading</Label>
                  <Textarea
                    value={contentData.getInTouch.salesCard.subheading}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        getInTouch: {
                          ...prev.getInTouch,
                          salesCard: {
                            ...prev.getInTouch.salesCard,
                            subheading: e.target.value,
                          },
                        },
                      }))
                    }
                    placeholder="Sales card description"
                    className="min-h-[60px] text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Button Text</Label>
                  <Input
                    value={contentData.getInTouch.salesCard.buttonText}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        getInTouch: {
                          ...prev.getInTouch,
                          salesCard: {
                            ...prev.getInTouch.salesCard,
                            buttonText: e.target.value,
                          },
                        },
                      }))
                    }
                    placeholder="Button text"
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">Team Card</Label>
                <div className="space-y-2">
                  <Label>Heading</Label>
                  <Input
                    value={contentData.getInTouch.teamCard.heading}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        getInTouch: {
                          ...prev.getInTouch,
                          teamCard: {
                            ...prev.getInTouch.teamCard,
                            heading: e.target.value,
                          },
                        },
                      }))
                    }
                    placeholder="Team card heading"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subheading</Label>
                  <Textarea
                    value={contentData.getInTouch.teamCard.subheading}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        getInTouch: {
                          ...prev.getInTouch,
                          teamCard: {
                            ...prev.getInTouch.teamCard,
                            subheading: e.target.value,
                          },
                        },
                      }))
                    }
                    placeholder="Team card description"
                    className="min-h-[60px] text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Button Text</Label>
                  <Input
                    value={contentData.getInTouch.teamCard.buttonText}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        getInTouch: {
                          ...prev.getInTouch,
                          teamCard: {
                            ...prev.getInTouch.teamCard,
                            buttonText: e.target.value,
                          },
                        },
                      }))
                    }
                    placeholder="Button text"
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
