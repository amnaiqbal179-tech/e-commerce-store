export default function HeroSection() {
  return (
    <section className="w-full bg-[#F2F0F1] overflow-hidden pt-6 sm:pt-10 lg:pt-0">
      {/* Main Container */}
      <div className="w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-[100px] lg:py-16">
        
        {/* Left Content Area */}
        <div className="flex flex-col items-start w-full lg:w-1/2 z-20">
          
          {/* Main Heading - Responsive text size and line height */}
          <h1 
            style={{ fontFamily: "'Integral CF', 'Arial Black', sans-serif" }}
            className="font-extrabold text-[36px] sm:text-[48px] lg:text-[64px] leading-[34px] sm:leading-[48px] lg:leading-[64px] tracking-tight text-black w-full uppercase"
          >
            FIND CLOTHES <br />
            THAT MATCHES <br />
            YOUR STYLE
          </h1>

          {/* Subtitle */}
          <p className="font-satoshi text-[14px] lg:text-[16px] leading-[20px] lg:leading-[22px] text-black/60 mt-4 lg:mt-6 max-w-[500px]">
            Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
          </p>

          {/* Shop Now Button - Full width on mobile, auto width on desktop */}
          <button className="w-full lg:w-auto mt-6 lg:mt-8 bg-black text-white font-satoshi font-medium text-[16px] rounded-[62px] px-[54px] py-[16px] hover:bg-black/85 transition-all shadow-md cursor-pointer">
            Shop Now
          </button>

          {/* Stats Counters - 2 columns on mobile, 1 row on desktop */}
          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-y-4 mt-8 lg:mt-12 w-full">
            
            {/* Top row for mobile (200+ and 2000+) */}
            <div className="flex items-center justify-center gap-6 sm:gap-8 w-full lg:w-auto">
              <div className="flex flex-col items-start">
                <span className="font-satoshi font-bold text-[24px] lg:text-[40px] leading-none text-black">200+</span>
                <span className="font-satoshi text-[12px] lg:text-[16px] text-black/60 mt-1">International Brands</span>
              </div>
              
              {/* Divider between 200+ and 2000+ */}
              <div className="h-[40px] lg:h-[50px] w-[1px] bg-black/10"></div>
              
              <div className="flex flex-col items-start">
                <span className="font-satoshi font-bold text-[24px] lg:text-[40px] leading-none text-black">2,000+</span>
                <span className="font-satoshi text-[12px] lg:text-[16px] text-black/60 mt-1">High-Quality Products</span>
              </div>

              {/* Desktop specific divider before 30,000+ */}
              <div className="hidden lg:block h-[50px] w-[1px] bg-black/10 ml-6 sm:ml-8"></div>
            </div>

            {/* Bottom row for mobile (30,000+) */}
            <div className="flex flex-col items-center lg:items-start w-full lg:w-auto lg:ml-6 sm:lg:ml-8 mt-2 lg:mt-0">
              <span className="font-satoshi font-bold text-[24px] lg:text-[40px] leading-none text-black">30,000+</span>
              <span className="font-satoshi text-[12px] lg:text-[16px] text-black/60 mt-1">Happy Customers</span>
            </div>
            
          </div>

        </div>

        {/* Right Side Image & Vectors Area */}
        <div className="relative w-full lg:w-1/2 h-[400px] sm:h-[500px] lg:h-[600px] flex items-end justify-center mt-10 lg:mt-0">
          
          <img
            src="/Rectangle 2.jpg"
            alt="Trendy Fashionable Couple Posing"
            className="absolute right-0 bottom-0 w-full lg:w-[90%] h-full object-cover object-top pointer-events-none"
          />

          {/* Large Star Vector (Responsive width/position) */}
          <div className="absolute top-[5%] right-[5%] lg:right-[0%] z-10 pointer-events-none w-[50px] lg:w-[70px]">
            <svg viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M52 0C52 28.7279 75.2721 52 104 52C75.2721 52 52 75.2721 52 104C52 75.2721 28.7279 52 0 52C28.7279 52 52 28.7279 52 0Z" fill="black"/>
            </svg>
          </div>

          {/* Small Star Vector (Responsive width/position) */}
          <div className="absolute top-[40%] left-[5%] lg:left-[5%] z-10 pointer-events-none w-[35px] lg:w-[50px]">
            <svg viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M52 0C52 28.7279 75.2721 52 104 52C75.2721 52 52 75.2721 52 104C52 75.2721 28.7279 52 0 52C28.7279 52 52 28.7279 52 0Z" fill="black"/>
            </svg>
          </div>

        </div>

      </div>
    </section>
  );
}