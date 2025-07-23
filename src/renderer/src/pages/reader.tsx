import type { PageLayout } from "@common/index";
import { Button } from "@renderer/components/ui/button";
import { Card } from "@renderer/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@renderer/components/ui/dropdown-menu";
import { extensionMethods } from "@renderer/hooks/extensions";
import { usePreferences } from "@renderer/hooks/preferences/use-preferences";
import { cn } from "@renderer/lib/utils";
import { useParams } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUp,
  ChevronUp,
  Menu,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LoadingPage } from "./loading";

interface ReaderMenuProps {
  pageLayout: PageLayout;
  onToggle: (value: PageLayout) => void;
  onNext: () => void;
  onPrevious: () => void;
  onFirst: () => void;
  onLast: () => void;
}

function ReaderMenu({
  pageLayout,
  onToggle,
  onNext,
  onPrevious,
  onFirst,
  onLast,
}: ReaderMenuProps) {
  const isVertical = pageLayout === "vertical-scroll";

  return (
    <div
      className={cn(
        "right-5 bottom-5 flex gap-4 rounded-lg border bg-background p-2 shadow-lg",
        isVertical ? "fixed flex-col" : "absolute flex-row"
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="outline">
            <Menu />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuRadioGroup value={pageLayout}>
            <DropdownMenuRadioItem
              onSelect={() => onToggle("single-page")}
              value="single-page"
            >
              Single Page
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              onSelect={() => onToggle("double-page")}
              value="double-page"
            >
              Double Page
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              onSelect={() => onToggle("vertical-scroll")}
              value="vertical-scroll"
            >
              Vertical Scroll
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className={cn("flex gap-2", isVertical && "flex-col")}>
        <Button onClick={onFirst} size="icon" variant="outline">
          {isVertical ? (
            <ChevronsUp className="size-4" />
          ) : (
            <ChevronsLeft className="size-4" />
          )}
        </Button>
        <Button onClick={onPrevious} size="icon" variant="outline">
          {isVertical ? (
            <ChevronUp className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </Button>
      </div>
      <div className={cn("flex gap-2", isVertical && "flex-col")}>
        <Button onClick={onNext} size="icon" variant="outline">
          {isVertical ? (
            <ChevronDown className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          )}
        </Button>
        <Button onClick={onLast} size="icon" variant="outline">
          {isVertical ? (
            <ChevronsDown className="size-4" />
          ) : (
            <ChevronsRight className="size-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

export default function Reader(): React.JSX.Element {
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

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(data?.pages.length || 0);
  const mainRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

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

      const goPrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
      const goNext = () =>
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));

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

  function handleToggle(options: PageLayout) {
    updateReaderPreferences({
      pageLayout: options,
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
              className="m-0 block max-w-full"
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
        onPrevious={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        onToggle={handleToggle}
        pageLayout={readerDisplayPreferences.pageLayout}
      />
    </main>
  );
}
