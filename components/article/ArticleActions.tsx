"use client";

import { useState } from "react";
import { Bell, Eye, Heart, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import type { PublicArticle } from "@/types/article";

interface ArticleActionsProps {
  article: PublicArticle;
}

const ArticleActions = ({ article }: ArticleActionsProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const [likes, setLikes] = useState(article.likes || 0);
  const serverLiked =
    article.likedBy?.some((id) => String(id) === String(user?._id)) || false;
  const serverEnrolled =
    article.enrolledBy?.some((id) => String(id) === String(user?._id)) || false;

  const [optimisticLiked, setOptimisticLiked] = useState<boolean | null>(null);
  const [optimisticEnrolled, setOptimisticEnrolled] = useState<boolean | null>(null);

  const isLiked = optimisticLiked === null ? serverLiked : optimisticLiked;
  const isEnrolled =
    optimisticEnrolled === null ? serverEnrolled : optimisticEnrolled;
  const [isLiking, setIsLiking] = useState(false);
  const [isTogglingEnrollment, setIsTogglingEnrollment] = useState(false);

  console.log("USER ID:", user?._id);
  console.log("LIKED BY:", article.likedBy);

  const handleLike = async () => {
    if (isLiking) {
      return;
    }
    if (!user) {
      router.push("/auth");
      return;
    }

    try {
      setIsLiking(true);
      const previousLiked = isLiked;

      // optimistic update
      setOptimisticLiked(!previousLiked);
      setLikes((prev) => (previousLiked ? Math.max(prev - 1, 0) : prev + 1));
      const updated = await api.articles.like(article._id);
      setOptimisticLiked(updated.liked);
      if (updated?.likes !== undefined) {
        setLikes(updated.likes);
      }
    } catch (error) {
      console.error("Failed to update like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleEnroll = async () => {
    if (isTogglingEnrollment) {
      return;
    }

    if (!user) {
      router.push("/auth");
      return;
    }

    try {
      setIsTogglingEnrollment(true);
      const previousEnrolled = isEnrolled;

      setOptimisticEnrolled(!previousEnrolled);
      const updated = await api.articles.enroll(article._id);
      setOptimisticEnrolled(updated.enrolled);
    } catch (error) {
      console.error("Failed to update enrollment:", error);
    } finally {
      setIsTogglingEnrollment(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard");
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  return (
    <div className="mt-20 pt-10 border-t border-emerald-950/5 flex flex-wrap items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <button
          onClick={handleEnroll}
          disabled={isTogglingEnrollment}
          className={`flex items-center gap-3 px-8 py-4 rounded-full font-bold text-xs tracking-widest border transition-all ${
            isEnrolled
              ? "bg-emerald-950 text-white border-emerald-950"
              : "bg-white text-emerald-950 border-emerald-950/10"
          }`}
        >
          <Bell className={`w-5 h-5 ${isEnrolled ? "fill-current" : ""}`} />

          {isEnrolled ? "Subscribed" : "Subscribe"}
        </button>

        {/* LIKE */}

        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center gap-3 px-8 py-4 rounded-full font-bold text-xs tracking-widest border transition-all ${
            isLiked
              ? "bg-red-500 text-white border-red-500"
              : "bg-white text-emerald-950 border-emerald-950/10"
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />

          {likes}
        </button>

        {/* VIEWS */}

        <div className="flex items-center gap-3 px-8 py-4 rounded-full font-bold text-xs tracking-widest border bg-white text-emerald-950 border-emerald-950/10">
          <Eye className="w-5 h-5 text-emerald-950/40" />

          {article.reads || 0}
        </div>
      </div>

      {/* SHARE */}

      <button
        onClick={handleShare}
        className="w-12 h-12 rounded-full border border-emerald-950/5 flex items-center justify-center hover:bg-emerald-950 hover:text-cream-50 transition-all"
      >
        <Share2 className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ArticleActions;
