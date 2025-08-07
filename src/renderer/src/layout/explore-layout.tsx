import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
} from "@renderer/components/ui/sidebar";
import { useLoadExtensions } from "@renderer/hooks/services/extensions/registry";
import { ErrorPage } from "@renderer/pages/error";
import { LoadingPage } from "@renderer/pages/loading";
import { Link, Outlet, useLocation } from "@tanstack/react-router";
import type { SourceInfo } from "@torigen/mounter";
import { BookMarked, BookOpenText, House } from "lucide-react";

function ExploreSidebar({ sources }: { sources: SourceInfo[] }) {
	const location = useLocation();

	const links = sources.map((source) => ({
		id: source.id,
		name: source.name,
		path: `/explore/${source.id}`,
	}));

	const isActive = (linkPath: string) => location.pathname === linkPath;

	return (
		<Sidebar className="sticky [&_[data-sidebar=sidebar]]:bg-muted">
			<SidebarHeader>
				<h1 className="font-bold text-2xl">Explore</h1>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
									isActive={isActive("/explore")}
								>
									<Link to="/explore">
										<House />
										<span>Home</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>Extensions</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{links.map((link) => (
								<SidebarMenuItem key={link.id}>
									<SidebarMenuButton
										asChild
										className="mb-1 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
										isActive={isActive(link.path)}
									>
										<Link to={link.path}>
											{location.pathname === link.path ? (
												<BookOpenText />
											) : (
												<BookMarked />
											)}
											<span>{link.name}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
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
		<SidebarProvider className="h-full w-full">
			<div className="flex h-full w-full">
				<ExploreSidebar sources={data.map((ext) => ext.info)} />
				<SidebarInset className="flex-1 overflow-y-auto pb-8">
					<Outlet />
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
}
