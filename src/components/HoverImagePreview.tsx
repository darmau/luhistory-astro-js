import React, {useEffect, useState} from 'react';

const HoverImagePreview = ({ type, slug, title, location, imgUrl }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // 获取图片尺寸
    const image = new Image();
    image.src = imgUrl;
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
  }, [imgUrl]);

  const handleMouseMove = (event) => {
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
  const shouldDisplayAbove = () => {
    if (window.innerHeight - cursorPos.y < imageSize.height) {
      return true; // 鼠标下方空间不足，显示在上方
    }
    return false; // 默认显示在下方
  };

  const imageStyle = {
    position: 'fixed',
    left: `${cursorPos.x + 16}px`,
    top: shouldDisplayAbove() ? `${cursorPos.y - imageSize.height}px` : `${cursorPos.y}px`,
    width: `${imageSize.width}px`,
    height: `${imageSize.height}px`,
    pointerEvents: 'none' as const, // 使用 'none' 字面量类型
    display: isHovering ? 'block' : 'none',
    transition: 'opacity 0.3s ease-in-out',
    zIndex: 9999,
  };

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
        {isHovering && <img src={imgUrl} alt={title} style={imageStyle} />}
      </li>
  );
};

export default HoverImagePreview;
