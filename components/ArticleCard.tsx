"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, Heart, ArrowUpRight, Eye } from "lucide-react";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import type { PublicArticle } from "@/types/article";

interface ArticleCardProps {
  article: PublicArticle;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  article: initialArticle,
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const [article, setArticle] = useState(initialArticle);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (!article || isLiking) {
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
      setIsLiked(!previousLiked);

      setArticle((prev) =>
        prev
          ? {
              ...prev,
              likes: previousLiked
                ? Math.max(prev.likes - 1, 0)
                : prev.likes + 1,
            }
          : prev,
      );

      const updated = await api.articles.like(article._id);

      setIsLiked(updated.liked);

      if (updated?.likes !== undefined) {
        setArticle((prev) =>
          prev
            ? {
                ...prev,
                likes: updated.likes,
              }
            : prev,
        );
      }
    } catch (error) {
      console.error("Failed to update like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Link href={`/article/${article._id}`} className="group h-full">
      <article className="bg-white rounded-3xl overflow-hidden border border-emerald-950/8 group shadow-2xl cursor-pointer shadow-emerald-950/10 transition-all duration-500 flex flex-col h-full">
        {/* IMAGE */}

        <div className="relative overflow-hidden aspect-4/3">
          <Image
            src={article.thumbnail || "/placeholder.jpg"}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wider text-emerald-950 border border-emerald-950/10">
              {typeof article.category === "string"
                ? article.category
                : article.category?.name}
            </span>
          </div>

          <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-950 transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
              <ArrowUpRight className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* CONTENT */}

        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center gap-4 text-[10px] text-emerald-950/40 uppercase tracking-widest font-bold mb-4">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />

              {article.readTime}
            </div>

            <span>•</span>

            <span>
              {article.createdAt
                ? new Date(article.createdAt).toLocaleDateString()
                : ""}
            </span>
          </div>

          <h3 className="text-xl font-serif font-bold text-emerald-950 mb-3 group-hover:text-emerald-800 transition-colors line-clamp-1 truncate leading-tight">
            {article.title}
          </h3>

          <p className="text-emerald-950/60 text-sm line-clamp-2 truncate mb-6 leading-relaxed">
            {article.excerpt}
          </p>

          {/* FOOTER */}

          <div className="mt-auto pt-6 border-t border-emerald-950/5 flex items-center justify-between">
            {/* AUTHOR */}

            <div className="flex items-center gap-3">
              {article.author?.avatar ? (
                <Image
                  src={article.author.avatar}
                  alt={article.author.firstName}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full border border-emerald-950/10 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-emerald-950/5 flex items-center justify-center text-xs font-serif font-bold text-emerald-950">
                  {article.author.firstName?.[0]}
                </div>
              )}

              <span className="text-xs font-medium text-emerald-950/80">
                {article.author.firstName} {article.author.surname}
              </span>
            </div>

            {/* ACTIONS */}

            <div className="flex items-center gap-4">
              {/* LIKE */}

              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 transition-colors group/likes ${
                  isLiked
                    ? "text-red-500"
                    : "text-emerald-950/40 hover:text-red-500"
                }`}
                title="Like article"
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />

                <span className="text-xs font-bold">{article.likes}</span>
              </button>

              {/* VIEWS */}

              <div className="flex items-center gap-1.5 text-emerald-950/40">
                <Eye className="w-4 h-4" />

                <span className="text-xs font-bold">{article.reads || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ArticleCard;
