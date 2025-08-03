import { useRemoveFromLibrary } from "@renderer/hooks/pages/manga-details/use-remove-from-library";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";
import { Button } from "../../ui/button";

interface MangaRemoveFromLibraryProps {
  children: React.ReactNode;
  title: string | undefined;
  sourceId: string;
  mangaId: string;
}

export function MangaRemoveFromLibrary({
  children,
  sourceId,
  mangaId,
  title,
}: MangaRemoveFromLibraryProps) {
  const { isOpen, setIsOpen, handleRemove, isRemoving } = useRemoveFromLibrary(
    sourceId,
    mangaId
  );

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
          <Button disabled={isRemoving} onClick={handleRemove}>
            {isRemoving ? "Removing..." : "Remove"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
