import { MangaCard } from "@renderer/components/cards";
import { extensionMethods } from "@renderer/hooks/extensions";
import { useParams } from "@tanstack/react-router";
import type { MangaEntry } from "@torigen/mounter";
import { useEffect, useRef, useState } from "react";
import { ErrorPage } from "../error";
import { LoadingPage } from "../loading";

export default function ExploreView(): React.JSX.Element {
  const { sourceId, sectionId } = useParams({
    from: "/explore/$sourceId/$sectionId",
  });
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<MangaEntry[]>([]);
  const { data, isLoading, isError } = extensionMethods.QUERIES.useViewMore(
    sourceId,
    sectionId,
    page
  );

  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setResults([]);
    setPage(1);
  }, []);

  useEffect(() => {
    if (data?.results.length) {
      setResults((prev) => [...prev, ...data.results]);
    }
  }, [data]);

  // IntersectionObserver to trigger loading more
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && data?.hasNextPage && !isLoading) {
          setPage((prev) => prev + 1);
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    const current = loaderRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [data?.hasNextPage, isLoading]);

  if (isLoading && !results.length) {
    return <LoadingPage />;
  }

  if (!(sourceId && sectionId)) {
    return (
      <ErrorPage code={400} message="Source ID and Section ID are required" />
    );
  }

  if (isError) {
    return (
      <ErrorPage
        code={500}
        message={`Failed to load view more for source: ${sourceId}, section: ${sectionId}`}
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-2 ">
      <div className="grid grid-cols-8 gap-4 p-4">
        {results.map((result) => (
          <MangaCard
            image={result.image}
            key={result.id}
            mangaId={result.id}
            source={sourceId}
            title={result.title}
          />
        ))}
      </div>
      {isLoading && (
        <div>
          <h1>Loading</h1>
        </div>
      )}
      {data?.hasNextPage && <div className="h-10" ref={loaderRef} />}
    </div>
  );
}
