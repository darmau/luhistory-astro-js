import * as React from "react";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";

export default function App({images}) {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  const imageUrl = images.map((image) => {
    return {src: image.url, description: image.caption};
  });

  return (
      <div>
        <div className = "flex gap-4">
          {images.map((image, index) => (
              <div
                  className=""
                  onClick = {
                    () => {
                      setIndex(index);
                      setOpen(true);
                    }
                  } key = {image.url}
              >
                <img
                    className = "aspect-[3/4] object-cover w-full cursor-pointer"
                    src = {image.url}
                    alt = {image.caption || 'image'}
                    width = "192"
                    height = "192"
                />
              </div>
          ))}
        </div>

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
