import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/home/HeroSection";
import BrandsSection from "@/components/home/BrandsSection";
import NewArrivals from "@/components/home/NewArrivals";
import TopSelling from "@/components/home/TopSelling";
import BrowseByStyle from "@/components/home/BrowseByStyle";
import ReviewsSection from "@/components/home/ReviewsSection";
import Footer from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

export default async function Home() {
  // 1. Database se New Arrivals fetch karein (Pehle 4 latest products)
  const newArrivals = await prisma.product.findMany({
    take: 4, 
    orderBy: { createdAt: "desc" }, 
    include: { reviews: true },
  });

  // 2. Database se Top Selling fetch karein (Pehle 4 products ko chor kar agle 4 products)
  const topSelling = await prisma.product.findMany({
    take: 4,
    skip: 4, // 👈 Yeh New Arrivals wale products ko repeat nahi hone dega
    orderBy: { price: "desc" }, 
    include: { reviews: true },
  });

  return (
    <main className="w-full">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Brands Bar */}
      <BrandsSection />

      {/* 3. New Arrivals Section */}
      <NewArrivals products={newArrivals} />

      {/* 4. Top Selling Section */}
      <TopSelling products={topSelling} />

      {/* 5. Browse By Dress Style Section */}
      <BrowseByStyle />

      {/* 6. Our Happy Customers Section */}
      <ReviewsSection />

      {/* 7. Footer Section */}
      <Footer />
    </main>
  );
}