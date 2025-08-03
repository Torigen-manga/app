import type { PageLayout, ReadingDir } from "@common/index";
import { ReaderMenu } from "@renderer/components/pages/reader";
import { Card } from "@renderer/components/ui/card";
import {
  useChapterNavigation,
  useIntersectionObserver,
  useKeyboardNavigation,
  usePageNavigation,
  usePagePreloading,
  useReadingProgress,
} from "@renderer/hooks/pages/reader";
import { extensionMethods } from "@renderer/hooks/services/extensions";
import { usePreferences } from "@renderer/hooks/services/preferences/use-preferences";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
    goToFirst,
    goToLast,
    goToNext,
    goToPrevious,
  } = usePageNavigation(totalPages, chapterId);

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

  const imageRefs = useIntersectionObserver(data?.pages, setCurrentPage);
  const chapterNumber = currentChapter?.number || 0;

  useReadingProgress(
    manga,
    mangaId,
    source,
    chapterId,
    currentPage,
    chapterNumber,
    !!nextChapter
  );

  useEffect(() => {
    if (data?.pages.length) {
      setTotalPages(data.pages.length);
    }
  }, [data?.pages.length]);

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
    <main className="relative flex h-full w-full justify-center overflow-y-scroll">
      <div className="flex flex-col gap-0">
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

      <Card className="fixed top-10 right-10 z-10 p-2">
        Page {currentPage} of {totalPages}
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
