import { Card } from "@renderer/components/ui/card";
import { extensionMethods } from "@renderer/hooks/extensions";
import { useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Reader(): React.JSX.Element {
  const { source, mangaId, chapterId } = useParams({
    from: "/manga/$source/$mangaId/chapter/$chapterId",
  });

  const { data } = extensionMethods.useChapterDetails(
    source,
    mangaId,
    chapterId
  );

  const [currentPage, setCurrentPage] = useState(1);
  const mainRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const currentVisibleIndexRef = useRef<number | null>(null);

  const findBestEntry = useCallback((entries) => {
    let bestIndex = -1;
    let bestRatio = 0;

    for (const entry of entries) {
      // biome-ignore lint/nursery/useIndexOf: This is intentional
      const index = imageRefs.current.findIndex((img) => img === entry.target);
      const ratio = entry.intersectionRatio;

      if (entry.isIntersecting && ratio > bestRatio) {
        bestRatio = ratio;
        bestIndex = index;
      }
    }

    return { bestIndex, bestRatio };
  }, []);

  const checkAndSetCurrentPage = useCallback(
    (bestIndex, bestRatio, entries) => {
      if (bestIndex === -1) {
        return;
      }

      const current = currentVisibleIndexRef.current;

      const isNewEntry = bestIndex !== current && bestRatio > 0.1;
      const hasSignificantRatioChange =
        bestRatio -
          (entries.find(
            (entry) =>
              // biome-ignore lint/nursery/useIndexOf: This is intentional
              imageRefs.current.findIndex((img) => img === entry.target) ===
              current
          )?.intersectionRatio ?? 0) >
        0.1;

      if (isNewEntry && hasSignificantRatioChange) {
        currentVisibleIndexRef.current = bestIndex;
        setCurrentPage(bestIndex + 1);
      }
    },
    []
  );

  useEffect(() => {
    if (!data?.pages?.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const { bestIndex, bestRatio } = findBestEntry(entries);
        checkAndSetCurrentPage(bestIndex, bestRatio, entries);
      },
      {
        root: null,
        threshold: [0, 0.5, 1.0],
        rootMargin: "0px",
      }
    );

    const timer = setTimeout(() => {
      for (const img of imageRefs.current) {
        if (img) {
          observer.observe(img);
        }
      }
    }, 500);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
      currentVisibleIndexRef.current = null;
    };
  }, [data?.pages?.length, checkAndSetCurrentPage, findBestEntry]);

  return (
    <main className="relative flex h-full w-full justify-center overflow-y-scroll">
      <Card className="fixed top-10 right-10 z-10 p-2">
        Page {currentPage} of {data?.pages?.length || 0}
      </Card>
      <div className="flex max-w-3xl flex-col " ref={mainRef}>
        {data?.pages?.map((page, index) => (
          <img
            alt={`Page ${index + 1}`}
            key={page}
            ref={(el) => {
              imageRefs.current[index] = el;
            }}
            src={page}
          />
        ))}
      </div>
    </main>
  );
}
