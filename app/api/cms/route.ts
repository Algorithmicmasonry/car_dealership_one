
import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from "@/db/connectToDB";
import { SiteContent, ISiteContent } from "@/db/schema"
import { brands } from '@/constants';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    await connectToDB();
    
    let siteContent = await SiteContent.findOne().lean();
    
    // If no content exists, create default content
    if (!siteContent) {
      const defaultContent = {
        hero: "Find Your Dream Ride Today!",
        subtitle: "Browse our wide selection of reliable new and foreign used vehicles. Great prices, financing options, and nationwide delivery available",
        heroImage: "/hero.png",
        brands: brands,
        whoAreWe: {
          heading: "Who Are We?",
          subtitle: "Welcome to DurieAutos.com - Your Trusted Source For High Quality Vehicle",
          description:"Looking for a place to purchase high quality cars? You've come to the right place! carhub.com is the best place to find premium and high quality cars" ,
          listOfBenefits: [
            "Certified quality and inspection guarantee",
            "Transparent Pricing with No Hidden Fees",
            "24/7 Customer Support Team Available",
            "Easy-to-use website to compare vehicles"
          ]
        },
        whyChooseUs: [
          {
            heading: "Wide Vehicle Selection",
            text: "From affordable sedans to premium SUVs, our inventory is carefully curated to suit every budget and lifestyle.."
          },
          {
            heading: "Certified Inspections",
            text: "Every vehicle undergoes a thorough inspection by certified mechanics, giving you peace of mind before you buy."
          },
          {
            heading: "Transparent Pricing",
            text: "No hidden fees or surprise charges—what you see is what you pay. We offer honest pricing and great value."
          },
          {
            heading: "Post-Sale Support",
            text: "We don't disappear after the sale. Enjoy after-sales support, warranty options, and maintenance recommendations."
          }
        ],
        prosAndCons: {
          pros: {
            heading: "What You Get With Us",
            text: "Shop with confidence. We offer a curated selection of verified cars, transparent pricing, and a smooth buying process. No hidden charges, no stress — just peace of mind from test drive to key handover."
          },
          cons: {
            heading: "Without Our Help",
            text: "Endless calls, shady sellers, overpriced vehicles, and wasting time chasing unverified listings. Buying a car shouldn't feel like a gamble. Avoid regret and shop smart — choose a dealership that puts you first."
          }
        },
        getInTouch: {
          salesCard: {
            heading: "Speak to Someone in Sales",
            subheading: "To create a more value-added solution, it is essential to analyze the possibilities of improvement.",
            buttonText: "Send an Email"
          },
          teamCard: {
            heading: "Contact Our Team",
            subheading: "To create a more value-added solution, it is essential to analyze the possibilities of improvement.",
            buttonText: "Message us on WhatsApp"
          }
        }
      };
      
      const newSiteContent = new SiteContent(defaultContent);
      siteContent = await newSiteContent.save();
    }
    
    return NextResponse.json(siteContent);
  } catch (error) {
    console.error('Error fetching site content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site content' },
      { status: 500 }
    );
  }
}

// In your PUT route
export async function PUT(request: NextRequest) {
  try {
    await connectToDB();
    
    const updatedContent: Partial<ISiteContent> = await request.json();
    
    if (!updatedContent.hero || !updatedContent.subtitle) {
      return NextResponse.json(
        { error: 'Hero and subtitle are required' },
        { status: 400 }
      );
    }
    
    let siteContent = await SiteContent.findOne();
    
    if (siteContent) {
      // Update without version checking
      const result = await SiteContent.findByIdAndUpdate(
        siteContent._id,
        updatedContent,
        { 
          new: true,           // Return updated document
          runValidators: true, // Run schema validation
          overwrite: false     // Don't overwrite entire document
        }
      );

      revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/admin/edit-content')
      return NextResponse.json({
        message: 'Site content updated successfully',
        data: result
      });
    } else {
      // Create new content
      siteContent = new SiteContent(updatedContent);
      await siteContent.save();

      revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/admin/edit-content')
      return NextResponse.json({
        message: 'Site content created successfully',
        data: siteContent
      });


    }

    

  } catch (error) {
    console.error('Error updating site content:', error);
    return NextResponse.json(
      { error: 'Failed to update site content' },
      { status: 500 }
    );
  }
}
