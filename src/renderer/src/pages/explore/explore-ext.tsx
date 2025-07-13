import { MangaCard } from "@renderer/components/cards";
import { Button } from "@renderer/components/ui/button";
import { extensionMethods } from "@renderer/hooks/extensions";
import { useLayout } from "@renderer/hooks/preferences/use-layout";
import { cn } from "@renderer/lib/utils";
import { exploreExtensionRoute, exploreViewMoreRoute } from "@renderer/routes";
import { gridMap } from "@renderer/style/layout-options";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type React from "react";
import { ErrorPage } from "../error";
import { LoadingPage } from "../loading";

export default function ExploreExt(): React.JSX.Element {
  const { sourceId } = exploreExtensionRoute.useParams();
  const { grid, coverStyle } = useLayout();

  const {
    data: homepage,
    isLoading,
    isError,
    error,
  } = extensionMethods.useHomepage(sourceId);

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
    <div className="mx-auto max-w-6xl">
      <div>
        {homepage?.map((section) => (
          <section
            className="mx-auto w-full max-w-7xl p-2 pb-4"
            key={section.id}
          >
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
            <div className={cn("grid w-full gap-4", gridMap(grid))}>
              {section.items.map((item) => (
                <MangaCard
                  image={item.image}
                  key={item.id}
                  mangaId={item.id}
                  property={coverStyle}
                  source={sourceId}
                  title={item.title}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
      {!homepage && (
        <div className="flex h-full w-full items-center justify-center text-gray-500">
          No content available
        </div>
      )}
    </div>
  );
}
