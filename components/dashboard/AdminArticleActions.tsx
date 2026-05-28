"use client";

import { useRouter } from "next/navigation";
import { Edit, Trash2 } from "lucide-react";
import { api } from "@/services/api";

interface AdminArticleActionsProps {
  articleId: string;
}

export default function AdminArticleActions({
  articleId,
}: AdminArticleActionsProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to archive this article? It will be permanently deleted after 7 days.",
    );
    if (!confirmed) {
      return;
    }
    try {
      await api.articles.delete(articleId);
      router.refresh();
    } catch (error) {
      console.error("Failed to archive article:", error);
    }
  };

  return (
    <div className="flex gap-4">
      {/* EDIT */}
      <button
        onClick={() => router.push(`/edit-piece/${articleId}`)}
        className="p-2 hover:bg-emerald-50 text-emerald-950/40 hover:text-emerald-950 rounded-lg transition-colors"
        title="Edit Submission"
      >
        <Edit className="w-5 h-5" />
      </button>

      {/* DELETE */}
      <button
        onClick={handleDelete}
        className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
        title="Archive Piece"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}
