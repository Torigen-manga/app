import type React from "react";
import { Sidebar, SidebarContent } from "../ui/sidebar";
import { NavMain } from "./main";
import { NavHeader } from "./nav-header";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar className="border-none" collapsible="icon" {...props}>
			<NavHeader />
			<SidebarContent>
				<NavMain />
			</SidebarContent>
		</Sidebar>
	);
}
