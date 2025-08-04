import {
	type APIResponse,
	channels,
	type Maybe,
	type RegistryEntry,
} from "@common/index";
import { invoke } from "@renderer/lib/ipc-methods";
import { useQuery } from "@tanstack/react-query";
import type { SourceCapabilities, SourceInfo } from "@torigen/mounter";

function useLoadExtensions() {
	return useQuery({
		queryKey: ["extensions", "load"],
		queryFn: async () => {
			const res: APIResponse<
				{ info: SourceInfo; capabilities: SourceCapabilities }[]
			> = await invoke(channels.registry.loadAll);

			if (!res.success) {
				throw new Error(`Failed to load extensions: ${res.error}`);
			}

			return res.data;
		},
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
	});
}

function useGetExtensionEntry(id: Maybe<string>) {
	return useQuery({
		queryKey: ["extensions", id, "entry"],
		queryFn: async () => {
			const res: APIResponse<RegistryEntry> = await invoke(
				channels.registry.getEntry,
				id
			);

			if (!res.success) {
				throw new Error(
					`Failed to get extension entry for ${id}: ${res.error}`
				);
			}

			return res.data;
		},
		enabled: !!id,
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
	});
}

export { useGetExtensionEntry, useLoadExtensions };
