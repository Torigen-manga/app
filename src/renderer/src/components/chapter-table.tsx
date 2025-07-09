import { Button } from "@renderer/components/ui/button";
import { Checkbox } from "@renderer/components/ui/checkbox";
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
import { cn } from "@renderer/lib/utils";
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
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronsLeftIcon,
	ChevronsRightIcon,
	PlusIcon,
} from "lucide-react";

import React from "react";
import { Link } from "react-router";
import { toast } from "sonner";

const columns: ColumnDef<ChapterEntry>[] = [
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
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
		cell: ({ row }) => (
			<div className="flex">
				<Button
					asChild
					className="w-fit px-0 text-left text-foreground"
					variant="link"
				>
					<Link to={`chapter/${row.original.id}`}>{row.original.title}</Link>
				</Button>
			</div>
		),
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

		cell: () => (
			<div className="flex items-center justify-end gap-2">
				<Button
					className="size-6"
					onClick={() => toast("Download feature coming soon!")}
					size="icon"
					variant="outline"
				>
					<PlusIcon className="size-4" />
				</Button>
			</div>
		),
	},
];

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

export function ChapterTable({
	data: initialData,
	isLoading,
}: {
	data: ChapterEntry[];
	isLoading: boolean;
}): React.JSX.Element {
	const [inverted, setInverted] = React.useState(false);
	const data = React.useMemo(() => {
		return inverted ? [...initialData].reverse() : initialData;
	}, [initialData, inverted]);
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
		<>
			<div className="mt-8 w-full max-w-4xl">
				<div className="flex items-center">
					<h2 className="font-semibold text-xl">Chapters</h2>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									className="ml-auto size-8"
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
				<div
					className={cn(
						"my-4 rounded-lg bg-muted p-8 text-center",
						isLoading && "flex items-center justify-center"
					)}
				>
					<Table>
						<TableHeader className="sticky top-0 z-10 bg-muted">
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
							{table.getRowModel().rows?.length ? (
								<>
									{table.getRowModel().rows.map((row) => (
										<ChapterRow key={row.id} row={row} />
									))}
								</>
							) : isLoading ? (
								<TableRow>
									<TableCell
										className="h-24 text-center"
										colSpan={columns.length}
									>
										Loading...
									</TableCell>
								</TableRow>
							) : (
								<TableRow>
									<TableCell
										className="h-24 text-center"
										colSpan={columns.length}
									>
										No chapters found.
									</TableCell>
								</TableRow>
							)}
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
								className="hidden h-8 w-8 p-0 lg:flex"
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
		</>
	);
}
