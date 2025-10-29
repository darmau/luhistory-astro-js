import * as React from "react";
import type { GalleryGridProps } from "@/types";

// 懒加载的 Grid 组件
export default function LazyGalleryGrid({ title, images }: GalleryGridProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [GridComponent, setGridComponent] = React.useState<React.ComponentType<GalleryGridProps> | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoaded) {
          setIsVisible(true);
          setIsLoaded(true);
          
          // 动态导入原始 Grid 组件
          import('./Grid.tsx').then((module) => {
            setGridComponent(() => module.default);
          });
        }
      },
      {
        rootMargin: "50px 0px", // 提前50px开始加载
        threshold: 0.1,
      }
    );

    const container = containerRef.current;
    if (container) {
      observer.observe(container);
    }

    return () => {
      if (container) {
        observer.unobserve(container);
      }
    };
  }, [isLoaded]);

  return (
    <div ref={containerRef}>
      {isVisible && GridComponent ? (
        <GridComponent title={title} images={images} />
      ) : (
        <PlaceholderGrid title={title} images={images} />
      )}
    </div>
  );
}

// 占位符组件
function PlaceholderGrid({ title, images }: GalleryGridProps) {
  return (
    <div>
      <hgroup className="md:mb-6 flex justify-between items-baseline max-w-3xl">
        <h2 className="font-serif font-bold text-neutral-900 text-3xl md:text-5xl">
          {title}
        </h2>
        <small className="font-sans text-base text-neutral-900 opacity-50">
          {images.length} photos
        </small>
      </hgroup>

      <div className="grid grid-cols-3 gap-4 lg:gap-8">
        {images.slice(0, 6).map((_, imageIndex) => (
          <div
            key={imageIndex}
            className="aspect-square bg-gray-200 animate-pulse rounded"
          />
        ))}
      </div>
    </div>
  );
}
