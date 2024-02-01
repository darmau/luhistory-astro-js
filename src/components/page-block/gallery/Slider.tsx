import * as React from "react";
import {useEffect, useState} from "react";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import {Pagination} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react";
import 'swiper/css';
import 'swiper/css/pagination';
import Counter from "yet-another-react-lightbox/plugins/counter";
import ArrowLeft from "../../react-icon/ArrowLeft.tsx";
import ArrowRight from "../../react-icon/ArrowRight.tsx";
import Close from "../../react-icon/Close.tsx";

export default function App({images}) {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  const imageUrl = images.map((image) => {
    return {src: image.url, description: image.caption};
  });

  const [spaceBetween, setSpaceBetween] = useState(32);
  const [itemCount, setItemCount] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth < 1024) {
        setSpaceBetween(16);
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
      <div>
        <Swiper
            spaceBetween = {spaceBetween}
            slidesPerView = {'auto'}
            centeredSlides = {false}
            modules = {[Pagination]}
        >
          {images.map((item) => (
              <SwiperSlide>
                {({isActive}) => (
                    <div
                        onClick = {
                          () => {
                            setIndex(index);
                            setOpen(true);
                          }
                        } key = {item.url}
                    >
                      <img
                          src = {`${item.url}?h=640`}
                          alt = {item.caption || 'Gallery Image'}
                          className = {`bg-gray-50 object-cover h-[480px] w-full ${!isActive && 'grayscale'}`}
                      />
                    </div>
                )}
              </SwiperSlide>
          ))}
        </Swiper>

        <Lightbox
            open = {open}
            plugins = {[Captions, Counter]}
            index = {index}
            close = {() => setOpen(false)}
            slides = {imageUrl}
            styles = {{
              container: {
                background: "white",
              },
              root: {
                "--yarl__button_filter": "filter: none",
                "--yarl__counter_color": "black",
                "--yarl__counter_filter": "filter: none",
              },
              captionsDescriptionContainer: {background: "white"},
              captionsDescription: {color: "black", textAlign: "center"},
            }}
            render = {{
              iconPrev: () => <ArrowLeft/>,
              iconNext: () => <ArrowRight/>,
              iconClose: () => <Close/>,
            }}
            counter = {{container: {style: {top: 0}}}}
        />
      </div>
  );
}
