import Image from "next/image";
import Link from "next/link";

import { Clock, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";

import "@/models/User";
import "@/models/Category";
import "@/models/Comment";

import Article from "@/models/Article";
import Comment from "@/models/Comment";

import ArticleActions from "@/components/article/ArticleActions";
import CommentForm from "@/components/article/CommentForm";

import type { ArticleComment, PublicArticle } from "@/types/article";

interface ArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  await connectDB();

  const { id } = await params;

  const article = await Article.findById(id)
    .populate("author", "firstName surname avatar school")
    .populate("category", "name slug")
    .lean();

  console.log(article.likedBy);

  if (!article) {
    notFound();
  }

  const comments = await Comment.find({
    article: id,
  })
    .populate("author", "firstName surname avatar")
    .sort({
      createdAt: -1,
    })
    .lean();

  const relatedArticles = await Article.find({
    _id: {
      $ne: article._id,
    },

    category:
      typeof article.category === "object"
        ? article.category._id
        : article.category,

    status: "Published",

    deletedAt: {
      $exists: false,
    },
  })
    .populate("author", "firstName surname avatar school")
    .limit(3)
    .lean();

  const serializedArticle: PublicArticle = JSON.parse(JSON.stringify(article));

  const serializedComments: ArticleComment[] = JSON.parse(
    JSON.stringify(comments),
  );

  const serializedRelated: PublicArticle[] = JSON.parse(
    JSON.stringify(relatedArticles),
  );

  return (
    <div className="bg-cream-50 min-h-screen pb-32 px-8">
      <header className="relative pt-8 pb-8 md:pt-12 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="mx-auto text-center space-y-4">
            <div className="flex justify-center items-center gap-4">
              <span className="px-5 py-2 bg-emerald-950 text-cream-50 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">
                {serializedArticle.category?.name}
              </span>

              <div className="flex items-center gap-2 text-emerald-950/40 text-[10px] font-bold uppercase tracking-widest">
                <Clock className="w-3.5 h-3.5" />

                {serializedArticle.readTime}
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-serif font-bold leading-tight text-emerald-950 tracking-tight">
              {serializedArticle.title}
            </h1>

            <p className="text-lg md:text-xl text-emerald-950/60 font-medium italic max-w-3xl mx-auto">
              &quot;{serializedArticle.excerpt}&quot;
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 relative z-20">
        <div className="mx-auto rounded-4xl overflow-hidden aspect-16/7 relative">
          <Image
            src={serializedArticle.thumbnail || "/placeholder.jpg"}
            alt={serializedArticle.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-16">
            <aside className="lg:sticky lg:top-24 h-fit">
              <div className="space-y-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-950/40 mb-4">
                    Contributor
                  </p>

                  <Link
                    href={`/profile/${serializedArticle.author._id}`}
                    className="flex items-center gap-3 group hover:bg-emerald-950/5 rounded-lg p-2 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-emerald-950/5 relative">
                      {serializedArticle.author.avatar ? (
                        <Image
                          src={serializedArticle.author.avatar}
                          alt={serializedArticle.author.firstName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {serializedArticle.author.firstName[0]?.toUpperCase() || "?"}
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="font-medium text-emerald-950">
                        {serializedArticle.author.firstName}{" "}
                        {serializedArticle.author.surname}
                      </p>

                      <p className="text-sm text-emerald-950/40 truncate max-w-35">
                        {serializedArticle.author.school}
                      </p>
                    </div>
                  </Link>
                </div>

                <hr className="border-emerald-950/10" />

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-950/40 mb-3">
                    Reading Time
                  </p>

                  <div className="flex items-center gap-2 text-sm text-emerald-950/70">
                    <Clock className="w-4 h-4" />
                    {serializedArticle.readTime}
                  </div>
                </div>

                <hr className="border-emerald-950/10" />

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-950/40 mb-3">
                    Category
                  </p>

                  <p className="text-sm text-emerald-950">
                    {serializedArticle.category?.name}
                  </p>
                </div>
              </div>
            </aside>

            <article>
              <div className="prose prose-lg max-w-none prose-headings:font-serif prose-p:text-emerald-950/80 prose-p:leading-loose">
                {serializedArticle.content
                  .split(/\n+/)
                  .filter((p) => p.trim())
                  .map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
              </div>

              <ArticleActions article={serializedArticle} />
            </article>
          </div>

          <div className="mt-24 space-y-12">
            <h3 className="text-2xl font-serif font-bold text-emerald-950">
              Comments
            </h3>

            <CommentForm articleId={serializedArticle._id} />

            <div className="space-y-8">
              {serializedComments.map((comment) => (
                <div key={comment._id} className="flex gap-5">
                  {comment.author.avatar ? (
                    <Image
                      src={comment.author.avatar}
                      alt={comment.author.firstName}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-emerald-950/5 flex items-center justify-center">
                      {comment.author.firstName?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}

                  <div>
                    <h4 className="font-bold text-emerald-950">
                      {comment.author.firstName} {comment.author.surname}
                    </h4>

                    <p className="text-emerald-950/70 mt-2 max-w-2xl">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}

              {serializedComments.length === 0 && (
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-emerald-950/10 mx-auto mb-4" />

                  <p className="text-emerald-950/40">No comments yet</p>
                </div>
              )}
            </div>
          </div>

          {serializedRelated.length > 0 && (
            <div className="mt-32">
              <h3 className="text-3xl font-serif font-bold text-emerald-950 mb-12">
                Continue Reading
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {serializedRelated.map((rel) => (
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
}
