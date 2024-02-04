import * as React from "react";
import {useEffect, useState} from "react";
// Import Swiper React components
import {Swiper, SwiperSlide} from 'swiper/react';

import {Keyboard, Pagination} from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

export default ({exhibitions}) => {
  const [spaceBetween, setSpaceBetween] = useState(32);
  const [itemCount, setItemCount] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth < 1024) {
        setSpaceBetween(8);
        setItemCount(1);
      } else {
        setSpaceBetween(32);
        setItemCount(2);
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
          slidesPerView = {itemCount}
          centeredSlides = {false}
          modules = {[Pagination, Keyboard]}
          keyboard = {{
            enabled: true,
          }}
      >
        {exhibitions.map((item, index) => (
            <SwiperSlide key={index}>
              <a href={`/exhibition/detail/${item.slug}`}
              >
                {item.cover && (
                      <img
                          src = {`${item.cover.url}?h=480`}
                          alt = {item.cover.caption || item.title}
                          className = "bg-gray-50 object-cover h-[240px] md:h-[352px] w-full mb-4 md:mb-6"
                      />
                )}
                <h3
                    title = {item.title}
                    className = "font-serif font-bold text-neutral-900 text-2xl line-clamp-2 mb-2 md:mb-4 md:text-3xl"
                >
                  {item.title}
                </h3>
                <p className = "text-neutral-900 opacity-50">
                  {item.year.split('-')[0]} · {item.city}
                </p>
              </a>
            </SwiperSlide>
        ))}
      </Swiper>
  );
};
