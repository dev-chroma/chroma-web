"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Clock, Eye, Heart, MessageCircle, Send, Share2 } from "lucide-react";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import type { ArticleComment, PublicArticle } from "@/types/article";

const ArticleReader = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id as string;
  const [article, setArticle] = useState<PublicArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState<PublicArticle[]>([]);
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const viewIncremented = useRef(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchArticle = async () => {
      try {
        setLoading(true);
        const data = await api.articles.getOne(id);
        setArticle(data);

        if (user && data.likedBy?.includes(user._id)) {
          setIsLiked(true);
        }

        // COMMENTS
        try {
          const commentsData = await api.articles.getComments(id);

          setComments(Array.isArray(commentsData) ? commentsData : []);
        } catch (error) {
          console.warn("Failed to fetch comments:", error);
        }

        // RELATED ARTICLES
        try {
          const categoryId = data.category?._id;

          if (categoryId) {
            const related = await api.articles.list({
              category: categoryId,

              limit: 3,
            });

            const relatedList = related.articles || [];

            setRelatedArticles(relatedList.filter((a) => a._id !== id));
          }
        } catch (error) {
          console.warn("Failed to fetch related articles:", error);
        }

        // VIEWS

        if (!viewIncremented.current) {
          const views = await api.articles.incrementViews(id);

          if (views?.reads !== undefined) {
            setArticle((prev) =>
              prev
                ? {
                    ...prev,
                    reads: views.reads,
                  }
                : prev,
            );
          }

          viewIncremented.current = true;
        }
      } catch (error) {
        console.error("Failed to fetch article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();

    window.scrollTo(0, 0);
  }, [id, user]);

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

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push("/auth");

      return;
    }

    if (!article || !commentContent.trim()) {
      return;
    }

    try {
      setIsSubmittingComment(true);

      const newComment = await api.articles.addComment(article._id, {
        content: commentContent,
      });

      setComments([newComment, ...comments]);

      setCommentContent("");

      setArticle({
        ...article,

        commentsCount: article.commentsCount + 1,
      });
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="w-12 h-12 border-4 border-emerald-950/10 border-t-emerald-950 rounded-full animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream-50 py-20 text-center px-4">
        <h2 className="text-4xl font-serif font-bold text-emerald-950 mb-4">
          Chronicle Not Found
        </h2>

        <p className="text-emerald-950/60 font-medium mb-12 max-w-md">
          The masterpiece you seek has vanished from our library.
        </p>

        <button
          onClick={() => router.push("/")}
          className="px-10 py-4 bg-emerald-950 text-cream-50 rounded-full font-bold text-[10px] tracking-[0.3em] uppercase hover:bg-emerald-900 transition-all"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-cream-50 min-h-screen pb-32">
      {/* HERO */}

      <header className="relative pt-8 pb-8 md:pt-12 overflow-hidden border-b border-emerald-950/5">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="flex justify-center items-center gap-4">
              <span className="px-5 py-2 bg-emerald-950 text-cream-50 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">
                {article.category?.name}
              </span>

              <div className="flex items-center gap-2 text-emerald-950/40 text-[10px] font-bold uppercase tracking-widest">
                <Clock className="w-3.5 h-3.5" />

                {article.readTime}
              </div>
            </div>

            <h1 className="text-4xl md:text-7xl font-serif font-bold text-emerald-950 leading-[1.1] tracking-tight">
              {article.title}
            </h1>

            <p className="text-xl md:text-2xl text-emerald-950/60 font-medium italic max-w-3xl mx-auto">
              &quot;{article.excerpt}&quot;
            </p>
          </div>
        </div>
      </header>

      {/* IMAGE */}

      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-6xl mx-auto rounded-[3rem] overflow-hidden shadow-2xl aspect-21/9 border-8 border-white relative">
          <Image
            src={article.thumbnail || "/placeholder.jpg"}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* CONTENT */}

      <div className="container mx-auto px-4 mt-10">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-emerald prose-xl max-w-none">
            {article.content
              .split(/\n+/)
              .filter((p) => p.trim())
              .map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
          </div>

          {/* ACTIONS */}

          <div className="mt-20 pt-10 border-t border-emerald-950/5 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-3 px-8 py-4 rounded-full font-bold text-xs tracking-widest border transition-all ${
                  isLiked
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-white text-emerald-950 border-emerald-950/10"
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />

                {article.likes}
              </button>

              <div className="flex items-center gap-3 px-8 py-4 rounded-full font-bold text-xs tracking-widest border bg-white text-emerald-950 border-emerald-950/10">
                <Eye className="w-5 h-5 text-emerald-950/40" />

                {article.reads}
              </div>
            </div>

            <button
              onClick={async () => {
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
              }}
              className="w-12 h-12 rounded-full border border-emerald-950/5 flex items-center justify-center hover:bg-emerald-950 hover:text-cream-50 transition-all"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* COMMENTS */}

          <div className="mt-24 space-y-12">
            <h3 className="text-2xl font-serif font-bold text-emerald-950">
              Comments
            </h3>

            <form
              onSubmit={handleCommentSubmit}
              className="bg-white p-8 rounded-[2.5rem] border border-emerald-950/5 shadow-xl space-y-4"
            >
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Write your thoughts..."
                className="w-full bg-transparent border-none outline-none min-h-30"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmittingComment}
                  className="flex items-center gap-3 px-8 py-3 bg-emerald-950 text-cream-50 rounded-full font-bold text-[10px] uppercase tracking-[0.2em]"
                >
                  <Send className="w-4 h-4" />
                  Post
                </button>
              </div>
            </form>

            <div className="space-y-8">
              {comments.map((comment) => (
                <div key={comment._id} className="flex gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-950/5 flex items-center justify-center">
                    {comment.author.firstName?.[0]}
                  </div>

                  <div>
                    <h4 className="font-bold text-emerald-950">
                      {comment.author.firstName} {comment.author.surname}
                    </h4>

                    <p className="text-emerald-950/70 mt-2">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}

              {comments.length === 0 && (
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-emerald-950/10 mx-auto mb-4" />

                  <p className="text-emerald-950/40">No comments yet</p>
                </div>
              )}
            </div>
          </div>

          {/* RELATED */}

          {relatedArticles.length > 0 && (
            <div className="mt-32">
              <h3 className="text-3xl font-serif font-bold text-emerald-950 mb-12">
                Continue Reading
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel._id}
                    href={`/article/${rel._id}`}
                    className="group"
                  >
                    <div className="relative aspect-4/3 rounded-3xl overflow-hidden mb-4">
                      <Image
                        src={rel.thumbnail || "/placeholder.jpg"}
                        alt={rel.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>

                    <h4 className="font-serif font-bold text-emerald-950 group-hover:text-emerald-700 transition-colors">
                      {rel.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleReader;
