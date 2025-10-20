import * as React from "react";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Mousewheel } from "swiper/modules";
import "swiper/css";

type ExhibitionItem = {
  title: string;
  slug: string;
  year: string;
  city: string;
  cover?: {
    url: string;
    caption?: string | null;
  } | null;
};

type ExhibitionSliderProps = {
  exhibitions: ExhibitionItem[];
};

export default function ExhibitionSlider({ exhibitions }: ExhibitionSliderProps) {
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
      {exhibitions.map((item) => (
        <SwiperSlide key={item.slug}>
          <a href={`/exhibition/detail/${item.slug}`}>
            {item.cover && (
              <img
                src={`${item.cover.url}?h=960`}
                alt={item.cover.caption || item.title}
                className="bg-gray-50 object-cover h-[240px] md:h-[352px] w-full mb-4 md:mb-6"
              />
            )}
            <h3
              title={item.title}
              className="font-serif font-bold text-neutral-900 text-2xl line-clamp-2 mb-2 md:mb-4 md:text-3xl"
            >
              {item.title}
            </h3>
            <p className="text-neutral-900 opacity-50">
              {item.year.split("-")[0]} · {item.city}
            </p>
          </a>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
