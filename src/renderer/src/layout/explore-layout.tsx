import { Separator } from "@renderer/components/ui/separator";
import { useLoadExtensions } from "@renderer/hooks/services/extensions/registry";
import { cn } from "@renderer/lib/utils";
import { ErrorPage } from "@renderer/pages/error";
import { LoadingPage } from "@renderer/pages/loading";
import { Link, Outlet, useLocation } from "@tanstack/react-router";
import type { SourceInfo } from "@torigen/mounter";
import { BookMarked, BookOpenText, House } from "lucide-react";

function ExploreSidebar({ sources }: { sources: SourceInfo[] }) {
  const location = useLocation();

  const path = location.pathname;

  const links = sources.map((source) => ({
    id: source.id,
    name: source.name,
    path: `/explore/${source.id}`,
  }));

  const isActive = (linkPath: string) => location.pathname === linkPath;

  return (
    <div className="x sticky z-10 h-full w-54 border-r bg-muted p-2 pt-4">
      <div className="inline-flex">
        <h1 className="mb-2 ml-2 font-bold text-2xl">Explore</h1>
      </div>
      <nav className="scrollbar-none flex gap-2 overflow-x-scroll md:flex-col md:overflow-y-auto">
        <Link
          className={cn(
            "flex h-8 items-center gap-3 rounded-md border-transparent border-b-2 px-2 font-medium text-muted-foreground text-sm transition-colors md:border-none [&>svg]:size-4",
            path === "/explore"
              ? "border-primary text-primary md:bg-primary md:text-primary-foreground"
              : "md:hover:bg-primary/40 md:hover:text-primary-foreground"
          )}
          to="/explore"
        >
          <House /> Home
        </Link>
        <Separator />
        {links.map((link) => (
          <Link
            className={cn(
              "flex h-8 items-center gap-3 rounded-md border-transparent border-b-2 px-2 font-medium text-muted-foreground text-sm transition-colors md:border-none [&>svg]:size-4",
              isActive(link.path)
                ? "border-primary text-primary md:bg-primary md:text-primary-foreground"
                : "md:hover:bg-primary/40 md:hover:text-primary-foreground"
            )}
            key={link.id}
            to={link.path}
          >
            {location.pathname === link.path ? (
              <BookOpenText />
            ) : (
              <BookMarked />
            )}
            {link.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default function ExploreLayout(): React.JSX.Element {
  const { data, isLoading, error } = useLoadExtensions();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorPage code={500} message="Failed to load extensions" />;
  }

  if (!data || data.length === 0) {
    return <ErrorPage code={404} message="No extensions found" />;
  }

  return (
    <div className="relative flex h-full rounded-t-lg">
      <ExploreSidebar sources={data.map((ext) => ext.info)} />

      <div className="h-full w-full flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
