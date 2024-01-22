import * as React from "react";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";

export default function App({title, images}) {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  const imageUrl = images.map((image) => {
    return { src: image.url, description: image.caption };
  });

  return (
      <div>
        <hgroup
            className = "mb-6 flex justify-between items-baseline max-w-3xl"
        >
          <h2 className = "font-serif font-bold text-neutral-900 text-5xl">{title}</h2>
          <small
              className = "font-sans text-base text-neutral-900 opacity-50"
          >{images.length} photos</small>
        </hgroup>

        <div className = "grid grid-cols-3 gap-8">
          {images.slice(0, 6).map((image, index) => (
              <div onClick={
                () => {
                  setIndex(index);
                  setOpen(true);
                }
              } key = {image.url}>
                <img
                    className = "aspect-square object-cover w-full cursor-pointer"
                    src = {`${image.url}?h=320`}
                    alt = {image.caption || 'image'}
                    width = "192"
                    height = "192"
                />
              </div>
          ))}
        </div>

        <Lightbox
            open = {open}
            plugins={[Captions]}
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
