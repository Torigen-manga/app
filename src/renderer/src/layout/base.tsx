import { AppSidebar } from "@renderer/components/nav";
import { TitleBar } from "@renderer/components/titlebar";
import { Outlet } from "react-router";
import { SidebarProvider } from "../components/ui/sidebar";

export default function BaseLayout(): React.JSX.Element {
	return (
		<SidebarProvider className="flex">
			<AppSidebar />

			<div className="relative h-screen w-full overflow-hidden bg-sidebar md:pb-10">
				<TitleBar />
				<main className="relative mt-8 h-full overflow-hidden border bg-background shadow shadow-black/20 md:mr-2 md:rounded-lg">
					<Outlet />
				</main>
			</div>
		</SidebarProvider>
	);
}
