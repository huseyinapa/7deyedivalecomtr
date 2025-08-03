import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";

export default function Carousel() {
  const images = [
    {
      src: "/assets/carousel/vale1.png",
      alt: "7 de Yedi Vale kurye Isparta'da teslimat için hazır",
    },
    {
      src: "/assets/carousel/vale2.png",
      alt: "Teslimatı zamanında yetiştiren 7 de Yedi Vale kurye",
    },
    {
      src: "/assets/carousel/vale3.png",
      alt: "7 de Yedi Vale kurye motoruyla güvenli teslimat yapıyor",
    },
    {
      src: "/assets/carousel/vale4.png",
      alt: "7 de Yedi Vale kurye yolda hızla ilerliyor",
    },
    {
      src: "/assets/carousel/vale5.png",
      alt: "Dağlık bölgede güvenle seyahat eden 7 de Yedi Vale kurye",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startInterval = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    startInterval();
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    startInterval();
  };

  return (
    <div className="max-w-screen mx-auto bg-[#333]">
      <div id="default-carousel" className="relative" data-carousel="static">
        <div className="overflow-hidden relative h-[210px] sm:h-[440px] xl:h-[510px] 2xl:h-[570px]">
          {images.map((image, index) => (
            <div
              key={index}
              className={`duration-700 ease-in-out ${index === currentIndex ? "block" : "hidden"
                }`}
              data-carousel-item=""
            >
              <Image
                src={image.src}
                className={`absolute w-screen h-auto ${index !== 0 &&
                  "top-1/2 left-1/2 -translate-x-1/2 -translate-y-2/4"
                  }`}
                alt={image.alt}
                priority={index === currentIndex}
                width={1260}
                height={800}
              />
            </div>
          ))}
        </div>
        <div className="flex absolute bottom-5 left-1/2 z-30 space-x-3 -translate-x-1/2">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`w-6 h-2 rounded-full ${currentIndex === index ? "bg-[#edc81e]" : "bg-white"
                }`}
              aria-current={currentIndex === index ? "true" : "false"}
              aria-label={`Slide ${index + 1}`}
              onClick={() => {
                setCurrentIndex(index);
                startInterval();
              }}
            />
          ))}
        </div>
        <button
          type="button"
          className="flex absolute top-0 left-0 z-30 justify-center items-center px-4 h-full cursor-pointer group focus:outline-none"
          onClick={handlePrev}
          data-carousel-prev=""
        >
          <span className="inline-flex justify-center items-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30 group-hover:bg-white/50 focus:ring-4 focus:ring-white focus:outline-none">
            <svg
              className="w-5 h-5 text-white sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="hidden">Previous</span>
          </span>
        </button>
        <button
          type="button"
          className="flex absolute top-0 right-0 z-30 justify-center items-center px-4 h-full cursor-pointer group focus:outline-none"
          onClick={handleNext}
          data-carousel-next=""
        >
          <span className="inline-flex justify-center items-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30 group-hover:bg-white/50 focus:ring-4 focus:ring-white focus:outline-none">
            <svg
              className="w-5 h-5 text-white sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="hidden">Next</span>
          </span>
        </button>
      </div>
    </div>
  );
}
