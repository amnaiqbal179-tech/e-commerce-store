import Image from "next/image";
import Link from "next/link";

export default function BrowseByStyle() {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-[100px] py-6 lg:py-10">
      
      {/* Outer Grey Box Container */}
      <div className="w-full bg-[#F0F0F0] rounded-[30px] sm:rounded-[40px] px-6 sm:px-10 lg:px-16 py-8 sm:py-12 flex flex-col items-center">
        
        {/* Section Heading */}
        <h2 className="text-center text-black font-extrabold uppercase tracking-tight text-[28px] sm:text-[36px] lg:text-[48px] mb-8 lg:mb-12" style={{ fontFamily: "'Integral CF', 'Arial Black', sans-serif" }}>
          BROWSE BY DRESS STYLE
        </h2>

        {/* Cards Wrapper */}
        <div className="w-full flex flex-col gap-5">
          
          {/* Row 1: Casual & Formal */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            
            {/* Casual Card */}
            <Link 
              href="/shop?category=casual" 
              className="relative rounded-[20px] overflow-hidden bg-white h-[180px] sm:h-[220px] lg:h-[250px] md:col-span-5 group transition-transform duration-300 hover:scale-[0.99]"
            >
              <h3 className="absolute top-6 left-6 sm:top-8 sm:left-8 text-black font-bold text-[24px] sm:text-[32px] z-10">
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
              href="/shop?category=formal" 
              className="relative rounded-[20px] overflow-hidden bg-white h-[180px] sm:h-[220px] lg:h-[250px] md:col-span-7 group transition-transform duration-300 hover:scale-[0.99]"
            >
              <h3 className="absolute top-6 left-6 sm:top-8 sm:left-8 text-black font-bold text-[24px] sm:text-[32px] z-10">
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
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            
            {/* Party Card */}
            <Link 
              href="/shop?category=party" 
              className="relative rounded-[20px] overflow-hidden bg-white h-[180px] sm:h-[220px] lg:h-[250px] md:col-span-7 group transition-transform duration-300 hover:scale-[0.99]"
            >
              <h3 className="absolute top-6 left-6 sm:top-8 sm:left-8 text-black font-bold text-[24px] sm:text-[32px] z-10">
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
              href="/shop?category=gym" 
              className="relative rounded-[20px] overflow-hidden bg-white h-[180px] sm:h-[220px] lg:h-[250px] md:col-span-5 group transition-transform duration-300 hover:scale-[0.99]"
            >
              <h3 className="absolute top-6 left-6 sm:top-8 sm:left-8 text-black font-bold text-[24px] sm:text-[32px] z-10">
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