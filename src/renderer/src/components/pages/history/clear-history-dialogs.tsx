import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@renderer/components/ui/alert-dialog";
import { Button } from "@renderer/components/ui/button";
import { Trash2 } from "lucide-react";

interface ClearHistoryDialogProps {
  onClear: () => void;
  hasEntries: boolean;
}

export function ClearHistoryDialog({
  onClear,
  hasEntries,
}: ClearHistoryDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={hasEntries} size="icon" variant="outline">
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear History</AlertDialogTitle>
          <p className="text-muted-foreground text-sm">
            Are you sure you want to clear all history entries? This action
            cannot be undone.
          </p>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
          <Button onClick={() => onClear()} variant="destructive">
            Clear
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
