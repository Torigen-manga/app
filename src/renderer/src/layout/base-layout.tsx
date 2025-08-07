import { AppSidebar } from "@renderer/components/nav";
import { SettingsDialog } from "@renderer/components/pages/settings";
import { TitleBar } from "@renderer/components/titlebar";
import { LoadingPage } from "@renderer/pages/loading";
import { useQueryClient } from "@tanstack/react-query";
import { Outlet, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";

class WindowActions {
	private queryClient: ReturnType<typeof useQueryClient>;
	private setIsRefreshing: (loading: boolean) => void;

	constructor(
		queryClient: ReturnType<typeof useQueryClient>,
		setIsRefreshing: (loading: boolean) => void
	) {
		this.queryClient = queryClient;
		this.setIsRefreshing = setIsRefreshing;
	}

	onMinimize = () => {
		window.electron.ipcRenderer.invoke("window:minimize");
	};

	onToggleMaximize = () => {
		window.electron.ipcRenderer.invoke("window:maximize");
	};

	onClose = () => {
		window.electron.ipcRenderer.invoke("window:close");
	};

	onBack = () => {
		window.history.back();
	};

	onForward = () => {
		window.history.forward();
	};

	onRefresh = async () => {
		this.setIsRefreshing(true);

		try {
			await this.queryClient.invalidateQueries();

			await this.queryClient.refetchQueries();
		} finally {
			setTimeout(() => {
				this.setIsRefreshing(false);
			}, 500);
		}
	};
}

export default function BaseLayout(): React.JSX.Element {
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const router = useRouter();
	const queryClient = useQueryClient();

	const windowActions = useMemo(
		() => new WindowActions(queryClient, setIsRefreshing),
		[queryClient]
	);

	const {
		onMinimize,
		onToggleMaximize,
		onClose,
		onBack,
		onForward,
		onRefresh,
	} = windowActions;

	const isLoading = router.state.isLoading || isRefreshing;

	return (
		<div className="[--header-height:calc(--spacing(8))]">
			<SidebarProvider className="flex flex-col">
				<TitleBar
					isRefreshing={isLoading}
					onBack={onBack}
					onClose={onClose}
					onForward={onForward}
					onMinimize={onMinimize}
					onRefresh={onRefresh}
					onToggleMaximize={onToggleMaximize}
				/>

				<SettingsDialog onOpenChange={setSettingsOpen} open={settingsOpen} />
				<div className="flex flex-1">
					<AppSidebar
						onSettingsOpenChange={setSettingsOpen}
						settingsOpen={settingsOpen}
						variant="sidebar"
					/>
					<SidebarInset className="relative h-screen w-full bg-sidebar md:pb-10">
						<main className="relative h-full overflow-hidden border bg-background shadow-2xl shadow-black/40 md:rounded-l-lg">
							{isLoading ? <LoadingPage /> : <Outlet />}
						</main>
					</SidebarInset>
				</div>
			</SidebarProvider>
		</div>
	);
}
