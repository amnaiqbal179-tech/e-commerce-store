"use client";

import { useState, useRef, useEffect } from "react";
import { FaStar, FaCheckCircle } from "react-icons/fa";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Sarah M.",
    rating: 5,
    comment:
      "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
  },
  {
    id: 2,
    name: "Alex K.",
    rating: 5,
    comment:
      "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.",
  },
  {
    id: 3,
    name: "James L.",
    rating: 5,
    comment:
      "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
  },
  {
    id: 4,
    name: "Moiz Ali",
    rating: 5,
    comment:
      "Amazing quality and extremely fast delivery! The fabric feels premium and fits perfectly. Highly recommended to everyone.",
  },
  {
    id: 5,
    name: "Ayesha Khan",
    rating: 5,
    comment:
      "The customer service was great and the packaging was lovely. Will definitely shop again from Shop.co soon!",
  },
];

// Duplicate array for infinite smooth sliding loop
const extendedReviews = [...reviews, ...reviews, ...reviews];

export default function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(reviews.length);
  const [isAnimating, setIsAnimating] = useState(true);
  const [cardWidth, setCardWidth] = useState(400);
  const cardRef = useRef<HTMLDivElement>(null);

  // Dynamically measure card width for responsiveness
  useEffect(() => {
    const updateWidth = () => {
      if (cardRef.current) {
        setCardWidth(cardRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handleTransitionEnd = () => {
    if (currentIndex >= reviews.length * 2) {
      setIsAnimating(false);
      setCurrentIndex(reviews.length);
      setTimeout(() => setIsAnimating(true), 50);
    } else if (currentIndex < reviews.length) {
      setIsAnimating(false);
      setCurrentIndex(reviews.length * 2 - 1);
      setTimeout(() => setIsAnimating(true), 50);
    }
  };

  const gap = 20; // gap-5 (20px)

  return (
    <section className="w-full pt-12 lg:pt-20 pb-16 overflow-hidden">
      
      {/* Header Container - Aligned with Site Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[100px] mb-8 lg:mb-10 flex items-end justify-between">
        <h2 
          className="text-black font-extrabold uppercase tracking-tight text-[28px] sm:text-[36px] lg:text-[48px] leading-tight"
          style={{ fontFamily: "'Integral CF', 'Arial Black', sans-serif" }}
        >
          OUR HAPPY CUSTOMERS
        </h2>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="w-8 h-8 flex items-center justify-center text-black hover:opacity-60 transition-opacity cursor-pointer"
            aria-label="Previous Slide"
          >
            <GoArrowLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="w-8 h-8 flex items-center justify-center text-black hover:opacity-60 transition-opacity cursor-pointer"
            aria-label="Next Slide"
          >
            <GoArrowRight size={24} />
          </button>
        </div>
      </div>

      {/* Carousel Track Container with Desktop Left/Right Peeking & Blur */}
      <div className="w-full max-w-[1440px] mx-auto pl-4 sm:pl-6 lg:pl-[100px] overflow-visible">
        <div className="overflow-visible w-full">
          <div 
            className={`flex gap-5 ${isAnimating ? "transition-transform duration-500 ease-in-out" : ""}`}
            style={{
              transform: `translateX(calc(-${currentIndex} * (${cardWidth}px + ${gap}px)))`
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedReviews.map((review, index) => {
              // On desktop (lg), left peek is index === currentIndex - 1, right peek is index === currentIndex + 3
              const isLeftPeek = index === currentIndex - 1;
              const isRightPeek = index === currentIndex + 3;
              const shouldBlurDesktop = isLeftPeek || isRightPeek;

              return (
                <div
                  key={`${review.id}-${index}`}
                  ref={index === 0 ? cardRef : null}
                  className={`w-[300px] sm:w-[350px] lg:w-[400px] flex-shrink-0 bg-white border border-black/10 rounded-[20px] p-6 lg:p-7 flex flex-col justify-between transition-all duration-300 ${
                    shouldBlurDesktop ? "lg:opacity-50" : "opacity-100"
                  }`}
                >
                  <div className={`flex flex-col gap-3 transition-all duration-300 ${
                    shouldBlurDesktop ? "lg:blur-[4px] lg:select-none" : ""
                  }`}>
                    {/* Rating Stars */}
                    <div className="flex gap-1 text-[#FFC633]">
                      {[...Array(review.rating)].map((_, i) => (
                        <FaStar key={i} size={18} />
                      ))}
                    </div>

                    {/* Name & Verified Badge */}
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-black text-[18px] lg:text-[20px]">
                        {review.name}
                      </span>
                      <FaCheckCircle className="text-[#01AB31]" size={16} />
                    </div>

                    {/* Comment */}
                    <p className="font-satoshi text-black/60 text-[14px] lg:text-[16px] leading-[22px]">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </section>
  );
}