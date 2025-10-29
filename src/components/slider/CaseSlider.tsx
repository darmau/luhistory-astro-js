import * as React from "react";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Mousewheel } from "swiper/modules";
import "swiper/css";
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
      {cases.map((item) => {
        const coverImage = item.coverImage;

        return (
          <SwiperSlide key={item.slug}>
            <a href={`/on-artists/detail/${item.slug}`}>
              {coverImage ? (
                <picture className="block">
                  {coverImage.sources.map((source, index) => (
                    <source
                      key={`${source.type}-${index}`}
                      type={source.type}
                      srcSet={source.srcSet}
                      sizes={coverImage.img.sizes}
                    />
                  ))}
                  <img
                    {...coverImage.img}
                    alt={coverImage.img.alt}
                    className="bg-gray-50 object-cover h-[240px] md:h-[352px] w-full mb-2"
                  />
                </picture>
              ) : item.cover ? (
                <picture className="block">
                  <source srcSet={`${item.cover}?h=720&f=avif`} type="image/avif" />
                  <source srcSet={`${item.cover}?h=720&f=webp`} type="image/webp" />
                  <img
                    src={`${item.cover}?h=720`}
                    alt={item.title}
                    className="bg-gray-50 object-cover h-[240px] md:h-[352px] w-full mb-2"
                  />
                </picture>
              ) : null}
            <h3
              title={item.title}
              className="font-serif font-medium text-neutral-900 text-2xl/8 line-clamp-2 mb-2 md:text-3xl/12"
            >
              {item.title}
            </h3>
            </a>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
