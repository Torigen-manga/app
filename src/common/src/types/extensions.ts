import type { SourceCapabilities } from "@torigen/mounter";

interface RegistryEntry {
	name: string;
	path: string;
	capabilities: SourceCapabilities;
	dependencies?: string[];
}

type Registry = Record<string, RegistryEntry>;

export type { RegistryEntry, Registry };
