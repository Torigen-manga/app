import type { HistoryEntryWithData } from "@common/index";
import { Button } from "@renderer/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";

export function HistoryLogEntry({ entry }: { entry: HistoryEntryWithData }) {
  const readDate = new Date(entry.log.readAt);

  return (
    <div className="flex h-20 rounded-lg border p-2 transition-colors hover:bg-muted/20">
      <img
        alt={entry.data?.title}
        className="h-full w-12 flex-shrink-0 rounded-md border object-cover"
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
          <Link
            className="w-fit font-semibold text-primary hover:underline"
            to={`/manga/${entry.data?.sourceId}/${entry.data?.mangaId}/chapter/${entry.log.chapterId}`}
          >
            Chapter {entry.log.chapterNumber}
          </Link>
        </div>

        <div className="flex flex-col items-end justify-between text-right">
          <p className="font-mono text-muted-foreground text-xs">
            {entry.log.chapterId}
          </p>
          <div className="text-muted-foreground text-sm">
            <p className="font-medium">{readDate.toLocaleDateString()}</p>
            <p className="text-xs">
              {readDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
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
