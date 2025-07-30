import type { AppManga } from "@common/index";
import { ChapterTable } from "@renderer/components/chapter-table";
import {
  MangaAddToLibrary,
  MangaRemoveFromLibrary,
} from "@renderer/components/manga-details";
import { Badge } from "@renderer/components/ui/badge";
import { Button } from "@renderer/components/ui/button";
import { useChapterSorting } from "@renderer/hooks/pages/manga-details/use-chapter-sorting";
import { useDescriptionOverflow } from "@renderer/hooks/pages/manga-details/use-description-overflow";
import { useMangaLibraryStatus } from "@renderer/hooks/pages/manga-details/use-manga-library-status";
import { extensionMethods } from "@renderer/hooks/services/extensions";
import { cn } from "@renderer/lib/utils";
import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ErrorPage } from "./error";
import { LoadingPage } from "./loading";

interface CategoryHandlerProps {
  isInLibrary: boolean | undefined;
  manga: AppManga;
}

function CategoryHandler({ isInLibrary, manga }: CategoryHandlerProps) {
  if (!isInLibrary) {
    return (
      <MangaAddToLibrary manga={manga}>
        <Button className="cursor-pointer" variant="outline">
          Add to Library
        </Button>
      </MangaAddToLibrary>
    );
  }

  return (
    <MangaRemoveFromLibrary
      mangaId={manga.mangaId}
      sourceId={manga.sourceId}
      title={manga.title}
    >
      <Button className="cursor-pointer" variant="outline">
        Remove from Library
      </Button>
    </MangaRemoveFromLibrary>
  );
}

interface DetailCampProps {
  title: string;
  textContent?: string;
  children?: React.ReactNode;
  className?: string;
}

function DetailCamp({
  title,
  textContent,
  children,
  className,
}: DetailCampProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <h2 className="font-bold text-primary">{title}</h2>
      {textContent && <p className="text-sm">{textContent}</p>}
      {children}
    </div>
  );
}

export default function MangaDetail(): React.JSX.Element {
  const { mangaId, source } = useParams({ from: "/manga/$source/$mangaId" });
  const [expanded, setExpanded] = useState(false);

  const { data: manga, isLoading } = extensionMethods.QUERIES.useMangaDetails(
    source,
    mangaId
  );
  const { data: chapters, isLoading: chaptersLoading } =
    extensionMethods.QUERIES.useMangaChapters(source, mangaId);

  const { isInLibrary, appManga } = useMangaLibraryStatus(
    source,
    mangaId,
    manga
  );

  const { isOverflow, descRef } = useDescriptionOverflow();
  const chapterSorted = useChapterSorting(chapters);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!(mangaId && source)) {
    return <ErrorPage code={400} />;
  }

  if (!(manga || isLoading)) {
    return <ErrorPage code={404} message="Manga not found" />;
  }

  if (!manga) {
    return <ErrorPage code={500} message="Failed to load manga details" />;
  }

  return (
    <main className="flex h-full w-full flex-col items-center overflow-y-auto p-4">
      <div className="flex w-full flex-col gap-2 sm:max-w-2xl md:max-w-4xl md:flex-row">
        <div className="aspect-2/3 max-h-88 w-fit">
          <img
            alt={manga.title}
            className="size-full rounded-lg border shadow-xl"
            src={manga.image}
          />
        </div>
        <div className="max-w-2xl">
          <div className="flex w-full items-start justify-between">
            <h1 className="font-bold text-2xl">{manga.title}</h1>
            <CategoryHandler isInLibrary={isInLibrary} manga={appManga} />
          </div>
          <div className="flex flex-col space-y-2">
            <DetailCamp title="Genres">
              <div className="flex flex-wrap">
                {manga.tags.map((tag) => (
                  <Badge className="mr-1 mb-1" key={tag.id} variant="outline">
                    {tag.label}
                  </Badge>
                ))}
              </div>
            </DetailCamp>

            {manga.artists.length > 0 && (
              <DetailCamp
                textContent={manga.artists.join(", ")}
                title="Artists"
              />
            )}
            {manga.authors.length > 0 && (
              <DetailCamp
                textContent={manga.authors.join(", ")}
                title="Authors"
              />
            )}
            <div>
              <div
                className={cn(
                  "flex items-center",
                  isOverflow ? "justify-between" : "justify-start"
                )}
              >
                <h3 className="font-bold text-lg text-primary">Description</h3>
                {isOverflow && (
                  <Button
                    className="h-6 w-18 rounded-full"
                    onClick={() => setExpanded(!expanded)}
                    variant="link"
                  >
                    {expanded ? "Collapse" : "Expand"}
                  </Button>
                )}
              </div>
              <p className={cn(expanded ? "" : "line-clamp-3")} ref={descRef}>
                {manga.description}
              </p>
            </div>
          </div>
        </div>
      </div>
      <ChapterTable data={chapterSorted ?? []} isLoading={chaptersLoading} />
    </main>
  );
}
