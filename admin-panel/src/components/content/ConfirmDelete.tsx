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
      <AlertDialogContent className="rounded-2xl border-gray-200/70 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.2)] sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-semibold tracking-[-0.01em]">Delete this {what}?</AlertDialogTitle>
          <AlertDialogDescription className="text-[13px] leading-relaxed">
            “{name || "Untitled"}” will be permanently removed
            {published ? " and taken off the website immediately" : ""}. This can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-9 rounded-full text-[13px] font-medium shadow-none">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" className="h-9 rounded-full text-[13px] font-medium shadow-none" onClick={onConfirm}>
            Delete {what}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
