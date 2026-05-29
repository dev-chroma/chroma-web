"use client";

import { useState } from "react";
import { Loader, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";

interface CommentFormProps {
  articleId: string;
}

const CommentForm = ({ articleId }: CommentFormProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push("/auth");
      return;
    }

    if (!content.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await api.articles.addComment(articleId, {
        content,
      });

      setContent("");

      router.refresh();
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-[2.5rem] border border-emerald-950/5 shadow-xl space-y-4"
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your thoughts..."
        className="w-full bg-transparent border-none outline-none min-h-30 resize-none"
      />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="flex items-center gap-3 px-8 py-3 bg-emerald-950 text-cream-50 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Posting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Post
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
