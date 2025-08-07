import type { AppManga, ReadLogReturnal } from "@common/index";
import { Badge } from "@renderer/components/ui/badge";
import { Button } from "@renderer/components/ui/button";
import { Checkbox } from "@renderer/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@renderer/components/ui/dropdown-menu";
import { Label } from "@renderer/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@renderer/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@renderer/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip";
import { historyMethods } from "@renderer/hooks/services/history";
import { cn } from "@renderer/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type Row,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import type { ChapterEntry } from "@torigen/mounter";
import {
  ArrowUp,
  BookCheck,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  Menu,
  MousePointerClick,
} from "lucide-react";
import React from "react";

const createColumns = (
  markAsReadMutation: ReturnType<
    typeof historyMethods.MUTATIONS.useMarkChapterAsRead
  >,
  unmarkAsReadMutation: ReturnType<
    typeof historyMethods.MUTATIONS.useUnmarkChapterAsRead
  >,
  manga: AppManga,
  readLogs?: ReadLogReturnal[]
): ColumnDef<ChapterEntry>[] => {
  const getReadLog = (chapterId: string): ReadLogReturnal | undefined => {
    return readLogs?.find((log) => log.chapterId === chapterId);
  };

  const isChapterRead = (chapterId: string): boolean => {
    const readLog = getReadLog(chapterId);
    return readLog?.isComplete ?? false;
  };

  const getLastReadChapter = (): ReadLogReturnal | null => {
    if (!readLogs || readLogs.length === 0) {
      return null;
    }
    return readLogs.reduce((latest, current) =>
      current.readAt > latest.readAt ? current : latest
    );
  };

  const isLastReadChapter = (chapterId: string): boolean => {
    const lastRead = getLastReadChapter();
    return lastRead?.chapterId === chapterId;
  };

  const renderCompleteStatus = () => (
    <Badge className="flex items-center gap-1" variant="outline">
      Complete
    </Badge>
  );

  const renderPartialStatus = (
    readLog: ReadLogReturnal,
    isLastRead: boolean
  ) => (
    <div className="flex items-center gap-1">
      <Badge
        className={cn("font-medium text-xs", !isLastRead && "bg-amber-600")}
      >
        Page {readLog.pageNumber}
      </Badge>
    </div>
  );

  const renderReadStatus = (chapterId: string) => {
    const readLog = getReadLog(chapterId);
    const isLastRead = isLastReadChapter(chapterId);

    if (!readLog) {
      return null;
    }

    if (readLog.isComplete) {
      return renderCompleteStatus();
    }

    return renderPartialStatus(readLog, isLastRead);
  };

  return [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            aria-label="Select all"
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            aria-label="Select row"
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        const chapterId = row.original.id;
        const isRead = isChapterRead(chapterId);
        const isLastRead = isLastReadChapter(chapterId);
        const readStatus = renderReadStatus(chapterId);

        return (
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Button
                asChild
                className={cn(
                  "h-auto w-fit min-w-0 flex-1 justify-start px-0 py-1 text-left text-foreground",
                  isRead && "opacity-70"
                )}
                variant="link"
              >
                <Link to={`chapter/${row.original.id}`}>
                  <span className={cn("truncate", isRead && "line-through")}>
                    {row.original.title}
                  </span>
                  {isLastRead && (
                    <span className="ml-2 shrink-0 rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs">
                      Last Read
                    </span>
                  )}
                </Link>
              </Button>
            </div>
            {readStatus && <div className="shrink-0">{readStatus}</div>}
          </div>
        );
      },
    },
    {
      accessorKey: "released_since",
      header: () => (
        <div className="flex justify-end">
          <span className="text-muted-foreground">Released Since</span>
        </div>
      ),
      cell: ({ row }) => {
        const timestamp = row.original.timestamp;

        return (
          <div className="flex justify-end">
            {timestamp ? (
              <time className="text-muted-foreground/60" dateTime={timestamp}>
                {new Date(timestamp).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
            ) : (
              <span className="text-muted-foreground italic">Unknown</span>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => (
        <div className="flex justify-end">
          <span className="text-muted-foreground">Actions</span>
        </div>
      ),

      cell: ({ row }) => {
        const chapterId = row.original.id;
        const chapterNumber = row.original.number;

        const handleMarkAsRead = () => {
          markAsReadMutation.mutate({
            data: manga,
            chapterId,
            chapterNumber,
            pageNumber: 0,
            isComplete: true,
          });
        };

        const handleMarkAsUnread = () => {
          unmarkAsReadMutation.mutate({
            sourceId: manga.sourceId,
            mangaId: manga.mangaId,
            chapterId,
          });
        };

        return (
          <div className="flex items-center justify-end gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="size-6 text-muted-foreground"
                  disabled={
                    markAsReadMutation.isPending ||
                    unmarkAsReadMutation.isPending
                  }
                  size="icon"
                  variant="outline"
                >
                  <Menu className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleMarkAsRead}>
                  Mark as Read
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleMarkAsUnread}>
                  Mark as Unread
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
};

function ChapterRow({ row }: { row: Row<ChapterEntry> }) {
  return (
    <TableRow
      className="relative z-0"
      data-state={row.getIsSelected() && "selected"}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

const renderRows = (
  rows: Row<ChapterEntry>[],
  isLoading: boolean,
  cols: ColumnDef<ChapterEntry>[]
) => {
  if (rows.length > 0) {
    return rows.map((row) => <ChapterRow key={row.id} row={row} />);
  }

  if (isLoading) {
    return (
      <TableRow>
        <TableCell className="h-24 text-center" colSpan={cols.length}>
          Loading...
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell className="h-24 text-center" colSpan={cols.length}>
        No chapters found.
      </TableCell>
    </TableRow>
  );
};

export function ChapterTable({
  data: initialData,
  isLoading,
  readLogs,
  manga,
}: {
  data: ChapterEntry[];
  isLoading: boolean;
  readLogs?: ReadLogReturnal[];
  manga: AppManga;
}): React.JSX.Element {
  const [inverted, setInverted] = React.useState(false);
  const data = React.useMemo(() => {
    return inverted ? [...initialData].reverse() : initialData;
  }, [initialData, inverted]);

  const markAsReadMutation = historyMethods.MUTATIONS.useMarkChapterAsRead();
  const unmarkAsReadMutation =
    historyMethods.MUTATIONS.useUnmarkChapterAsRead();
  const bulkMarkAsReadMutation =
    historyMethods.MUTATIONS.useBulkMarkChaptersAsRead();
  const bulkUnmarkAsReadMutation =
    historyMethods.MUTATIONS.useBulkUnmarkChaptersAsRead();

  const columns = React.useMemo(
    () =>
      createColumns(markAsReadMutation, unmarkAsReadMutation, manga, readLogs),
    [readLogs, markAsReadMutation, unmarkAsReadMutation, manga]
  );

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const handleBulkMarkAsRead = () => {
    if (!manga) {
      return;
    }

    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const chapters = selectedRows.map((row) => ({
      chapterId: row.original.id,
      chapterNumber: row.original.number,
    }));

    bulkMarkAsReadMutation.mutate({
      data: manga,
      chapters,
    });
    table.resetRowSelection();
  };

  const handleBulkMarkAsUnread = () => {
    if (!manga) {
      return;
    }

    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const chapterIds = selectedRows.map((row) => row.original.id);

    bulkUnmarkAsReadMutation.mutate({
      sourceId: manga.sourceId,
      mangaId: manga.mangaId,
      chapterIds,
    });
    table.resetRowSelection();
  };

  const getSelectedRowIndices = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    return selectedRows.map((row) => row.index).sort((a, b) => a - b);
  };

  const selectRowRange = (startIndex: number, endIndex: number) => {
    const newSelection: Record<string, boolean> = {};
    const rows = table.getFilteredRowModel().rows;

    for (
      let i = Math.min(startIndex, endIndex);
      i <= Math.max(startIndex, endIndex);
      i++
    ) {
      if (rows[i]) {
        newSelection[rows[i].id] = true;
      }
    }

    setRowSelection(newSelection);
  };

  const handleSelectAfter = () => {
    const selectedIndices = getSelectedRowIndices();
    if (selectedIndices.length === 0) {
      return;
    }

    const lastSelectedIndex = Math.max(...selectedIndices);
    const totalRows = table.getFilteredRowModel().rows.length;

    selectRowRange(lastSelectedIndex, totalRows - 1);
  };

  const handleSelectBefore = () => {
    const selectedIndices = getSelectedRowIndices();
    if (selectedIndices.length === 0) {
      return;
    }

    const firstSelectedIndex = Math.min(...selectedIndices);

    selectRowRange(0, firstSelectedIndex);
  };

  const handleSelectBetween = () => {
    const selectedIndices = getSelectedRowIndices();
    if (selectedIndices.length < 2) {
      return;
    }

    const firstIndex = Math.min(...selectedIndices);
    const lastIndex = Math.max(...selectedIndices);

    selectRowRange(firstIndex, lastIndex);
  };

  const handleSelectAll = () => {
    table.toggleAllPageRowsSelected(true);
  };

  const handleClearSelection = () => {
    table.resetRowSelection();
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.title.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="mt-8 w-full max-w-4xl">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-xl">Chapters</h2>
        <div className="flex items-center justify-end gap-2">
          <TooltipProvider>
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="outline">
                      <MousePointerClick />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleSelectAll}>
                      Select All Chapters
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleClearSelection}>
                      Clear Selection
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      disabled={
                        table.getFilteredSelectedRowModel().rows.length === 0
                      }
                      onClick={handleSelectAfter}
                    >
                      Select All After Last Selected
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={
                        table.getFilteredSelectedRowModel().rows.length === 0
                      }
                      onClick={handleSelectBefore}
                    >
                      Select All Before First Selected
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={
                        table.getFilteredSelectedRowModel().rows.length < 2
                      }
                      onClick={handleSelectBetween}
                    >
                      Fill Selection Between First & Last
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="outline">
                      <BookCheck className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleBulkMarkAsRead}>
                      Mark Selected as Read
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleBulkMarkAsUnread}>
                      Mark Selected as Unread
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => {
                    setInverted(!inverted);
                  }}
                  size="icon"
                  variant="outline"
                >
                  <ArrowUp
                    className={cn(
                      "size-4 transition-all",
                      inverted && "rotate-180"
                    )}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="pointer-events-none">
                Invert list
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div
        className={cn(
          "my-4 rounded-lg bg-muted p-8 text-center",
          isLoading && "flex items-center justify-center"
        )}
      >
        <Table>
          <TableHeader className="sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead colSpan={header.colSpan} key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="**:data-[slot=table-cell]:first:w-8">
            {renderRows(table.getRowModel().rows, isLoading, columns)}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-4">
        <div className="hidden flex-1 text-muted-foreground text-sm lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label className="font-medium text-sm" htmlFor="rows-per-page">
              Rows per page
            </Label>
            <Select
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
              value={`${table.getState().pagination.pageSize}`}
            >
              <SelectTrigger className="w-20" id="rows-per-page">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50, data.length].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize === data.length ? "All" : pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center font-medium text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              className="hidden size-8 p-0 lg:flex"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.setPageIndex(0)}
              variant="outline"
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeftIcon />
            </Button>
            <Button
              className="size-8"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
              size="icon"
              variant="outline"
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon />
            </Button>
            <Button
              className="size-8"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
              size="icon"
              variant="outline"
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon />
            </Button>
            <Button
              className="hidden size-8 lg:flex"
              disabled={!table.getCanNextPage()}
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              size="icon"
              variant="outline"
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRightIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
