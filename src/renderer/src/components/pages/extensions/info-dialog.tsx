import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@renderer/components/ui/dialog";
import { Separator } from "@renderer/components/ui/separator";
import { useGetExtensionEntry } from "@renderer/hooks/services/extensions/registry";
import type { ExtReturnProps } from "@renderer/types/util";
import {
  CheckCircle,
  Globe,
  Info,
  Package,
  Settings2,
  Tag,
  XCircle,
} from "lucide-react";

interface ExtensionDialogProps {
  extension: ExtReturnProps | undefined;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const capabilityLabels: Record<string, string> = {
  supportsHomepage: "Homepage",
  supportsSearch: "Advanced Search",
  supportsViewMore: "View More",
  supportIncludeTags: "Include Tags",
  supportExcludeTags: "Exclude Tags",
  supportPagination: "Pagination",
  maxConcurrentRequests: "Max Concurrent Requests",
};

const capabilityIcons: Record<string, React.JSX.Element> = {
  supportsHomepage: <Globe className="h-4 w-4" />,
  supportsSearch: <Package className="h-4 w-4" />,
  supportsViewMore: <Info className="h-4 w-4" />,
  supportIncludeTags: <Tag className="h-4 w-4" />,
  supportExcludeTags: <Tag className="h-4 w-4" />,
  supportPagination: <Package className="h-4 w-4" />,
  maxConcurrentRequests: <Settings2 className="h-4 w-4" />,
};

interface RegistryEntryData {
  name?: string;
  path?: string;
  dependencies?: string[];
}

function ExtensionInfo({
  info,
  registryEntry,
  capabilities,
}: {
  info: ExtReturnProps["info"];
  registryEntry: RegistryEntryData | undefined;
  capabilities: ExtReturnProps["capabilities"];
}) {
  return (
    <div>
      <h3 className="mb-2 flex items-center gap-2 font-semibold text-sm">
        <Info className="h-4 w-4" />
        Extension Information
      </h3>
      <div className="space-y-2 text-sm">
        {info.baseUrl && (
          <div>
            <span className="font-medium">Base URL:</span>{" "}
            <a
              className="text-primary hover:underline"
              href={info.baseUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              {info.baseUrl}
            </a>
          </div>
        )}
        {info.locale && (
          <div>
            <span className="font-medium">Locale:</span> {info.locale}
          </div>
        )}
        {info.iconUrl && (
          <div className="flex items-center gap-2">
            <span className="font-medium">Icon:</span>
            <img
              alt={`${info.name} icon`}
              className="h-6 w-6 rounded"
              src={info.iconUrl}
            />
            <span className="text-muted-foreground text-xs">
              {info.iconUrl}
            </span>
          </div>
        )}
        {capabilities?.maxConcurrentRequests && (
          <div>
            <span className="font-medium">Max Concurrent Requests:</span>{" "}
            {capabilities.maxConcurrentRequests}
          </div>
        )}
        {registryEntry?.path && (
          <div>
            <span className="font-medium">Path:</span> {registryEntry.path}
          </div>
        )}
        {registryEntry?.name && registryEntry.name !== info.name && (
          <div>
            <span className="font-medium">Registry Name:</span>{" "}
            {registryEntry.name}
          </div>
        )}
      </div>
    </div>
  );
}

function CapabilitiesSection({
  capabilities,
}: {
  capabilities: ExtReturnProps["capabilities"];
}) {
  return (
    <div>
      <h3 className="mb-3 flex items-center gap-2 font-semibold text-sm">
        <CheckCircle className="h-4 w-4" />
        Supported Features
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(capabilities || {}).map(([key, value]) => (
          <div className="flex items-center gap-2" key={key}>
            {value ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span className="flex items-center gap-1 text-sm">
              {capabilityIcons[key]}
              {capabilityLabels[key] || key}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DependenciesSection({
  info,
  registryEntry,
}: {
  info: ExtReturnProps["info"];
  registryEntry: RegistryEntryData | undefined;
}) {
  const hasSourceDeps = (info.dependencies?.length ?? 0) > 0;
  const hasRegistryDeps = (registryEntry?.dependencies?.length ?? 0) > 0;

  if (!(hasSourceDeps || hasRegistryDeps)) {
    return null;
  }

  return (
    <>
      <Separator />
      <div>
        <h3 className="mb-2 flex items-center gap-2 font-semibold text-sm">
          <Package className="h-4 w-4" />
          Dependencies
        </h3>
        <div className="space-y-2">
          {hasSourceDeps && (
            <div>
              <h4 className="mb-1 font-medium text-muted-foreground text-xs">
                Source Dependencies:
              </h4>
              <div className="space-y-1">
                {info.dependencies?.map((dep) => (
                  <div
                    className="rounded bg-muted px-2 py-1 font-mono text-sm"
                    key={dep.name}
                  >
                    {dep.name}
                    {dep.version && ` v${dep.version}`}
                  </div>
                ))}
              </div>
            </div>
          )}
          {hasRegistryDeps && (
            <div>
              <h4 className="mb-1 font-medium text-muted-foreground text-xs">
                Registry Dependencies:
              </h4>
              <div className="space-y-1">
                {registryEntry?.dependencies?.map((dep: string) => (
                  <div
                    className="rounded bg-muted px-2 py-1 font-mono text-sm"
                    key={dep}
                  >
                    {dep}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export function ExtensionDialog({
  extension,
  isOpen,
  onOpenChange,
}: ExtensionDialogProps) {
  const extensionId = extension?.info.id;

  const { data: registryEntry } = useGetExtensionEntry(extensionId);

  if (!extension) {
    return null;
  }
  const info = extension.info;
  const capabilities = extension.capabilities;

  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {info.name}
          </DialogTitle>
          <DialogDescription className="space-y-1">
            <span className="font-medium">ID:</span> {info.id}
            {info.version && (
              <>
                <br />
                <span className="font-medium">Version:</span> {info.version}
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <ExtensionInfo
            capabilities={capabilities}
            info={info}
            registryEntry={registryEntry}
          />

          <Separator />

          <CapabilitiesSection capabilities={capabilities} />

          <DependenciesSection info={info} registryEntry={registryEntry} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
