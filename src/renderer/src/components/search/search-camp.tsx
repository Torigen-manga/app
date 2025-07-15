import { cn } from "@renderer/lib/utils";
import type { MangaEntry, PagedResults } from "@torigen/mounter";
import { ArrowLeft, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface SearchCampProps {
  source: string | null;
  setSource: (source: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  result?: PagedResults<MangaEntry> | undefined;
  setResult: (result: PagedResults<MangaEntry> | undefined) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

function SearchCamp({
  source,
  setSource,
  searchQuery,
  setSearchQuery,
  handleSearch,
  result,
  setResult,
  searchInputRef,
}: SearchCampProps) {
  return (
    <motion.div
      className={cn(
        "flex flex-col gap-2",
        source ? "sticky w-full" : "w-96 items-center"
      )}
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center gap-2">
        {source && (
          <Button onClick={() => setSource(null)} size="icon" variant="outline">
            <ArrowLeft />
          </Button>
        )}
        <motion.h1
          className={cn("font-semibold", source ? "text-4xl" : "text-3xl")}
          transition={{ duration: 1 }}
        >
          Search
        </motion.h1>
      </div>
      <div className="flex gap-2">
        <Input
          className="rounded-lg"
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          placeholder="Search..."
          ref={searchInputRef}
          value={searchQuery}
        />

        {result && (
          <Button
            onClick={() => setResult(undefined)}
            size="icon"
            variant="destructive"
          >
            <Trash2 />
          </Button>
        )}

        <Button onClick={handleSearch}>Search</Button>
      </div>
    </motion.div>
  );
}

export { SearchCamp };
