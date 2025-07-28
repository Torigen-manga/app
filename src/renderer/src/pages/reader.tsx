import type { PageLayout, ReadingDir } from "@common/index";
import { ReaderMenu } from "@renderer/components/reader/reader-menu";
import { Card } from "@renderer/components/ui/card";
import { extensionMethods } from "@renderer/hooks/extensions";
import { usePreferences } from "@renderer/hooks/preferences/use-preferences";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { LoadingPage } from "./loading";

export default function Reader(): React.JSX.Element {
  const { source, mangaId, chapterId } = useParams({
    from: "/manga/$source/$mangaId/chapter/$chapterId",
  });

  const navigate = useNavigate();

  const { readerDisplayPreferences, updateReaderPreferences } =
    usePreferences();

  const { data } = extensionMethods.QUERIES.useChapterDetails(
    source,
    mangaId,
    chapterId
  );

  const { data: chapters } = extensionMethods.QUERIES.useMangaChapters(
    source,
    mangaId
  );

  const currentChapter = chapters?.find((ch) => ch.id === chapterId);

  const nextChapter = chapters?.find(
    (ch) => ch.number === (currentChapter?.number ?? 0) + 1
  );
  const previousChapter = chapters?.find(
    (ch) => ch.number === (currentChapter?.number ?? 0) - 1
  );

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(data?.pages.length || 0);
  const mainRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  const handlePreviousChapter = useCallback(() => {
    return navigate({
      to: `/manga/${source}/${mangaId}/chapter/${previousChapter?.id}`,
    });
  }, [mangaId, source, previousChapter, navigate]);

  const handleNextChapter = useCallback(() => {
    return navigate({
      to: `/manga/${source}/${mangaId}/chapter/${nextChapter?.id}`,
    });
  }, [mangaId, source, nextChapter, navigate]);

  useEffect(() => {
    if (data?.pages.length) {
      setTotalPages(data.pages.length);
      setCurrentPage(1);
      imageRefs.current = new Array(data.pages.length).fill(null);
    }
  }, [data?.pages.length]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key;
      const isVertical =
        readerDisplayPreferences?.pageLayout === "vertical-scroll";

      const readingDirection =
        readerDisplayPreferences?.readingDirection || "ltr";

      const goPrev = () => {
        if (currentPage === 1 && previousChapter) {
          handlePreviousChapter();
        } else {
          setCurrentPage((prev) => Math.max(prev - 1, 1));
        }
      };

      const goNext = () => {
        if (currentPage === totalPages && nextChapter) {
          handleNextChapter();
        } else {
          setCurrentPage((prev) => Math.min(prev + 1, totalPages));
        }
      };

      const verticalKeys = {
        ArrowUp: goPrev,
        ArrowDown: goNext,
      };

      const horizontalKeys =
        readingDirection === "ltr"
          ? {
              ArrowLeft: goPrev,
              ArrowRight: goNext,
            }
          : {
              ArrowRight: goPrev,
              ArrowLeft: goNext,
            };

      const actions = isVertical ? verticalKeys : horizontalKeys;

      if (key in actions) {
        actions[key]();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    readerDisplayPreferences?.readingDirection,
    readerDisplayPreferences?.pageLayout,
    totalPages,
    currentPage,
    handleNextChapter,
    handlePreviousChapter,
    nextChapter,
    previousChapter,
  ]);

  useEffect(() => {
    if (!data?.pages || currentPage >= data.pages.length) {
      return;
    }

    const nextPageUrl = data.pages[currentPage];
    const preloadImg = new Image();
    preloadImg.src = nextPageUrl;
  }, [currentPage, data?.pages]);

  useEffect(() => {
    if (!data?.pages.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // biome-ignore lint/nursery/useIndexOf: false positive
            const index = imageRefs.current.findIndex(
              (img) => img === entry.target
            );
            if (index !== -1) {
              setCurrentPage(index + 1);
            }
          }
        }
      },
      { threshold: 0.5 }
    );

    const timeout = setTimeout(() => {
      for (const img of imageRefs.current) {
        if (img) {
          observer.observe(img);
        }
      }
    }, 100);

    return () => {
      clearTimeout(timeout);
      for (const img of imageRefs.current) {
        if (img) {
          observer.unobserve(img);
        }
      }
    };
  }, [data?.pages.length]);

  if (!data) {
    return <LoadingPage />;
  }

  if (!readerDisplayPreferences) {
    return <LoadingPage />;
  }

  function handlePageLayoutChange(options: PageLayout) {
    updateReaderPreferences({
      pageLayout: options,
    });
  }

  function handleReadingDirectionChange(options: ReadingDir) {
    updateReaderPreferences({
      readingDirection: options,
    });
  }

  return (
    <main className="relative flex h-full w-full justify-center overflow-y-scroll">
      <Card className="fixed top-10 right-10 z-10 p-2">
        Page {currentPage} of {totalPages}
      </Card>
      <div className="flex max-w-3xl flex-col gap-0" ref={mainRef}>
        {readerDisplayPreferences.pageLayout === "vertical-scroll" ? (
          data.pages.map((src, index) => (
            <img
              alt={`Page ${index + 1}`}
              className="m-0 block max-w-full select-none"
              key={src}
              ref={(el) => {
                imageRefs.current[index] = el;
              }}
              src={src}
            />
          ))
        ) : (
          <img
            alt={`Page ${currentPage}`}
            className="h-full"
            key={currentPage}
            ref={(el) => {
              imageRefs.current[currentPage - 1] = el;
            }}
            src={data.pages[currentPage - 1]}
          />
        )}
      </div>
      <ReaderMenu
        onFirst={() => setCurrentPage(1)}
        onLast={() => setCurrentPage(totalPages)}
        onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        onNextChapter={handleNextChapter}
        onPageLayoutChange={handlePageLayoutChange}
        onPrevious={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        onPreviousChapter={handlePreviousChapter}
        onReadingDirectionChange={handleReadingDirectionChange}
        pageLayout={readerDisplayPreferences.pageLayout}
        readingDirectory={readerDisplayPreferences.readingDirection}
      />
    </main>
  );
}
