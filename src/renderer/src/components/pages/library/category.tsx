import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@renderer/components/ui/collapsible";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@renderer/components/ui/dropdown-menu";
import { libraryMethods } from "@renderer/hooks/services/library";
import { cn } from "@renderer/lib/utils";
import {
	ChevronDown,
	CircleAlert,
	Edit,
	GripVertical,
	MoreHorizontal,
	Search,
	Trash2,
} from "lucide-react";
import React from "react";
import { LibraryCard } from "../../cards";
import { Badge } from "../../ui/badge";

interface CategoryCardTriggerProps {
	attributes: DraggableAttributes;
	children: React.ReactNode;
	draggable?: boolean;
	editValue: string;
	handleDelete: () => void;
	handleEdit: () => void;
	handleKeyDown: (e: React.KeyboardEvent) => void;
	handleRename: () => void;
	id: string;
	isDeletable: boolean;
	isEditing: boolean;
	listeners: SyntheticListenerMap | undefined;
	onDelete?: (categoryId: string) => void;
	onRename?: (categoryId: string, newName: string) => void;
	open: boolean;
	setEditValue: (value: string) => void;
	title: string;
}

function CategoryCardTrigger({
	attributes,
	children,
	draggable,
	editValue,
	handleDelete,
	handleEdit,
	handleKeyDown,
	handleRename,
	id,
	isDeletable,
	isEditing,
	listeners,
	onDelete,
	onRename,
	open,
	setEditValue,
	title,
}: CategoryCardTriggerProps) {
	return (
		<CollapsibleTrigger
			asChild
			className={cn(
				"group flex w-full items-center justify-between rounded-t-lg bg-gradient-to-r from-card to-card/90 px-4 py-3 transition-all duration-200 hover:from-card/95 hover:to-card/85",
				"cursor-pointer border border-border/40 shadow-sm hover:border-border/60 hover:shadow-md",
				!open && "mb-2 rounded-lg",
				open && "border-b-0 shadow-lg"
			)}
		>
			<div className="flex w-full items-center justify-between">
				<div className="flex items-center gap-3">
					{draggable && (
						<div className="opacity-40 transition-opacity group-hover:opacity-100">
							<GripVertical
								className="size-5 cursor-grab text-muted-foreground hover:text-foreground"
								{...attributes}
								{...listeners}
							/>
						</div>
					)}
					{isEditing ? (
						<input
							autoFocus
							className="border-current border-b-2 bg-transparent font-semibold text-xl capitalize outline-none focus:border-primary"
							onBlur={handleRename}
							onChange={(e) => setEditValue(e.target.value)}
							onClick={(e) => e.stopPropagation()}
							onKeyDown={handleKeyDown}
							type="text"
							value={editValue}
						/>
					) : (
						<div className="flex items-center gap-3">
							<h1 className="select-none font-semibold text-xl capitalize transition-colors group-hover:text-primary">
								{title}
							</h1>
							{React.Children.count(children) > 0 && (
								<Badge
									className="select-none font-bold text-xs"
									variant="secondary"
								>
									{React.Children.count(children)}
								</Badge>
							)}
						</div>
					)}
				</div>

				<div className="flex items-center gap-2">
					{id !== "all-entries" && (onRename || onDelete) && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button
									className="rounded-md p-2 opacity-0 transition-opacity hover:bg-muted/50 group-hover:opacity-100"
									onClick={(e) => e.stopPropagation()}
									type="button"
								>
									<MoreHorizontal className="size-4" />
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{onRename && (
									<DropdownMenuItem onClick={handleEdit}>
										<Edit className="mr-2 size-4" />
										Rename
									</DropdownMenuItem>
								)}
								{onDelete && isDeletable && (
									<DropdownMenuItem
										className="text-destructive focus:text-destructive"
										onClick={handleDelete}
									>
										<Trash2 className="mr-2 size-4" />
										Delete
									</DropdownMenuItem>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					)}

					<ChevronDown
						className={cn(
							"size-5 text-muted-foreground transition-all duration-200 group-hover:text-foreground",
							open && "rotate-180"
						)}
					/>
				</div>
			</div>
		</CollapsibleTrigger>
	);
}

interface CategoryCardContentProps {
	children: React.ReactNode;
	searchParam?: string;
}

function CategoryCardContent({
	children,
	searchParam,
}: CategoryCardContentProps) {
	return (
		<CollapsibleContent
			className={cn(
				"overflow-hidden transition-all duration-200",
				React.Children.count(children) > 0
					? "grid grid-cols-3 gap-4 rounded-b-lg border border-border/40 border-t-0 bg-muted/30 p-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8"
					: "flex items-center justify-center rounded-b-lg border border-border/40 border-t-0 bg-muted/20 py-12"
			)}
		>
			{React.Children.count(children) > 0 ? (
				children
			) : (
				<div className="flex flex-col items-center gap-4 text-muted-foreground">
					{searchParam?.trim() ? (
						<>
							<div className="rounded-full bg-muted p-4">
								<Search className="size-8" />
							</div>
							<div className="text-center">
								<h2 className="font-medium text-base">
									No matching manga found
								</h2>
								<p className="text-sm">Try adjusting your search terms</p>
							</div>
						</>
					) : (
						<>
							<div className="rounded-full bg-muted p-4">
								<CircleAlert className="size-8" />
							</div>
							<div className="text-center">
								<h2 className="font-medium text-base">
									No manga in this category
								</h2>
								<p className="text-sm">Add some manga to get started</p>
							</div>
						</>
					)}
				</div>
			)}
		</CollapsibleContent>
	);
}

interface CategoryCardProps {
	id: string;
	title: string;
	children?: React.ReactNode;
	draggable?: boolean;
	defaultOpen?: boolean;
	reorderMode?: boolean;
	onRename?: (categoryId: string, newName: string) => void;
	onDelete?: (categoryId: string) => void;
	isDeletable?: boolean;
	searchParam?: string;
}

function CategoryCard({
	id,
	title,
	children,
	draggable,
	defaultOpen,
	reorderMode,
	onRename,
	onDelete,
	isDeletable = true,
	searchParam,
}: CategoryCardProps): React.JSX.Element {
	const sortable = useSortable({ id });
	const { attributes, listeners, setNodeRef, transform, transition } = sortable;

	function isDefaultOpen() {
		if (typeof defaultOpen === "undefined") {
			return false;
		}
		return defaultOpen;
	}

	const [open, setOpen] = React.useState(isDefaultOpen());
	const [isEditing, setIsEditing] = React.useState(false);
	const [editValue, setEditValue] = React.useState(title);

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const handleRename = () => {
		if (editValue.trim() && editValue !== title) {
			onRename?.(id, editValue.trim());
		}
		setIsEditing(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleRename();
		} else if (e.key === "Escape") {
			setEditValue(title);
			setIsEditing(false);
		}
	};

	const handleEdit = () => {
		setIsEditing(true);
		setEditValue(title);
	};

	const handleDelete = () => {
		onDelete?.(id);
	};

	React.useEffect(() => {
		setEditValue(title);
	}, [title]);

	React.useEffect(() => {
		if (reorderMode) {
			setOpen(false);
		}
	}, [reorderMode]);

	return (
		<div
			ref={draggable ? setNodeRef : undefined}
			style={draggable ? style : undefined}
		>
			<Collapsible
				className="w-full rounded-lg border transition-all"
				onOpenChange={setOpen}
				open={open}
			>
				<CategoryCardTrigger
					attributes={attributes}
					draggable={draggable}
					editValue={editValue}
					handleDelete={handleDelete}
					handleEdit={handleEdit}
					handleKeyDown={handleKeyDown}
					handleRename={handleRename}
					id={id}
					isDeletable={isDeletable}
					isEditing={isEditing}
					listeners={listeners}
					onDelete={onDelete}
					onRename={onRename}
					open={open}
					setEditValue={setEditValue}
					title={title}
				>
					{children}
				</CategoryCardTrigger>
				<CategoryCardContent searchParam={searchParam}>
					{children}
				</CategoryCardContent>
			</Collapsible>
		</div>
	);
}

interface CategorySectionProps {
	categoryId: string;
	categoryName: string;
	draggable?: boolean;
	reorderMode?: boolean;
	onRename?: (categoryId: string, newName: string) => void;
	onDelete?: (categoryId: string) => void;
	searchParam?: string;
}

function CategorySection({
	categoryId,
	categoryName,
	draggable,
	reorderMode,
	onRename,
	onDelete,
	searchParam,
}: CategorySectionProps) {
	const { data: entries, isLoading } =
		libraryMethods.QUERIES.useGetEntriesByCategory(categoryId);

	const filteredEntries = React.useMemo(() => {
		if (!searchParam?.trim()) {
			return entries || [];
		}

		const searchLower = searchParam.toLowerCase().trim();
		return (entries || []).filter((entry) =>
			entry.title.toLowerCase().includes(searchLower)
		);
	}, [entries, searchParam]);

	if (isLoading) {
		return (
			<CategoryCard
				draggable={draggable}
				id={categoryId}
				onDelete={onDelete}
				onRename={onRename}
				reorderMode={reorderMode}
				searchParam={searchParam}
				title={categoryName}
			>
				<div className="col-span-8 flex items-center justify-center p-4">
					<div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
				</div>
			</CategoryCard>
		);
	}

	return (
		<CategoryCard
			draggable={draggable}
			id={categoryId}
			onDelete={onDelete}
			onRename={onRename}
			reorderMode={reorderMode}
			searchParam={searchParam}
			title={categoryName}
		>
			{filteredEntries.map((entry) => {
				return (
					<LibraryCard
						image={entry.cover}
						key={entry.id}
						mangaId={entry.mangaId}
						source={entry.sourceId}
						title={entry.title}
						unreadCount={entry.cachedTotalChapters || 0}
					/>
				);
			})}
		</CategoryCard>
	);
}

export { CategoryCard, CategorySection };
