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
import { useGetEntriesByCategory } from "@renderer/hooks/library";
import { cn } from "@renderer/lib/utils";
import {
  ChevronDown,
  CircleAlert,
  Edit,
  GripVertical,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import React from "react";
import { LibraryCard } from "../cards";

interface CategoryCardProps {
  id: string;
  title: string;
  children?: React.ReactNode;
  draggable?: boolean;
  defaultOpen?: boolean;
  onRename?: (categoryId: string, newName: string) => void;
  onDelete?: (categoryId: string) => void; // Updated to pass categoryId
  isDeletable?: boolean;
}

function CategoryCard({
  id,
  title,
  children,
  draggable,
  defaultOpen,
  onRename,
  onDelete,
  isDeletable = true,
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
    onDelete?.(id); // Pass the category ID to the parent
  };

  React.useEffect(() => {
    setEditValue(title);
  }, [title]);

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
        <CollapsibleTrigger
          asChild
          className={cn(
            "flex w-full items-center justify-between rounded-t-lg bg-sidebar p-2 transition-colors hover:bg-sidebar/70",
            "cursor-pointer",
            !open && "rounded-lg",
            open && "border-b"
          )}
        >
          <div>
            <div className="flex flex-1 items-center gap-2">
              {draggable && (
                <GripVertical
                  className="size-4 cursor-grab text-primary-foreground"
                  {...attributes}
                  {...listeners}
                />
              )}
              {isEditing ? (
                <input
                  autoFocus
                  className="border-current border-b bg-transparent font-semibold text-2xl capitalize outline-none"
                  onBlur={handleRename}
                  onChange={(e) => setEditValue(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={handleKeyDown}
                  type="text"
                  value={editValue}
                />
              ) : (
                <h1 className="select-none font-semibold text-2xl capitalize">
                  {title}
                </h1>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Category actions dropdown - only show for non-system categories */}
              {id !== "all-entries" && (onRename || onDelete) && (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="rounded p-1 transition-colors hover:bg-white/20"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="size-4" />
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
                        className="text-red-600 focus:text-red-600"
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
                className={cn("transition-transform", open && "rotate-180")}
              />
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent
          className={cn(
            "min-h-40 bg-accent/25",
            React.Children.count(children) > 0
              ? "grid grid-cols-8 gap-4 p-2"
              : "flex items-center justify-center gap-2"
          )}
        >
          {React.Children.count(children) > 0 ? (
            //biome-ignore lint/complexity/noUselessFragments: Render children if any entries are present
            <>{children}</>
          ) : (
            <>
              <CircleAlert className="size-6 text-muted-foreground" />
              <h2 className="">No Items Found</h2>
            </>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

interface CategorySectionProps {
  categoryId: string;
  categoryName: string;
  draggable?: boolean;
  onRename?: (categoryId: string, newName: string) => void;
  onDelete?: (categoryId: string) => void; // Updated to pass categoryId
}

function CategorySection({
  categoryId,
  categoryName,
  draggable,
  onRename,
  onDelete,
}: CategorySectionProps) {
  const { data: entries, isLoading } = useGetEntriesByCategory(categoryId);

  if (isLoading) {
    return (
      <CategoryCard
        draggable={draggable}
        id={categoryId}
        onDelete={onDelete}
        onRename={onRename}
        title={categoryName}
      >
        <div className="col-span-8 flex items-center justify-center p-4">
          <div className="h-8 w-8 animate-spin rounded-full border-primary border-b-2" />
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
      title={categoryName}
    >
      {entries?.map((entry) => {
        return (
          <LibraryCard
            image={entry.cover}
            key={entry.id}
            mangaId={entry.mangaId}
            property="shadow"
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
