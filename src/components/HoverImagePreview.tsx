import React, {useEffect, useMemo, useState} from 'react';
import type { HoverImagePreviewProps, ImageSize, CursorPosition } from '@/types';
import SanityPicture from "./media/SanityPicture";

const HoverImagePreview: React.FC<HoverImagePreviewProps> = ({ type, slug, title, location, imgUrl }) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [imageSize, setImageSize] = useState<ImageSize>({ width: 0, height: 0 });
  const [cursorPos, setCursorPos] = useState<CursorPosition>({ x: 0, y: 0 });

  const buildPreviewUrl = React.useCallback(
    () => {
      try {
        const url = new URL(imgUrl);
        url.searchParams.set("w", "800");
        url.searchParams.set("auto", "format");
        return url.toString();
      } catch {
        return imgUrl;
      }
    },
    [imgUrl]
  );

  useEffect(() => {
    // 获取图片尺寸
    const image = new Image();
    image.src = buildPreviewUrl();
    image.onload = () => {
      // 保持300px为最大尺寸
      if (image.width > image.height) {
        setImageSize({
          width: 300,
          height: (300 / image.width) * image.height,
        });
      } else {
        setImageSize({
          width: (300 / image.height) * image.width,
          height: 300,
        });
      }
    };
  }, [buildPreviewUrl]);

  const handleMouseMove = (event: React.MouseEvent<HTMLLIElement>) => {
    setCursorPos({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  // 检查是否有足够空间显示图片
  const shouldDisplayAbove = React.useCallback(
    () => window.innerHeight - cursorPos.y < imageSize.height,
    [cursorPos.y, imageSize.height]
  );

  const imageStyle: React.CSSProperties = useMemo(() => ({
    position: 'fixed',
    left: `${cursorPos.x + 16}px`,
    top: shouldDisplayAbove() ? `${cursorPos.y - imageSize.height}px` : `${cursorPos.y}px`,
    width: `${imageSize.width}px`,
    height: `${imageSize.height}px`,
    pointerEvents: 'none',
    display: isHovering ? 'block' : 'none',
    transition: 'opacity 0.3s ease-in-out',
    zIndex: 9999,
  }), [cursorPos.x, cursorPos.y, imageSize.height, imageSize.width, isHovering, shouldDisplayAbove]);

  return (
      <li
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className = "flex flex-col py-6 gap-2 border-b border-neutral-900 border-opacity-20 sm:border-opacity-100 text-neutral-900 md:grid md:grid-cols-5 md:items-center md:gap-6"
      >
        <a
            title = {title}
            href={`/${type}/detail/${slug}`}
            className = "col-span-4 font-serif font-bold proportional-nums text-2xl sm:text-3xl text-neutral-900 line-clamp-2 hover:underline"
            data-astro-prefetch
        >{title}</a>
        <p
            className = "md:text-end col-span-1 font-sans text-base font-normal text-neutral-900 opacity-50"
        >{location}</p>
        {isHovering && (
          <SanityPicture
            src={imgUrl}
            alt={title}
            widths={[320, 480, 640]}
            quality={70}
            sizes="30vw"
            style={imageStyle}
            imgClassName="w-full h-full object-cover shadow-lg"
            loading="eager"
            decoding="async"
          />
        )}
      </li>
  );
};

export default HoverImagePreview;
