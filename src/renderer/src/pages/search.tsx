import { ParameterComp } from "@renderer/components/search/parameter-area";
import {
  MultiSearchResults,
  SearchResults,
} from "@renderer/components/search/results";
import { SearchCamp } from "@renderer/components/search/search-camp";
import { extensionMethods } from "@renderer/hooks/extensions";
import { useLoadExtensions } from "@renderer/hooks/extensions/registry";
import { cn } from "@renderer/lib/utils";
import type {
  MangaEntry,
  PagedResults,
  SearchRequest,
  Tag,
} from "@torigen/mounter";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function Search(): React.JSX.Element {
  const [source, setSource] = useState<string | null>(null);

  const { data: metadata } = extensionMethods.QUERIES.useMetadata(source);
  const { data: tags } = extensionMethods.QUERIES.useGetTags(source);
  const searchMutation = extensionMethods.MUTATIONS.useSearchRequest(source);
  const multiSearchMutation = extensionMethods.MUTATIONS.useMultiSearch();
  const { data: extensions } = useLoadExtensions();

  const [includedTags, setIncludedTags] = useState<Tag[]>([]);
  const [excludedTags, setExcludedTags] = useState<Tag[]>([]);

  const [result, setResult] = useState<PagedResults<MangaEntry> | undefined>();
  const [multiSearchResult, setMultiSearchResult] = useState<
    Record<string, MangaEntry[]> | undefined
  >();

  const [searchQuery, setSearchQuery] = useState("");

  const [parameters, setParameters] = useState<
    Record<string, string | number | boolean | string[]>
  >({});

  const searchInputRef = useRef<HTMLInputElement>(null);

  function handleParamChange(key: string, value: string | number | boolean) {
    setParameters((prev) => {
      if (prev[key] === value) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [key]: value,
      };
    });
  }

  const searchRequest: SearchRequest = {
    title: searchQuery,
    includedTags,
    excludedTags,
    includeOperator: "AND",
    excludeOperator: "AND",
    parameters,
  };

  async function handleSearch() {
    try {
      if (source) {
        setResult(await searchMutation.mutateAsync(searchRequest));
      } else if (extensions && extensions.length > 0) {
        const sources = extensions
          .filter((ext) => ext.capabilities.supportsSearch)
          .map((ext) => ext.info.id);
        const multiSearchResults = await multiSearchMutation.mutateAsync({
          sources,
          title: searchQuery,
        });
        setMultiSearchResult(multiSearchResults);
      }
    } catch {
      toast.error("Something went wrong while searching", {
        description: "Please try again later.",
      });
    }
  }

  return (
    <motion.main
      className={cn(
        "flex h-full flex-col gap-4 px-4",
        source
          ? "items-start justify-start pt-10"
          : "items-center justify-center"
      )}
      layout
    >
      <SearchCamp
        handleSearch={handleSearch}
        result={result}
        searchInputRef={searchInputRef}
        searchQuery={searchQuery}
        setResult={setResult}
        setSearchQuery={setSearchQuery}
        setSource={setSource}
        source={source}
      />

      <motion.div
        animate={{ opacity: source ? 0 : 1 }}
        className="flex flex-wrap justify-center gap-2"
        initial={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        {!source &&
          extensions
            ?.filter((ext) => ext.capabilities.supportsSearch)
            .map((ext) => (
              <button
                className="rounded-lg border px-3 py-1 text-sm hover:bg-muted"
                key={ext.info.id}
                onClick={() => setSource(ext.info.id)}
                type="button"
              >
                <h2 className="font-semibold">{ext.info.name}</h2>
              </button>
            ))}
      </motion.div>
      {!result && source && metadata?.search && (
        <ParameterComp
          excludedTags={excludedTags}
          includedTags={includedTags}
          onChange={handleParamChange}
          parameters={parameters}
          searchParamsMetadata={metadata.search}
          setExcludedTags={setExcludedTags}
          setIncludedTags={setIncludedTags}
          source={source}
          tags={tags ?? []}
        />
      )}

      {source && result && result.results?.length > 0 && (
        <SearchResults entries={result.results} source={source} />
      )}

      {!source && multiSearchResult && (
        <MultiSearchResults entries={multiSearchResult} />
      )}
    </motion.main>
  );
}
