import type React from "react";

interface VerticalReaderProps {
  pages: string[];
  imageRefs: React.RefObject<(HTMLImageElement | null)[]>;
  loadingStates: boolean[];
  onImageLoad: (index: number) => void;
  className?: string;
}

export function VerticalReader({
  pages,
  imageRefs,
  loadingStates,
  onImageLoad,
  className = "",
}: VerticalReaderProps): React.JSX.Element {
  return (
    <div className={`flex flex-col gap-0 ${className}`}>
      {pages.map((src, index) => (
        // biome-ignore lint/nursery/noNoninteractiveElementInteractions: for now
        <img
          alt={`Page ${index + 1}`}
          className={`m-0 block max-w-full select-none transition-opacity duration-200 ${
            loadingStates[index] ? "opacity-100" : "opacity-50"
          }`}
          key={src}
          onError={() => onImageLoad(index)}
          onLoad={() => onImageLoad(index)}
          ref={(el) => {
            if (imageRefs.current) {
              imageRefs.current[index] = el;
            }
          }}
          src={src}
        />
      ))}
    </div>
  );
}
