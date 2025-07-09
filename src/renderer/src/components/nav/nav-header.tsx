import { SidebarHeader, useSidebar } from "@renderer/components/ui/sidebar";
import { cn } from "@renderer/lib/utils";

function AppTitle({ abbreviated = false }: { abbreviated?: boolean }) {
	return (
		<h1
			className={cn("font-bold transition-all duration-200")}
			title={abbreviated ? "Torigen" : undefined}
		>
			{abbreviated ? "TG" : "Torigen"}
		</h1>
	);
}

export function NavHeader() {
	const { state, isMobile } = useSidebar();

	if (isMobile) {
		return (
			<SidebarHeader className="mb-2 flex h-8 flex-row items-center justify-between px-4">
				<AppTitle />
			</SidebarHeader>
		);
	}

	if (state === "expanded") {
		return (
			<SidebarHeader className="mb-2 flex h-8 flex-row items-center justify-between px-4 py-0 transition-all duration-200">
				<AppTitle />
			</SidebarHeader>
		);
	}

	return (
		<SidebarHeader className="mb-2 flex h-8 flex-col items-center justify-center px-2 py-0 transition-all duration-200">
			<AppTitle abbreviated />
		</SidebarHeader>
	);
}
