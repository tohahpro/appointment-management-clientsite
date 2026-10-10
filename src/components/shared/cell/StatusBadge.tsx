"use client";

import { Badge } from "@/components/ui/badge";

interface StatusBadgeCellProps {
  isDeleted?: boolean;
  activeText?: string;
  deletedText?: string;
}

export function StatusBadgeCell({
  isDeleted,
  activeText = "Active",
  deletedText = "Deleted",
}: StatusBadgeCellProps) {
  return (
    <Badge
      variant={isDeleted ? "destructive" : "default"}
      className={!isDeleted ? "bg-green-500 text-white hover:bg-green-700" : ""}
    >
      {isDeleted ? deletedText : activeText}
    </Badge>
  );
}