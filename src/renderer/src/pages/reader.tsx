import type { PageLayout, ReadingDir } from "@common/index";
import { ReaderMenu } from "@renderer/components/pages/reader";
import { VerticalReader } from "@renderer/components/pages/reader/vertical-reader";
import { Card } from "@renderer/components/ui/card";
import {
  useChapterNavigation,
  useKeyboardNavigation,
  usePageNavigation,
  usePagePreloading,
  useReadingProgress,
} from "@renderer/hooks/pages/reader";
import { useVerticalNavigation } from "@renderer/hooks/pages/reader/vertical/use-vertical-navigation";
import { useVerticalReading } from "@renderer/hooks/pages/reader/vertical/use-vertical-reading";
import { isVerticalLayout } from "@renderer/hooks/pages/reader/vertical/utilities";
import { extensionMethods } from "@renderer/hooks/services/extensions";
import { usePreferences } from "@renderer/hooks/services/preferences/use-preferences";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { LoadingPage } from "./loading";

export default function Reader(): React.JSX.Element {
  const navigate = useNavigate();

  const { source, mangaId, chapterId } = useParams({
    from: "/manga/$source/$mangaId/chapter/$chapterId",
  });

  const { readerDisplayPreferences, updateReaderPreferences } =
    usePreferences();

  const { data } = extensionMethods.QUERIES.useChapterDetails(
    source,
    mangaId,
    chapterId
  );
  const { data: manga } = extensionMethods.QUERIES.useMangaDetails(
    source,
    mangaId
  );
  const { data: chapters } = extensionMethods.QUERIES.useMangaChapters(
    source,
    mangaId
  );

  const [totalPages, setTotalPages] = useState<number>(data?.pages.length || 0);
  const isVertical = isVerticalLayout(readerDisplayPreferences?.pageLayout);

  const {
    nextChapter,
    previousChapter,
    currentChapter,
    handleNextChapter,
    handlePreviousChapter,
  } = useChapterNavigation(source, mangaId, chapters, chapterId);

  const {
    currentPage,
    setCurrentPage,
    goToFirst: originalGoToFirst,
    goToLast: originalGoToLast,
    goToNext: originalGoToNext,
    goToPrevious: originalGoToPrevious,
  } = usePageNavigation(totalPages, chapterId);

  const {
    imageRefs,
    loadingStates,
    handleImageLoad,
    isInitialized,
    isManualScrolling,
    markProgrammaticScrollStart,
  } = useVerticalReading(isVertical ? data?.pages : undefined, setCurrentPage, {
    debounceMs: 100,
    threshold: 0.4,
  });

  const {
    containerRef,
    goToFirst: verticalGoToFirst,
    goToLast: verticalGoToLast,
    goToNext: verticalGoToNext,
    goToPrevious: verticalGoToPrevious,
    scrollToPage,
  } = useVerticalNavigation(imageRefs, {
    currentPage,
    totalPages,
    isManualScrolling,
    markProgrammaticScrollStart,
  });

  const goToFirst = useCallback(() => {
    if (isVertical) {
      verticalGoToFirst();
    } else {
      originalGoToFirst();
    }
  }, [isVertical, verticalGoToFirst, originalGoToFirst]);

  const goToLast = useCallback(() => {
    if (isVertical) {
      verticalGoToLast();
    } else {
      originalGoToLast();
    }
  }, [isVertical, verticalGoToLast, originalGoToLast]);

  const goToNext = useCallback(() => {
    if (isVertical) {
      verticalGoToNext();
    } else {
      originalGoToNext();
    }
  }, [isVertical, verticalGoToNext, originalGoToNext]);

  const goToPrevious = useCallback(() => {
    if (isVertical) {
      verticalGoToPrevious();
    } else {
      originalGoToPrevious();
    }
  }, [isVertical, verticalGoToPrevious, originalGoToPrevious]);

  useKeyboardNavigation({
    pageLayout: readerDisplayPreferences?.pageLayout,
    readingDirection: readerDisplayPreferences?.readingDirection,
    currentPage,
    totalPages,
    onPrevious: goToPrevious,
    onNext: goToNext,
    onPreviousChapter: handlePreviousChapter,
    onNextChapter: handleNextChapter,
    hasNextChapter: !!nextChapter,
    hasPreviousChapter: !!previousChapter,
  });

  usePagePreloading(data?.pages, currentPage);

  const chapterNumber = currentChapter?.number || 0;

  useReadingProgress(
    manga,
    mangaId,
    source,
    chapterId,
    currentPage,
    totalPages,
    chapterNumber
  );

  useEffect(() => {
    if (data?.pages.length) {
      setTotalPages(data.pages.length);
    }
  }, [data?.pages.length]);

  useEffect(() => {
    if (isVertical && isInitialized && scrollToPage) {
      const timeoutId = setTimeout(() => {
        scrollToPage(currentPage);
      }, 100);

      return () => clearTimeout(timeoutId);
    }

    return;
  }, [isVertical, currentPage, isInitialized, scrollToPage]);

  if (!(data && readerDisplayPreferences)) {
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

  function navigateToManga() {
    navigate({ to: `/manga/${source}/${mangaId}` });
  }

  return (
    <main
      className="relative flex h-full w-full justify-center overflow-y-scroll"
      data-scroll-container
      ref={containerRef}
    >
      {isVertical ? (
        <div className="h-full w-full max-w-3xl">
          <VerticalReader
            imageRefs={imageRefs}
            loadingStates={loadingStates}
            onImageLoad={handleImageLoad}
            pages={data.pages}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-0">
          <img
            alt={`Page ${currentPage}`}
            className="h-full"
            key={currentPage}
            src={data.pages[currentPage - 1]}
          />
        </div>
      )}

      <Card className="fixed top-10 right-10 z-10 p-2">
        <div className="flex flex-col items-center text-sm">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          {isVertical && !isInitialized && (
            <span className="mt-1 text-gray-500 text-xs">Initializing...</span>
          )}
        </div>
      </Card>

      <ReaderMenu
        navigateToManga={navigateToManga}
        onFirst={goToFirst}
        onLast={goToLast}
        onNext={goToNext}
        onNextChapter={handleNextChapter}
        onPageLayoutChange={handlePageLayoutChange}
        onPrevious={goToPrevious}
        onPreviousChapter={handlePreviousChapter}
        onReadingDirectionChange={handleReadingDirectionChange}
        pageLayout={readerDisplayPreferences.pageLayout}
        readingDirectory={readerDisplayPreferences.readingDirection}
      />
    </main>
  );
}
