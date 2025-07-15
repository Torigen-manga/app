import type { MangaEntry } from "@torigen/mounter";
import { MangaCard } from "../cards";

interface SearchResultProps {
  entries: MangaEntry[];
  source: string;
}
function SearchResults({ entries, source }: SearchResultProps) {
  return (
    <div className="grid h-full grid-cols-6 gap-4 overflow-y-auto p-4">
      {entries.map((item) => (
        <MangaCard
          image={item.image}
          key={item.id}
          mangaId={item.id}
          source={source}
          title={item.title}
        />
      ))}
    </div>
  );
}

export { SearchResults };
