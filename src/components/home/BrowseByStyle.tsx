import Image from "next/image";
import Link from "next/link";

export default function BrowseByStyle() {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-[100px] py-2 lg:py-4">
      
      {/* Outer Grey Box Container - Compact Padding */}
      <div className="w-full bg-[#F0F0F0] rounded-[24px] sm:rounded-[36px] px-4 sm:px-8 lg:px-12 py-6 sm:py-8 flex flex-col items-center">
        
        {/* Section Heading */}
        <h2 className="text-center text-black font-extrabold uppercase tracking-tight text-[24px] sm:text-[32px] lg:text-[40px] mb-5 lg:mb-7" style={{ fontFamily: "'Integral CF', 'Arial Black', sans-serif" }}>
          BROWSE BY DRESS STYLE
        </h2>

        {/* Cards Wrapper */}
        <div className="w-full flex flex-col gap-3 sm:gap-4">
          
          {/* Row 1: Casual & Formal */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
            
            {/* Casual Card */}
            <Link 
              href="/styles/casual" 
              className="relative rounded-[16px] sm:rounded-[20px] overflow-hidden bg-white h-[130px] sm:h-[160px] lg:h-[185px] md:col-span-5 group transition-transform duration-300 hover:scale-[0.99]"
            >
              <h3 className="absolute top-4 left-4 sm:top-5 sm:left-5 text-black font-bold text-[18px] sm:text-[24px] lg:text-[28px] z-10">
                Casual
              </h3>
              <Image 
                src="/styles/casual.png" 
                alt="Casual"
                fill
                className="object-cover object-right-top group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </Link>

            {/* Formal Card */}
            <Link 
              href="/styles/formal" 
              className="relative rounded-[16px] sm:rounded-[20px] overflow-hidden bg-white h-[130px] sm:h-[160px] lg:h-[185px] md:col-span-7 group transition-transform duration-300 hover:scale-[0.99]"
            >
              <h3 className="absolute top-4 left-4 sm:top-5 sm:left-5 text-black font-bold text-[18px] sm:text-[24px] lg:text-[28px] z-10">
                Formal
              </h3>
              <Image 
                src="/styles/formal.png" 
                alt="Formal"
                fill
                className="object-cover object-right-top group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            </Link>

          </div>

          {/* Row 2: Party & Gym */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
            
            {/* Party Card */}
            <Link 
              href="/styles/party" 
              className="relative rounded-[16px] sm:rounded-[20px] overflow-hidden bg-white h-[130px] sm:h-[160px] lg:h-[185px] md:col-span-7 group transition-transform duration-300 hover:scale-[0.99]"
            >
              <h3 className="absolute top-4 left-4 sm:top-5 sm:left-5 text-black font-bold text-[18px] sm:text-[24px] lg:text-[28px] z-10">
                Party
              </h3>
              <Image 
                src="/styles/party.png" 
                alt="Party"
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            </Link>

            {/* Gym Card */}
            <Link 
              href="/styles/gym" 
              className="relative rounded-[16px] sm:rounded-[20px] overflow-hidden bg-white h-[130px] sm:h-[160px] lg:h-[185px] md:col-span-5 group transition-transform duration-300 hover:scale-[0.99]"
            >
              <h3 className="absolute top-4 left-4 sm:top-5 sm:left-5 text-black font-bold text-[18px] sm:text-[24px] lg:text-[28px] z-10">
                Gym
              </h3>
              <Image 
                src="/styles/gym.png" 
                alt="Gym"
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}