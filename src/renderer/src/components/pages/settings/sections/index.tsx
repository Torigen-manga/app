import type { SettingsRoutes } from "../custom-hook";
import { Experimental } from "./experimental";
import { Layout } from "./layout";
import { Library } from "./library";
import { Reader } from "./reader";
import { System } from "./system";

interface SettingsRenderProps {
  currentRoute: SettingsRoutes;
}

export function SettingsRender({ currentRoute }: SettingsRenderProps) {
  switch (currentRoute) {
    case "Layout and Appearance":
      return <Layout />;

    case "Reader Preferences":
      return <Reader />;

    case "Library and History":
      return <Library />;

    case "System and Behavior":
      return <System />;

    case "Experimental Features":
      return <Experimental />;

    default:
      return <p>error</p>;
  }
}
