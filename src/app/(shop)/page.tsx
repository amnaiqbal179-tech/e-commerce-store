import HeroSection from "@/components/home/HeroSection";
import BrandsSection from "@/components/home/BrandsSection";
import NewArrivals from "@/components/home/NewArrivals";
import TopSelling from "@/components/home/TopSelling";
import BrowseByStyle from "@/components/home/BrowseByStyle";
import ReviewsSection from "@/components/home/ReviewsSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="w-full">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Brands Bar */}
      <BrandsSection />

      {/* 3. New Arrivals Section */}
      <NewArrivals />

      {/* 4. Top Selling Section */}
      <TopSelling />

      {/* 5. Browse By Dress Style Section */}
      <BrowseByStyle />

      {/* 6. Our Happy Customers Section */}
      <ReviewsSection />

      {/* 7. Footer Section */}
      <Footer />
    </main>
  );
}