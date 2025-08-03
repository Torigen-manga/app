import type { ReadEntryWithData } from "@common/index";
import { Button } from "@renderer/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";

export function ReadEntry({ entry }: { entry: ReadEntryWithData }) {
  const lastReadDate = new Date(entry.log.lastReadAt);

  return (
    <div className="flex h-24 rounded-lg border p-2 transition-colors hover:bg-muted/20">
      <img
        alt={entry.data?.title}
        className="h-full w-16 flex-shrink-0 rounded-md border object-cover"
        src={entry.data?.cover}
      />

      <div className="flex w-full min-w-0 justify-between px-3">
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <Link
            className="w-fit cursor-pointer truncate font-semibold text-lg hover:underline"
            to={`/manga/${entry.data?.sourceId}/${entry.data?.mangaId}`}
          >
            {entry.data?.title}
          </Link>

          <div className="space-y-1">
            {entry.data?.genres && entry.data.genres.length > 0 && (
              <div className="flex items-center gap-1">
                <span className="font-medium text-muted-foreground text-xs">
                  GENRES:
                </span>
                <span className="text-muted-foreground text-sm">
                  {entry.data.genres.slice(0, 3).join(", ")}
                  {entry.data.genres.length > 3 &&
                    ` +${entry.data.genres.length - 3} more`}
                </span>
              </div>
            )}

            <div className="flex items-center gap-4 text-muted-foreground text-sm">
              {entry.data?.authors && entry.data.authors.length > 0 && (
                <span>By {entry.data.authors.join(", ")}</span>
              )}
              {entry.data?.artists && entry.data.artists.length > 0 && (
                <span>Art by {entry.data.artists.join(", ")}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end justify-center space-y-2 text-right">
          <div className="rounded-full bg-primary/10 px-2 py-1">
            <p className="text-sm">
              Chapters read:{" "}
              <span className="font-bold">
                {entry.log.readChaptersIds?.length || 0}
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-xs">Last read</p>
            <p className="font-medium text-sm">
              {lastReadDate.toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
      <div className="ml-2 flex h-full items-center justify-center border-l pl-2">
        <Button
          className="h-8 w-8"
          onClick={() => {
            // Dropdown Menu
          }}
          size="icon"
          variant="ghost"
        >
          <Menu size={16} />
        </Button>
      </div>
    </div>
  );
}
