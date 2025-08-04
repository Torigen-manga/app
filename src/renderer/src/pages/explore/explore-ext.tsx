import { MangaCard } from "@renderer/components/cards";
import { Button } from "@renderer/components/ui/button";
import { extensionMethods } from "@renderer/hooks/services/extensions";
import { cn } from "@renderer/lib/utils";
import { exploreExtensionRoute, exploreViewMoreRoute } from "@renderer/routes";
import { Link } from "@tanstack/react-router";
import { ArrowRight, RefreshCcw } from "lucide-react";
import type React from "react";
import { ErrorPage } from "../error";
import { LoadingPage } from "../loading";

export default function ExploreExt(): React.JSX.Element {
  const { sourceId } = exploreExtensionRoute.useParams();

  const {
    data: homepage,
    isLoading,
    isRefetching,
    isError,
    error,
    refetch,
  } = extensionMethods.QUERIES.useHomepage(sourceId);

  if (!sourceId) {
    return <ErrorPage code={400} message="Extension ID is required" />;
  }

  if (!(homepage || isLoading)) {
    return <ErrorPage code={404} message="Homepage not found" />;
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError || error) {
    return <ErrorPage code={500} message="Error loading content" />;
  }

  return (
    <div className="mx-auto max-w-6xl p-2">
      <header className="mt-2 flex w-full items-center rounded-lg border p-2">
        <h1 className="select-none font-bold text-xl">Actions</h1>
        <Button
          className="ml-auto"
          onClick={() => refetch()}
          size="icon"
          variant="ghost"
        >
          <RefreshCcw className={cn({ "animate-spin": isRefetching })} />
        </Button>
      </header>

      {homepage?.map((section) => (
        <section className="mx-auto w-full max-w-7xl pb-4" key={section.id}>
          <div className="flex items-center">
            <h1 className="my-3 font-semibold text-3xl">{section.title}</h1>
            {section.containsMoreItems && (
              <Button asChild className="ml-auto" variant="outline">
                <Link
                  params={{ sourceId, sectionId: section.id }}
                  to={exploreViewMoreRoute.to}
                >
                  View More <ArrowRight />
                </Link>
              </Button>
            )}
          </div>
          <div
            className={cn(
              "grid w-full grid-cols-4 gap-4",
              "md:grid-cols-6 xl:grid-cols-8"
            )}
          >
            {section.items.map((item) => (
              <MangaCard
                image={item.image}
                key={item.id}
                mangaId={item.id}
                source={sourceId}
                title={item.title}
              />
            ))}
          </div>
        </section>
      ))}
      {!homepage && (
        <div className="flex h-full w-full items-center justify-center text-gray-500">
          No content available
        </div>
      )}
    </div>
  );
}
