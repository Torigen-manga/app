import type { AppManga } from "@common/index";
import { ChapterTable } from "@renderer/components/chapter-table";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@renderer/components/ui/alert-dialog";
import { Badge } from "@renderer/components/ui/badge";
import { Button } from "@renderer/components/ui/button";
import { Checkbox } from "@renderer/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@renderer/components/ui/dialog";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@renderer/components/ui/select";
import { extensionMethods } from "@renderer/hooks/extensions";
import {
  useAddCategory,
  useAddCategoryToEntry,
  useAddMangaToLibrary,
  useGetLibrary,
  useHasEntry,
  useRemoveMangaFromLibrary,
} from "@renderer/hooks/library";
import { cn } from "@renderer/lib/utils";
import { useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { ErrorPage } from "./error";
import { LoadingPage } from "./loading";

const categorySchema = z.object({
  name: z.string().nonempty({ message: "Category name is required" }),
  newName: z
    .string()
    .optional()
    .refine((val) => !val || val.trim() !== "", {
      message: "New category name cannot be neither empty nor whitespace only",
    }),
});

interface MangaAddDialogProps {
  children: React.ReactNode;
  manga: AppManga;
}

function MangaAddToLibrary({
  children,
  manga,
}: MangaAddDialogProps): React.JSX.Element {
  const { data: library } = useGetLibrary();
  const [selectValue, setSelectValue] = useState<string>("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [addToCategory, setAddToCategory] = useState(false);
  const addCategory = useAddCategory();
  const addMangaToLibrary = useAddMangaToLibrary();
  const addCategoryToEntry = useAddCategoryToEntry();

  function reset() {
    setSelectValue("");
    setNewCategoryName("");
    setFormError(null);
    setIsOpen(false);
  }

  const handleAdd = async () => {
    if (!addToCategory) {
      try {
        await addMangaToLibrary.mutateAsync(manga);
        reset();
      } catch {
        setFormError("Failed to add manga to library. Please try again.");
      }
      return;
    }

    const validationResult = categorySchema.safeParse({
      name: selectValue,
      newName: selectValue === "new-ct" ? newCategoryName : undefined,
    });

    if (!validationResult.success) {
      setFormError(validationResult.error.issues[0].message);
      return;
    }

    try {
      await addMangaToLibrary.mutateAsync(manga);

      const libraryEntryId = `${manga.sourceId}__${manga.mangaId}`;

      if (selectValue === "new-ct") {
        const newCategoryId = await addCategory.mutateAsync(
          newCategoryName.trim()
        );
        await addCategoryToEntry.mutateAsync({
          categoryId: newCategoryId,
          libraryEntryId,
        });
      } else {
        await addCategoryToEntry.mutateAsync({
          categoryId: selectValue,
          libraryEntryId,
        });
      }

      reset();
    } catch {
      setFormError("Failed to add manga to library. Please try again.");
    }
  };

  const isAddDisabled =
    addMangaToLibrary.isPending ||
    addCategory.isPending ||
    addCategoryToEntry.isPending ||
    (addToCategory &&
      (selectValue === "" ||
        (selectValue === "new-ct" && newCategoryName.trim().length === 0)));

  const CategoryList = useMemo(() => {
    if (!library?.categories.length) {
      return <SelectItem value="new-ct">New Category</SelectItem>;
    }

    return (
      <>
        {library.categories.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            {category.name}
          </SelectItem>
        ))}
        <SelectItem value="new-ct">New Category</SelectItem>
      </>
    );
  }, [library?.categories]);

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Library</DialogTitle>
          <DialogDescription>
            Select a category to add this manga to your library.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Checkbox to add manga to a category */}
          <div className="flex items-center gap-2">
            <Checkbox
              checked={addToCategory}
              id="add-to-category"
              onCheckedChange={(checked) => setAddToCategory(checked === true)}
            />
            <p className="text-sm">Add to category</p>
          </div>

          {addToCategory && (
            <div className="space-y-2">
              <Label htmlFor="category-select">Category</Label>
              <Select onValueChange={setSelectValue} value={selectValue}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>{CategoryList}</SelectContent>
              </Select>

              {selectValue === "new-ct" && (
                <div className="space-y-2">
                  <Label htmlFor="new-category">New Category Name</Label>
                  <Input
                    id="new-category"
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter new category name"
                    value={newCategoryName}
                  />
                </div>
              )}
            </div>
          )}

          {formError && <p className="text-red-500">{formError}</p>}
        </div>

        <DialogFooter>
          <Button disabled={isAddDisabled} onClick={reset} variant="outline">
            Cancel
          </Button>
          <Button disabled={isAddDisabled} onClick={handleAdd}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface MangaRemoveFromLibraryProps {
  children: React.ReactNode;
  title: string | undefined;
  sourceId: string;
  mangaId: string;
}

function MangaRemoveFromLibrary({
  children,
  sourceId,
  mangaId,
  title,
}: MangaRemoveFromLibraryProps) {
  const removeManga = useRemoveMangaFromLibrary();
  const [isOpen, setIsOpen] = useState(false);

  async function handleRemove() {
    const libraryEntryId = `${sourceId}__${mangaId}`;
    await removeManga.mutateAsync(libraryEntryId);
    setIsOpen(false);
  }

  return (
    <AlertDialog onOpenChange={setIsOpen} open={isOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Manga from Library</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove <strong>{title}</strong> from your
            library? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={() => setIsOpen(false)} variant="outline">
            Cancel
          </Button>
          <Button
            disabled={removeManga.isPending}
            onClick={handleRemove}
          >
            {removeManga.isPending ? "Removing..." : "Remove"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface CategoryHandlerProps {
  isInLibrary: boolean | undefined;
  manga: AppManga;
}

function CategoryHandler({ isInLibrary, manga }: CategoryHandlerProps) {
  if (!isInLibrary) {
    return (
      <MangaAddToLibrary manga={manga}>
        <Button className="cursor-pointer" variant="outline">
          Add to Library
        </Button>
      </MangaAddToLibrary>
    );
  }

  return (
    <MangaRemoveFromLibrary
      mangaId={manga.mangaId}
      sourceId={manga.sourceId}
      title={manga.title}
    >
      <Button className="cursor-pointer" variant="outline">
        Remove from Library
      </Button>
    </MangaRemoveFromLibrary>
  );
}

interface DetailCampProps {
  title: string;
  textContent?: string;
  children?: React.ReactNode;
  className?: string;
}

function DetailCamp({
  title,
  textContent,
  children,
  className,
}: DetailCampProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <h2 className="font-bold text-primary">{title}</h2>
      {textContent && <p className="text-sm">{textContent}</p>}
      {children}
    </div>
  );
}

export default function MangaDetail(): React.JSX.Element {
  const { mangaId, source } = useParams({ from: "/manga/$source/$mangaId" });

  const { data: manga, isLoading } = extensionMethods.QUERIES.useMangaDetails(
    source,
    mangaId
  );
  
  const { data: chapters, isLoading: chaptersLoading } =
    extensionMethods.QUERIES.useMangaChapters(source, mangaId);
  const [expanded, setExpanded] = useState(false);
  const [isOverflow, setIsOverflow] = useState(false);
  const descRef = useRef<HTMLParagraphElement>(null);
  const { data: hasEntry } = useHasEntry(source, mangaId);

  useEffect(() => {
    const element = descRef.current;
    if (element) {
      const originalHeight = element.scrollHeight;
      const clampedHeight = element.clientHeight;

      if (originalHeight > clampedHeight) {
        setIsOverflow(true);
      }
    }
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!(mangaId && source)) {
    return <ErrorPage code={400} />;
  }

  if (!(manga || isLoading)) {
    return <ErrorPage code={404} message="Manga not found" />;
  }

  if (!manga) {
    return <ErrorPage code={500} message="Failed to load manga details" />;
  }

  const appManga: AppManga = {
    sourceId: source,
    mangaId,
    title: manga.title,
    cover: manga.image,
    description: manga.description,
    artists: manga.artists,
    authors: manga.authors,
    genres: manga.tags.map((tag) => tag.id),
    status: manga.status,
  };

  return (
    <main className="flex h-full w-full flex-col items-center overflow-y-auto p-4">
      <div className="flex w-full flex-col gap-2 sm:max-w-2xl md:max-w-4xl md:flex-row">
        <div className="aspect-2/3 max-h-88 w-fit">
          <img
            alt={manga.title}
            className="size-full rounded-lg border shadow-xl"
            src={manga.image}
          />
        </div>
        <div className="max-w-2xl">
          <div className="flex w-full items-start justify-between">
            <h1 className="font-bold text-2xl">{manga.title}</h1>
            <CategoryHandler isInLibrary={hasEntry} manga={appManga} />
          </div>
          <div className="flex flex-col space-y-2">
            <DetailCamp title="Genres">
              <div className="flex flex-wrap">
                {manga.tags.map((tag) => (
                  <Badge className="mr-1 mb-1" key={tag.id} variant="outline">
                    {tag.label}
                  </Badge>
                ))}
              </div>
            </DetailCamp>

            {manga.artists.length > 0 && (
              <DetailCamp
                textContent={manga.artists.join(", ")}
                title="Artists"
              />
            )}
            {manga.authors.length > 0 && (
              <DetailCamp
                textContent={manga.authors.join(", ")}
                title="Authors"
              />
            )}
            <div>
              <div
                className={cn(
                  "flex items-center",
                  isOverflow ? "justify-between" : "justify-start"
                )}
              >
                <h3 className="font-bold text-lg text-primary">Description</h3>
                {isOverflow && (
                  <Button
                    className="h-6 w-18 rounded-full"
                    onClick={() => setExpanded(!expanded)}
                    variant="link"
                  >
                    {expanded ? "Collapse" : "Expand"}
                  </Button>
                )}
              </div>
              <p className={cn(expanded ? "" : "line-clamp-3")} ref={descRef}>
                {manga.description}
              </p>
            </div>
          </div>
        </div>
      </div>
      <ChapterTable data={chapters ?? []} isLoading={chaptersLoading} />
    </main>
  );
}
