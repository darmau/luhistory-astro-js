import * as React from "react";
// Import Swiper React components
import {Swiper, SwiperSlide} from 'swiper/react';

import {Pagination} from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

export default ({exhibitions}) => {
  return (
      <Swiper
          spaceBetween = {32}
          slidesPerView = {2}
          centeredSlides = {false}
          modules = {[Pagination]}
      >
        {exhibitions.map((item) => (
            <SwiperSlide>
              <a href={`/exhibition/detail/${item.slug}`}
              >
                {item.cover && (
                      <img
                          src = {item.cover.url}
                          alt = {item.title}
                          className = "bg-gray-50 object-cover h-[352px] w-full mb-6"
                      />
                )}
                <h3 className = "font-serif font-bold text-neutral-900 text-3xl line-clamp-2 mb-3">
                  {item.title}
                </h3>
                <p className = "text-neutral-900 opacity-50">
                  {`${item.year} · ${item.city}`}
                </p>
              </a>
            </SwiperSlide>
        ))}
      </Swiper>
  );
};
