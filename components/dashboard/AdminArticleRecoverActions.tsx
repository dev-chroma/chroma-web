"use client";

import { RotateCcw, Trash2 } from "lucide-react";

interface Props {
  articleId: string;
  onRecover: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function AdminArticleRecoverActions({
  articleId,
  onRecover,
  onDelete,
}: Props) {
  return (
    <div className="flex gap-3">
      <button
        onClick={() => onRecover(articleId)}
        className="p-2 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors font-normal cursor-pointer"
      >
        <RotateCcw className="size-5" />
      </button>

      <button
        onClick={() => onDelete(articleId)}
        className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors font-normal cursor-pointer"
      >
        <Trash2 className="size-5" />
      </button>
    </div>
  );
}
