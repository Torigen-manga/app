import { HistoryLogEntry, ReadEntry } from "@renderer/components/pages/history";
import { Button } from "@renderer/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@renderer/components/ui/tabs";
import { historyMethods } from "@renderer/hooks/services/history";
import { useState } from "react";
import { ErrorPage } from "./error";
import { LoadingPage } from "./loading";

type HistoryView = "historyEntries" | "readEntries";

export default function History(): React.JSX.Element {
  const clearAllEntries = historyMethods.MUTATIONS.useClearAllReadEntries();
  const { data: historyEntries, isLoading } =
    historyMethods.QUERIES.useHistoryEntries();
  const { data: readEntries } = historyMethods.QUERIES.useReadEntries();

  const [currentView, setCurrentView] = useState<HistoryView>("readEntries");

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!(historyEntries && readEntries)) {
    return <ErrorPage code={500} message="Failed to load history entries" />;
  }

  async function handleClear() {
    await clearAllEntries.mutateAsync();
  }

  const currentEntries =
    currentView === "historyEntries" ? historyEntries : readEntries;
  const hasEntries = currentEntries && currentEntries.length > 0;

  return (
    <div className="flex h-full flex-col">
      <header className="flex w-full items-center justify-between border-b p-2">
        <div className="inline-flex items-center gap-4">
          <h1 className="font-bold text-2xl">History</h1>
          <Tabs
            onValueChange={(value) => setCurrentView(value as HistoryView)}
            value={currentView}
          >
            <TabsList>
              <TabsTrigger value="historyEntries">History Entries</TabsTrigger>
              <TabsTrigger value="readEntries">Read Entries</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <Button
          disabled={!hasEntries}
          onClick={handleClear}
          variant="destructive"
        >
          Clear All
        </Button>
      </header>
      <div className="flex h-full flex-col gap-y-2 overflow-y-auto p-2">
        {hasEntries ? (
          currentView === "historyEntries" ? (
            historyEntries.map((entry, index) => (
              <HistoryLogEntry
                entry={entry}
                key={`${entry.log.sourceId}_${entry.log.mangaId}_${entry.log.chapterId}_${index}`}
              />
            ))
          ) : (
            readEntries.map((entry) => (
              <ReadEntry
                entry={entry}
                key={`${entry.log.sourceId}_${entry.log.mangaId}`}
              />
            ))
          )
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-lg text-muted-foreground">
              No {currentView.toLowerCase()} found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
