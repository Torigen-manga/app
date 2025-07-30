import { historyMethods } from "@renderer/hooks/services/history";
import { ErrorPage } from "./error";
import { LoadingPage } from "./loading";

export default function History(): React.JSX.Element {
  const test = historyMethods.MUTATIONS.useClearAllReadEntries();
  const { data, isLoading } = historyMethods.QUERIES.useHistoryEntries();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!data) {
    return <ErrorPage code={500} message="Failed to load history entries" />;
  }

  async function handleTest() {
    await test.mutateAsync();
  }

  return (
    <main className="">
      History Page
      <button onClick={handleTest} type="button">
        test
      </button>
      {data.map((entry) => (
        <div key={`${entry.log.chapterId}__${entry.log.readAt}`}>
          <img alt={entry.data?.title} src={entry.data?.cover} />

          {entry.data?.title}
        </div>
      ))}
    </main>
  );
}
