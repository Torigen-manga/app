import type { MangaEntry } from "@torigen/mounter";
import { MangaCard } from "../../cards";

interface SearchResultProps {
	entries: MangaEntry[];
	source: string;
}
function SearchResults({ entries, source }: SearchResultProps) {
	return (
		<div className="flex-1 overflow-y-auto">
			<div className="grid grid-cols-6 gap-4 p-4">
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
		</div>
	);
}

interface MultiSearchResultsProps {
	entries: Record<string, MangaEntry[]>;
}

function MultiSearchResults({ entries }: MultiSearchResultsProps) {
	return (
		<div className="flex-1 overflow-y-auto">
			<div className="flex flex-col gap-4 p-4">
				{Object.keys(entries).map((source) => (
					<div key={source}>
						<h2 className="font-bold text-lg">{source}</h2>
						<div className="grid grid-cols-6 gap-4">
							{entries[source]?.slice(0, 6).map((item) => (
								<MangaCard
									image={item.image}
									key={item.id}
									mangaId={item.id}
									source={source}
									title={item.title}
								/>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export { SearchResults, MultiSearchResults };
