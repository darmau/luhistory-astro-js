import * as React from "react";
// Import Swiper React components
import {Swiper, SwiperSlide} from 'swiper/react';

import {Pagination} from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

export default ({news}) => {
  return (
      <Swiper
          spaceBetween = {32}
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
                  className = "relative bg-gray-50 h-[544px] flex flex-col justify-end p-10"
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
                <h3 className = {`${item.cover ? 'text-white' : 'text-neutral-900'} relative font-serif font-bold text-6xl`}>
                  {item.title}
                </h3>
                <p className = {`${item.cover ? 'text-white' : 'text-neutral-900'} relative font-serif font-semibold text-2xl`}>
                  {item.subtitle}
                </p>
              </a>
            </SwiperSlide>
        ))}
      </Swiper>
  );
};
