"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";

type SliderProps = {
  images: string[];
};

const Slider = ({ images }: SliderProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 2500);

    return () => window.clearInterval(interval);
  }, [images.length]);

  if (!images.length) return null;

  return (
    <div className="home-slider rounded-2xl overflow-hidden">
      <img
        src={images[activeIndex]}
        alt={`Promotional banner ${activeIndex + 1}`}
      />
      <div>
        {images.map((image, index) => (
          <button
            aria-label={`Show banner ${index + 1}`}
            className={index === activeIndex ? "active" : ""}
            key={image}
            onClick={() => setActiveIndex(index)}
            type="button"
          />
        ))}
      </div>
    </div>
  );
};

export default memo(Slider);
