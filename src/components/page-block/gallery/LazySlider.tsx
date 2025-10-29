import * as React from "react";
import type { GallerySliderProps } from "@/types";

// 懒加载的 Slider 组件
export default function LazyGallerySlider({ images }: GallerySliderProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [SliderComponent, setSliderComponent] = React.useState<React.ComponentType<GallerySliderProps> | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoaded) {
          setIsVisible(true);
          setIsLoaded(true);
          
          // 动态导入原始 Slider 组件
          import('./Slider.tsx').then((module) => {
            setSliderComponent(() => module.default);
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
      {isVisible && SliderComponent ? (
        <SliderComponent images={images} />
      ) : (
        <PlaceholderSlider images={images} />
      )}
    </div>
  );
}

// 占位符组件
function PlaceholderSlider({ images }: GallerySliderProps) {
  return (
    <div>
      <div className="flex gap-4 overflow-hidden">
        {images.slice(0, 3).map((_, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-64 h-96 bg-gray-200 animate-pulse rounded"
          />
        ))}
      </div>
    </div>
  );
}
