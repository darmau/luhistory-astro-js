import * as React from "react";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import {Pagination} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react";
import 'swiper/css';
import 'swiper/css/pagination';

export default function App({images}) {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  const imageUrl = images.map((image) => {
    return {src: image.url, description: image.caption};
  });

  return (
      <div>
        <Swiper
            spaceBetween = {32}
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
                          src = {item.url}
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
            plugins = {[Captions]}
            index = {index}
            close = {() => setOpen(false)}
            slides = {imageUrl}
            styles = {{
              container: {background: "white"},
              captionsDescriptionContainer: {background: "white"},
              captionsDescription: {color: "black", textAlign: "center"},
            }}
        />
      </div>
  );
}
