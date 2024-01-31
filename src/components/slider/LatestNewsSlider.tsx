import * as React from "react";
import {useEffect, useState} from "react";
// Import Swiper React components
import {Swiper, SwiperSlide} from 'swiper/react';

import {Pagination} from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

export default ({news}) => {
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
          spaceBetween = {spaceBetween}
          slidesPerView = {'auto'}
          centeredSlides = {true}
          modules = {[Pagination]}
          keyboard = {{
            enabled: true,
            onlyInViewport: true,
            pageUpDown: true,
          }}
      >
        {news.map((item, index) => (
            <SwiperSlide>
              <a href={`/archive/detail/${item.slug}`}
                 className = "relative bg-gray-50 h-[240px] sm:h-[360px] md:h-[544px] flex flex-col justify-end p-4 md:p-10"
              >
                {item.cover && (
                    <>
                      <img
                          src = {`${item.cover}?w=1088`}
                          alt = {item.title}
                          className = "absolute inset-0 object-cover h-full w-full"
                      />
                      <div
                          className = "absolute inset-0 bg-gradient-to-t from-neutral-700 to-transparent"
                      ></div>
                    </>
                )}
                <h3 className = {`${item.cover ? 'text-white' : 'text-neutral-900'} relative font-serif font-bold text-2xl md:text-6xl`}>
                  {item.title}
                </h3>
                <p className = {`${item.cover ? 'text-white' : 'text-neutral-900'} relative font-serif font-semibold text-base md:text-2xl`}>
                  {item.subtitle}
                </p>
              </a>
            </SwiperSlide>
        ))}
      </Swiper>
  );
};
