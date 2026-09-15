"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function ConfirmDelete({
  open,
  onOpenChange,
  what,
  name,
  published,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  what: "post" | "event";
  name: string;
  published: boolean;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-black tracking-tight">Delete this {what}?</AlertDialogTitle>
          <AlertDialogDescription>
            “{name || "Untitled"}” will be permanently removed
            {published ? " and taken off the website immediately" : ""}. This can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" className="rounded-full" onClick={onConfirm}>
            Delete {what}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
