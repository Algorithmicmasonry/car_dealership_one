"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Save, Plus, Trash2, Eye, Edit3, LogOut, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ISiteContent {
  hero: string
  subtitle: string
  heroImage: string
  brands: IBrand[]
  whoAreWe: {
    heading: string
    subtitle: string
    listOfBenefits: string[]
  }
  whyChooseUs: IWhyChooseUsItem[]
  prosAndCons: {
    pros: { heading: string; text: string }
    cons: { heading: string; text: string }
  }
  getInTouch: {
    salesCard: { heading: string; subheading: string; buttonText: string }
    teamCard: { heading: string; subheading: string; buttonText: string }
  }
}

interface IBrand {
  name: string
  image: string
}

interface IWhyChooseUsItem {
  heading: string
  text: string
}

interface CMSProps {
  onLogout: () => void
}

const CarDealershipCMS: React.FC<CMSProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("hero")
  const [isPreview, setIsPreview] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [siteContent, setSiteContent] = useState<Partial<ISiteContent>>({
    hero: "",
    subtitle: "",
    heroImage: "",
    brands: [],
    whoAreWe: {
      heading: "",
      subtitle: "",
      listOfBenefits: [],
    },
    whyChooseUs: [],
    prosAndCons: {
      pros: { heading: "", text: "" },
      cons: { heading: "", text: "" },
    },
    getInTouch: {
      salesCard: { heading: "", subheading: "", buttonText: "" },
      teamCard: { heading: "", subheading: "", buttonText: "" },
    },
  })
  const [savedStatus, setSavedStatus] = useState<"success" | "error" | "">("")

  useEffect(() => {
    loadSiteContent()
  }, [])

  const loadSiteContent = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("cmsToken")
      const response = await fetch("/api/cms/site-content", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSiteContent(data)
      } else if (response.status === 401) {
        onLogout()
      }
    } catch (error) {
      console.error("Error loading site content:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setSavedStatus("")
      const token = localStorage.getItem("cmsToken")
      const response = await fetch("/api/cms/site-content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(siteContent),
      })

      if (response.ok) {
        setSavedStatus("success")
      } else if (response.status === 401) {
        onLogout()
        return
      } else {
        setSavedStatus("error")
      }
      setTimeout(() => setSavedStatus(""), 3000)
    } catch (error) {
      console.error("Error saving changes:", error)
      setSavedStatus("error")
      setTimeout(() => setSavedStatus(""), 3000)
    } finally {
      setSaving(false)
    }
  }

  const updateContent = (path: string, value: any) => {
    setSiteContent((prev) => {
      const newContent = { ...prev }
      const keys = path.split(".")
      let current: any = newContent

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {}
        current = current[keys[i]]
      }

      current[keys[keys.length - 1]] = value
      return newContent
    })
  }

  const addBrand = () => {
    setSiteContent((prev) => ({
      ...prev,
      brands: [...(prev.brands || []), { name: "New Brand", image: "/new-brand-logo.webp" }],
    }))
  }

  const removeBrand = (index: number) => {
    setSiteContent((prev) => ({
      ...prev,
      brands: prev.brands?.filter((_, i) => i !== index) || [],
    }))
  }

  const updateBrand = (index: number, field: keyof IBrand, value: string) => {
    setSiteContent((prev) => ({
      ...prev,
      brands: prev.brands?.map((brand, i) => (i === index ? { ...brand, [field]: value } : brand)) || [],
    }))
  }

  const addBenefit = () => {
    setSiteContent((prev) => ({
      ...prev,
      whoAreWe: {
        ...prev.whoAreWe!,
        listOfBenefits: [...(prev.whoAreWe?.listOfBenefits || []), "New benefit"],
      },
    }))
  }

  const removeBenefit = (index: number) => {
    setSiteContent((prev) => ({
      ...prev,
      whoAreWe: {
        ...prev.whoAreWe!,
        listOfBenefits: prev.whoAreWe?.listOfBenefits?.filter((_, i) => i !== index) || [],
      },
    }))
  }

  const addWhyChooseUs = () => {
    setSiteContent((prev) => ({
      ...prev,
      whyChooseUs: [...(prev.whyChooseUs || []), { heading: "New Feature", text: "Description here" }],
    }))
  }

  const removeWhyChooseUs = (index: number) => {
    setSiteContent((prev) => ({
      ...prev,
      whyChooseUs: prev.whyChooseUs?.filter((_, i) => i !== index) || [],
    }))
  }

  const updateWhyChooseUs = (index: number, field: keyof IWhyChooseUsItem, value: string) => {
    setSiteContent((prev) => ({
      ...prev,
      whyChooseUs: prev.whyChooseUs?.map((item, i) => (i === index ? { ...item, [field]: value } : item)) || [],
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <p className="text-slate-600 text-lg">Loading CMS...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isPreview) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Website Preview</h1>
                <p className="text-slate-600">Live preview of your website</p>
              </div>
              <Button onClick={() => setIsPreview(false)} variant="outline" className="gap-2">
                <Edit3 size={16} />
                Back to Edit
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-6 space-y-12">
          {/* Hero Section */}
          <section className="text-center py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white rounded-xl shadow-2xl">
            <h1 className="text-6xl font-bold mb-6">{siteContent.hero}</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">{siteContent.subtitle}</p>
          </section>

          {/* Brands */}
          <section>
            <h2 className="text-4xl font-bold text-center mb-12 text-slate-900">Our Brands</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {siteContent.brands?.map((brand, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <img src={brand.image || "/placeholder.svg"} alt={brand.name} className="h-16 mx-auto mb-4" />
                    <div className="text-lg font-semibold text-slate-900">{brand.name}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Who Are We */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-4xl font-bold mb-6 text-slate-900">{siteContent.whoAreWe?.heading}</h2>
              <p className="text-slate-600 mb-8 text-lg">{siteContent.whoAreWe?.subtitle}</p>
              <div className="grid md:grid-cols-2 gap-4">
                {siteContent.whoAreWe?.listOfBenefits?.map((benefit, index) => (
                  <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mr-4"></div>
                    <span className="text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Why Choose Us */}
          <section>
            <h2 className="text-4xl font-bold text-center mb-12 text-slate-900">Why Choose Us</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {siteContent.whyChooseUs?.map((item, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-slate-900">{item.heading}</h3>
                    <p className="text-slate-600">{item.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Pros and Cons */}
          <section className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-green-800 mb-4">{siteContent.prosAndCons?.pros.heading}</h3>
                <p className="text-green-700 text-lg">{siteContent.prosAndCons?.pros.text}</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-amber-800 mb-4">{siteContent.prosAndCons?.cons.heading}</h3>
                <p className="text-amber-700 text-lg">{siteContent.prosAndCons?.cons.text}</p>
              </CardContent>
            </Card>
          </section>

          {/* Get In Touch */}
          <section className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">{siteContent.getInTouch?.salesCard.heading}</h3>
                <p className="mb-6 opacity-90 text-lg">{siteContent.getInTouch?.salesCard.subheading}</p>
                <Button variant="secondary" size="lg">
                  {siteContent.getInTouch?.salesCard.buttonText}
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">{siteContent.getInTouch?.teamCard.heading}</h3>
                <p className="mb-6 opacity-90 text-lg">{siteContent.getInTouch?.teamCard.subheading}</p>
                <Button variant="secondary" size="lg">
                  {siteContent.getInTouch?.teamCard.buttonText}
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Content Management System</h1>
              <p className="text-slate-600">Manage your car dealership website content</p>
            </div>
            <div className="flex items-center gap-3">
              {savedStatus && (
                <Alert
                  className={`w-auto ${savedStatus === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}
                >
                  <AlertDescription
                    className={`flex items-center gap-2 ${savedStatus === "error" ? "text-red-700" : "text-green-700"}`}
                  >
                    {savedStatus === "error" ? (
                      <>
                        <AlertCircle size={16} />
                        Error saving changes
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        Changes saved successfully!
                      </>
                    )}
                  </AlertDescription>
                </Alert>
              )}
              <Button onClick={() => setIsPreview(true)} variant="outline" className="gap-2">
                <Eye size={16} />
                Preview
              </Button>
              <Button onClick={handleSave} disabled={saving} className="gap-2">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button onClick={onLogout} variant="destructive" className="gap-2">
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-6 bg-white shadow-sm">
            <TabsTrigger value="hero" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Hero Section
            </TabsTrigger>
            <TabsTrigger value="brands" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Brands
            </TabsTrigger>
            <TabsTrigger value="whoAreWe" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Who Are We
            </TabsTrigger>
            <TabsTrigger value="whyChooseUs" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Why Choose Us
            </TabsTrigger>
            <TabsTrigger value="prosAndCons" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Pros & Cons
            </TabsTrigger>
            <TabsTrigger value="getInTouch" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Get In Touch
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hero">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Hero Section
                  <Badge variant="secondary">Main Landing</Badge>
                </CardTitle>
                <CardDescription>Configure the main hero section that visitors see first</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="hero-title">Hero Title</Label>
                    <Input
                      id="hero-title"
                      value={siteContent.hero || ""}
                      onChange={(e) => updateContent("hero", e.target.value)}
                      placeholder="Enter compelling hero title"
                      className="text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                      id="subtitle"
                      value={siteContent.subtitle || ""}
                      onChange={(e) => updateContent("subtitle", e.target.value)}
                      placeholder="Enter descriptive subtitle"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero-image">Hero Image URL</Label>
                  <Input
                    id="hero-image"
                    value={siteContent.heroImage || ""}
                    onChange={(e) => updateContent("heroImage", e.target.value)}
                    placeholder="Enter hero image URL"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="brands">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    Brands
                    <Badge variant="secondary">{siteContent.brands?.length || 0} brands</Badge>
                  </div>
                  <Button onClick={addBrand} size="sm" className="gap-2">
                    <Plus size={16} />
                    Add Brand
                  </Button>
                </CardTitle>
                <CardDescription>Manage the car brands you work with</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {siteContent.brands?.map((brand, index) => (
                    <Card key={index} className="bg-slate-50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-1 grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Brand Name</Label>
                              <Input
                                value={brand.name}
                                onChange={(e) => updateBrand(index, "name", e.target.value)}
                                placeholder="Brand name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Logo URL</Label>
                              <Input
                                value={brand.image}
                                onChange={(e) => updateBrand(index, "image", e.target.value)}
                                placeholder="Logo image URL"
                              />
                            </div>
                          </div>
                          <Button onClick={() => removeBrand(index)} variant="destructive" size="sm">
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {(!siteContent.brands || siteContent.brands.length === 0) && (
                    <div className="text-center py-12 text-slate-500">
                      <p>No brands added yet. Click "Add Brand" to get started.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="whoAreWe">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Who Are We
                  <Badge variant="secondary">About Section</Badge>
                </CardTitle>
                <CardDescription>Tell your story and highlight your benefits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="who-heading">Section Heading</Label>
                    <Input
                      id="who-heading"
                      value={siteContent.whoAreWe?.heading || ""}
                      onChange={(e) => updateContent("whoAreWe.heading", e.target.value)}
                      placeholder="Who are we heading"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="who-subtitle">Section Subtitle</Label>
                    <Textarea
                      id="who-subtitle"
                      value={siteContent.whoAreWe?.subtitle || ""}
                      onChange={(e) => updateContent("whoAreWe.subtitle", e.target.value)}
                      placeholder="Describe your company"
                      rows={3}
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Benefits List</h3>
                      <p className="text-sm text-slate-600">Key benefits or features you offer</p>
                    </div>
                    <Button onClick={addBenefit} size="sm" className="gap-2">
                      <Plus size={16} />
                      Add Benefit
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {siteContent.whoAreWe?.listOfBenefits?.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Input
                          value={benefit}
                          onChange={(e) => {
                            const newBenefits = [...(siteContent.whoAreWe?.listOfBenefits || [])]
                            newBenefits[index] = e.target.value
                            updateContent("whoAreWe.listOfBenefits", newBenefits)
                          }}
                          placeholder="Enter benefit"
                          className="flex-1"
                        />
                        <Button onClick={() => removeBenefit(index)} variant="destructive" size="sm">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="whyChooseUs">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    Why Choose Us
                    <Badge variant="secondary">{siteContent.whyChooseUs?.length || 0} features</Badge>
                  </div>
                  <Button onClick={addWhyChooseUs} size="sm" className="gap-2">
                    <Plus size={16} />
                    Add Feature
                  </Button>
                </CardTitle>
                <CardDescription>Highlight what makes you different from competitors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {siteContent.whyChooseUs?.map((item, index) => (
                    <Card key={index} className="bg-slate-50">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-1 space-y-4">
                            <div className="space-y-2">
                              <Label>Feature Heading</Label>
                              <Input
                                value={item.heading}
                                onChange={(e) => updateWhyChooseUs(index, "heading", e.target.value)}
                                placeholder="Feature title"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Textarea
                                value={item.text}
                                onChange={(e) => updateWhyChooseUs(index, "text", e.target.value)}
                                placeholder="Feature description"
                                rows={3}
                              />
                            </div>
                          </div>
                          <Button onClick={() => removeWhyChooseUs(index)} variant="destructive" size="sm">
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {(!siteContent.whyChooseUs || siteContent.whyChooseUs.length === 0) && (
                    <div className="text-center py-12 text-slate-500">
                      <p>No features added yet. Click "Add Feature" to get started.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prosAndCons">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">Pros Section</CardTitle>
                  <CardDescription>Highlight the positive aspects</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pros-heading">Pros Heading</Label>
                    <Input
                      id="pros-heading"
                      value={siteContent.prosAndCons?.pros.heading || ""}
                      onChange={(e) => updateContent("prosAndCons.pros.heading", e.target.value)}
                      placeholder="Pros section title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pros-text">Pros Content</Label>
                    <Textarea
                      id="pros-text"
                      value={siteContent.prosAndCons?.pros.text || ""}
                      onChange={(e) => updateContent("prosAndCons.pros.text", e.target.value)}
                      placeholder="Describe the positive aspects"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-amber-200">
                <CardHeader>
                  <CardTitle className="text-amber-800">Considerations Section</CardTitle>
                  <CardDescription>Address potential concerns honestly</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cons-heading">Considerations Heading</Label>
                    <Input
                      id="cons-heading"
                      value={siteContent.prosAndCons?.cons.heading || ""}
                      onChange={(e) => updateContent("prosAndCons.cons.heading", e.target.value)}
                      placeholder="Considerations section title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cons-text">Considerations Content</Label>
                    <Textarea
                      id="cons-text"
                      value={siteContent.prosAndCons?.cons.text || ""}
                      onChange={(e) => updateContent("prosAndCons.cons.text", e.target.value)}
                      placeholder="Address any considerations"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="getInTouch">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-800">Sales Card</CardTitle>
                  <CardDescription>Configure the sales contact section</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sales-heading">Sales Heading</Label>
                    <Input
                      id="sales-heading"
                      value={siteContent.getInTouch?.salesCard.heading || ""}
                      onChange={(e) => updateContent("getInTouch.salesCard.heading", e.target.value)}
                      placeholder="Sales section title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sales-subheading">Sales Subheading</Label>
                    <Textarea
                      id="sales-subheading"
                      value={siteContent.getInTouch?.salesCard.subheading || ""}
                      onChange={(e) => updateContent("getInTouch.salesCard.subheading", e.target.value)}
                      placeholder="Sales description"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sales-button">Button Text</Label>
                    <Input
                      id="sales-button"
                      value={siteContent.getInTouch?.salesCard.buttonText || ""}
                      onChange={(e) => updateContent("getInTouch.salesCard.buttonText", e.target.value)}
                      placeholder="Contact sales button text"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">Team Card</CardTitle>
                  <CardDescription>Configure the team contact section</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="team-heading">Team Heading</Label>
                    <Input
                      id="team-heading"
                      value={siteContent.getInTouch?.teamCard.heading || ""}
                      onChange={(e) => updateContent("getInTouch.teamCard.heading", e.target.value)}
                      placeholder="Team section title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="team-subheading">Team Subheading</Label>
                    <Textarea
                      id="team-subheading"
                      value={siteContent.getInTouch?.teamCard.subheading || ""}
                      onChange={(e) => updateContent("getInTouch.teamCard.subheading", e.target.value)}
                      placeholder="Team description"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="team-button">Button Text</Label>
                    <Input
                      id="team-button"
                      value={siteContent.getInTouch?.teamCard.buttonText || ""}
                      onChange={(e) => updateContent("getInTouch.teamCard.buttonText", e.target.value)}
                      placeholder="Contact team button text"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default CarDealershipCMS
