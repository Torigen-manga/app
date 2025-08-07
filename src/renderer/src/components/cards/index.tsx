import { useLayoutSettings } from "@renderer/hooks/services/preferences/helpers";
import { cn } from "@renderer/lib/utils";
import { mangaDetailRoute } from "@renderer/routes";
import { coverVariant } from "@renderer/style/layout-options";
import { Link } from "@tanstack/react-router";
import React from "react";

interface MangaCardProps {
  title: string;
  image: string;
  source: string;
  mangaId: string;
}

interface LibraryCardProps extends MangaCardProps {
  unreadCount?: number;
}

export function LibraryCard({
  title,
  image,
  unreadCount,
  source,
  mangaId,
}: LibraryCardProps) {
  return (
    <div className="relative">
      <MangaCard
        image={image}
        mangaId={mangaId}
        source={source}
        title={title}
      />
      {unreadCount !== undefined && unreadCount > 0 && (
        <div className="-top-1 -right-1 absolute flex h-6 shrink-0 items-center justify-center rounded-full bg-primary p-1 text-white">
          <p className="text-sm">{unreadCount}</p>
        </div>
      )}
    </div>
  );
}

export function MangaCard({
  title,
  image,
  source,
  mangaId,
}: MangaCardProps): React.JSX.Element {
  const { layoutPreferences } = useLayoutSettings();
  const [imageState, setImageState] = React.useState<
    "loading" | "loaded" | "error"
  >("loading");

  const property = layoutPreferences?.coverStyle;
  const showTitles = layoutPreferences?.showTitles;

  const handleImageError = React.useCallback(() => {
    setImageState("error");
  }, []);

  const handleImageLoad = React.useCallback(() => {
    setImageState("loaded");
  }, []);

  return (
    <div className={cn(coverVariant({ property, showTitles }))}>
      <Link
        aria-label={`Read ${title}`}
        className="group block h-full w-full"
        params={{ source, mangaId }}
        to={mangaDetailRoute.to}
      >
        <div className="relative overflow-hidden rounded-(--card-radius) transition-all">
          {imageState === "loading" && (
            <div className="absolute inset-0 animate-pulse rounded-(--card-radius) bg-muted" />
          )}

          {imageState === "error" ? (
            <div className="flex aspect-[3/4] items-center justify-center rounded-(--card-radius) bg-muted text-muted-foreground text-xs transition-all">
              No Image
            </div>
          ) : (
            // biome-ignore lint/nursery/noNoninteractiveElementInteractions: Image element handles loading and error states for UI feedback
            <img
              alt={title}
              className={cn(
                "aspect-[3/4] h-auto w-full select-none rounded-(--card-radius) object-cover transition-all duration-300 ease-out",
                imageState === "loading" && "opacity-0"
              )}
              decoding="async"
              loading="lazy"
              onError={handleImageError}
              onLoad={handleImageLoad}
              src={image}
            />
          )}

          {!showTitles && (
            <div
              className="absolute right-0 bottom-0 left-0 z-10 translate-y-full rounded-b-(--card-radius) opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus:translate-y-0 group-focus:opacity-100"
              id="overlay-title"
            >
              <div className="rounded-b-(--card-radius) border-t bg-background/90 px-3 py-2 backdrop-blur-sm">
                <h3 className="line-clamp-2 font-medium text-foreground text-sm leading-tight">
                  {title}
                </h3>
              </div>
            </div>
          )}
        </div>

        {showTitles && (
          <div className="mt-2">
            <h3 className="line-clamp-2 font-medium text-foreground text-sm leading-tight">
              {title}
            </h3>
          </div>
        )}
      </Link>
    </div>
  );
}
