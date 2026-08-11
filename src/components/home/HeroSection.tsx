export default function HeroSection() {
  return (
    <section className="w-full bg-[#F2F0F1] overflow-hidden pt-0 relative">
      <div className="w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-[100px] pt-4 lg:pt-8 pb-0">
        
        {/* Left Content Area */}
        <div className="flex flex-col items-start w-full lg:w-1/2 z-20 pb-8 lg:pb-12">
          
          {/* Main Heading */}
          <h1 className="font-integral font-bold text-[32px] sm:text-[44px] lg:text-[60px] leading-[36px] sm:leading-[48px] lg:leading-[60px] tracking-tight text-black w-full uppercase">
            FIND CLOTHES <br />
            THAT MATCHES <br />
            YOUR STYLE
          </h1>

          {/* Subtitle */}
          <p className="font-satoshi text-[14px] lg:text-[15px] leading-[20px] text-black/60 mt-3 lg:mt-4 max-w-[480px]">
            Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
          </p>

          {/* Shop Now Button */}
          <button className="w-full lg:w-auto mt-5 lg:mt-6 bg-black text-white font-satoshi font-medium text-[16px] rounded-[62px] px-[50px] py-[14px] hover:bg-black/85 transition-all shadow-md cursor-pointer">
            Shop Now
          </button>

          {/* Stats Counters */}
          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-y-3 mt-6 lg:mt-8 w-full">
            <div className="flex items-center justify-center gap-5 sm:gap-6 w-full lg:w-auto">
              <div className="flex flex-col items-start">
                <span className="font-integral font-bold text-[24px] lg:text-[36px] leading-none text-black">200+</span>
                <span className="font-satoshi text-[12px] lg:text-[14px] text-black/60 mt-1">International Brands</span>
              </div>
              
              <div className="h-[35px] lg:h-[45px] w-[1px] bg-black/10"></div>
              
              <div className="flex flex-col items-start">
                <span className="font-integral font-bold text-[24px] lg:text-[36px] leading-none text-black">2,000+</span>
                <span className="font-satoshi text-[12px] lg:text-[14px] text-black/60 mt-1">High-Quality Products</span>
              </div>

              <div className="hidden lg:block h-[45px] w-[1px] bg-black/10 ml-5"></div>
            </div>

            <div className="flex flex-col items-center lg:items-start w-full lg:w-auto lg:ml-5 mt-2 lg:mt-0">
              <span className="font-integral font-bold text-[24px] lg:text-[36px] leading-none text-black">30,000+</span>
              <span className="font-satoshi text-[12px] lg:text-[14px] text-black/60 mt-1">Happy Customers</span>
            </div>
          </div>

        </div>

        {/* Right Side Image Area - Aligned to bottom without extra gap */}
        <div className="relative w-full lg:w-1/2 h-[380px] sm:h-[460px] lg:h-[500px] flex items-end justify-center self-end">
          <img
            src="/Rectangle 2.jpg"
            alt="Trendy Fashionable Couple Posing"
            className="absolute right-0 bottom-0 w-full lg:w-[95%] h-full object-cover object-top pointer-events-none"
          />

          {/* Top Right Star Icon */}
          <div className="absolute top-[8%] right-[2%] lg:right-[0%] z-10 pointer-events-none w-[45px] lg:w-[65px]">
            <svg viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M52 0C52 28.7279 75.2721 52 104 52C75.2721 52 52 75.2721 52 104C52 75.2721 28.7279 52 0 52C28.7279 52 52 28.7279 52 0Z" fill="black"/>
            </svg>
          </div>

          {/* Middle Left Star Icon */}
          <div className="absolute top-[42%] left-[2%] lg:left-[2%] z-10 pointer-events-none w-[30px] lg:w-[45px]">
            <svg viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M52 0C52 28.7279 75.2721 52 104 52C75.2721 52 52 75.2721 52 104C52 75.2721 28.7279 52 0 52C28.7279 52 52 28.7279 52 0Z" fill="black"/>
            </svg>
          </div>
        </div>

      </div>
    </section>
  );
}