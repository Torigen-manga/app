import { Button } from "@renderer/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@renderer/components/ui/card";
import { useLoadExtensions } from "@renderer/hooks/extensions/registry";
import { usePreferences } from "@renderer/hooks/preferences/use-preferences";

import { Link } from "@tanstack/react-router";
import { ErrorPage } from "./error";
import { LoadingPage } from "./loading";

export default function Extensions(): React.JSX.Element {
  const { experimentalPreferences } = usePreferences();
  const { data, isLoading, error } = useLoadExtensions();

  const customSourcesAllowed = experimentalPreferences?.enableCustomSources;

  if (!customSourcesAllowed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <h1 className="font-semibold text-primary text-xl">
          Custom Sources Disabled
        </h1>
        <p className="mb-4 text-muted-foreground text-sm">
          Custom sources are disabled in your settings.
        </p>
        <Link to="/settings/experimental">
          <Button className="cursor-pointer" variant="outline">
            Enable Custom Sources
          </Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorPage code={500} message="Failed to load extensions" />;
  }

  if (!data) {
    return <ErrorPage code={404} message="Extensions not found" />;
  }

  const capabilityLabels: Record<string, string> = {
    supportsHomepage: "Supports Homepage",
    supportsSearch: "Supports Search",
    supportsViewMore: "Supports View More",
    supportIncludeTags: "Supports Include Tags",
    supportExcludeTags: "Supports Exclude Tags",
    supportPagination: "Supports Pagination",
  };

  return (
    <main className="p-4">
      <h1 className="ml-4 font-semibold text-3xl">Extensions</h1>
      <div className="grid grid-cols-4 gap-4 p-4">
        {data.map((extension) => (
          <Card key={extension.info.id}>
            <CardHeader>
              <CardTitle>{extension.info.name}</CardTitle>
              <CardDescription>
                <button type="button">{extension.info.id}</button>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ul>
                {Object.entries(extension.capabilities)
                  .filter(([_, value]) => value)
                  .map(([key]) => (
                    <li className="list-disc text-sm" key={key}>
                      {capabilityLabels[key]}
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
