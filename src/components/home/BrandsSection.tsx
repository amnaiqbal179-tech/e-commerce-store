import Image from "next/image";

export default function BrandsSection() {
  return (
    <section className="w-full bg-black py-7 sm:py-8 lg:py-0 lg:h-[122px] flex items-center justify-center px-4 sm:px-10 lg:px-[100px] overflow-hidden">
      <div className="max-w-[1440px] w-full mx-auto flex flex-wrap lg:flex-nowrap items-center justify-around lg:justify-between gap-6 sm:gap-8 lg:gap-0">
        
        {/* Versace Logo */}
        <div className="relative h-[22px] sm:h-[28px] lg:h-[33px] w-[110px] sm:w-[140px] lg:w-[166px]">
          <Image 
            src="/versace.png" 
            alt="Versace"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Zara Logo */}
        <div className="relative h-[22px] sm:h-[30px] lg:h-[38px] w-[60px] sm:w-[75px] lg:w-[91px]">
          <Image 
            src="/zara.png" 
            alt="Zara"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Gucci Logo */}
        <div className="relative h-[22px] sm:h-[28px] lg:h-[36px] w-[100px] sm:w-[130px] lg:w-[156px]">
          <Image 
            src="/gucci.png" 
            alt="Gucci"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Prada Logo */}
        <div className="relative h-[22px] sm:h-[28px] lg:h-[32px] w-[120px] sm:w-[150px] lg:w-[194px]">
          <Image 
            src="/prada.png" 
            alt="Prada"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Calvin Klein Logo */}
        <div className="relative h-[22px] sm:h-[28px] lg:h-[32px] w-[110px] sm:w-[140px] lg:w-[175px]">
          <Image 
            src="/calvin-klein.png" 
            alt="Calvin Klein"
            fill
            className="object-contain"
            priority
          />
        </div>

      </div>
    </section>
  );
}