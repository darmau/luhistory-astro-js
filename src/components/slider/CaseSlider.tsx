import * as React from "react";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Mousewheel } from "swiper/modules";
import "swiper/css";
import SanityPicture from "../media/SanityPicture";
import type { CaseSliderProps } from "@/types";

export default function CaseSlider({ cases }: CaseSliderProps) {
  const [spaceBetween, setSpaceBetween] = useState(32);
  const [slidesPerView, setSlidesPerView] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth < 1024) {
        setSpaceBetween(8);
        setSlidesPerView(1);
      } else {
        setSpaceBetween(32);
        setSlidesPerView(2);
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
      slidesPerView={slidesPerView}
      centeredSlides={false}
      mousewheel
      modules={[Keyboard, Mousewheel]}
      keyboard={{
        enabled: true,
      }}
    >
      {cases.map((item) => (
        <SwiperSlide key={item.slug}>
          <a href={`/on-artists/detail/${item.slug}`}>
            {item.cover && (
              <SanityPicture
                src={item.cover}
                alt={item.title}
                widths={[480, 720, 960, 1280]}
                aspectRatio={4 / 3}
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="block mb-4 md:mb-6"
                imgClassName="bg-gray-50 object-cover h-[240px] md:h-[352px] w-full"
              />
            )}
            <h3
              title={item.title}
              className="font-serif font-bold text-neutral-900 text-2xl line-clamp-2 mb-2 md:mb-4 md:text-3xl"
            >
              {item.title}
            </h3>
          </a>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
