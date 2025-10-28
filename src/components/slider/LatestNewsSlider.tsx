import * as React from "react";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Mousewheel } from "swiper/modules";
import "swiper/css";
import type { LatestNewsSliderProps } from "@/types";

export default function LatestNewsSlider({ news }: LatestNewsSliderProps) {
  const [spaceBetween, setSpaceBetween] = useState(32);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth < 640) {
        setSpaceBetween(8);
      } else if (windowWidth >= 640 && windowWidth < 1024) {
        setSpaceBetween(16);
      } else {
        setSpaceBetween(32);
      }
    };

    handleResize(); // 获取初始值

    window.addEventListener("resize", handleResize); // 添加窗口大小改变的监听器

    return () => {
      window.removeEventListener("resize", handleResize); // 移除监听器
    };
  }, []);

  return (
    <Swiper
      spaceBetween={spaceBetween}
      slidesPerView="auto"
      centeredSlides
      mousewheel
      modules={[Keyboard, Mousewheel]}
      keyboard={{
        enabled: true,
      }}
    >
      {news.map((item) => (
        <SwiperSlide key={item.slug}>
          <a
            href={`/collection/detail/${item.slug}`}
            className="relative bg-gray-50 h-[240px] sm:h-[360px] md:h-[544px] flex flex-col justify-end p-4 md:p-10"
          >
            {item.cover && (
              <>
                <picture className="absolute inset-0">
                  <source srcSet={`${item.cover}?w=1280&f=avif`} type="image/avif" />
                  <source srcSet={`${item.cover}?w=1280&f=webp`} type="image/webp" />
                  <img
                    src={`${item.cover}?w=1280`}
                    alt={item.title}
                    className="absolute inset-0 object-cover h-full w-full"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-700 to-transparent" />
              </>
            )}
            <h3
              className={`${
                item.cover ? "text-white" : "text-neutral-900"
              } relative font-serif font-bold text-2xl md:text-6xl`}
            >
              {item.title}
            </h3>
            <p
              className={`${
                item.cover ? "text-white" : "text-neutral-900"
              } relative font-serif font-semibold text-base md:text-2xl`}
            >
              {item.subtitle}
            </p>
          </a>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
