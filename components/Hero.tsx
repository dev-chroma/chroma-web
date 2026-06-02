"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Clock,
  Heart,
  ArrowRight,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { PublicArticle } from "@/types/article";

interface HeroProps {
  articles: PublicArticle[];
}

const Hero: React.FC<HeroProps> = ({ articles }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [localArticles, setLocalArticles] = useState<PublicArticle[]>(articles);

  useEffect(() => {
    const loadLocalArticles = async () => {
      await setLocalArticles(articles);
    };

    loadLocalArticles();
  }, [articles]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  }, [articles.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
  }, [articles.length]);

  useEffect(() => {
    if (articles.length <= 1) {
      return;
    }

    const timer = setInterval(handleNext, 8000);

    return () => clearInterval(timer);
  }, [handleNext, articles.length]);

  const article = localArticles[currentIndex];

  if (!article) {
    return null;
  }

  const isLiked =
    !!user && article.likedBy?.some((id) => id.toString() === user._id);

  const handleExplore = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    e.stopPropagation();

    router.push(`/article/${article._id}`);
  };

  return (
    <section className="relative w-full rounded-[2.5rem] overflow-hidden bg-brand-main text-brand-dark group shadow-xl">
      <div
        onClick={() => router.push(`/article/${article._id}`)}
        className="relative cursor-pointer transition-all duration-700"
      >
        <div className="absolute inset-0 bg-linear-to-t from-emerald-950/60 via-brand-main/30 to-transparent z-10" />

        {/* IMAGE CAROUSEL */}

        <div className="relative w-full h-137.5 md:h-162.5 overflow-hidden">
          {localArticles.map((art, index) => (
            <div
              key={art._id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentIndex
                  ? "opacity-80 group-hover:opacity-100"
                  : "opacity-0"
              }`}
            >
              <Image
                src={art.thumbnail || "/placeholder.jpg"}
                alt={art.title}
                fill
                priority={index === 0}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* CONTENT */}

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 z-20">
          <div className="flex items-center gap-4 mb-6">
            <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[8px] font-bold tracking-[0.2em] uppercase border text-white border-white/20">
              Featured{" "}
              {typeof article.category === "string"
                ? article.category
                : article.category?.name}
            </span>

            <div className="flex items-center gap-2 text-[8px] text-cream-50/60 uppercase tracking-[0.2em] font-medium">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime} reading time
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-6 max-w-4xl leading-none line-clamp-1 truncate tracking-tight text-white">
            {article.title}
          </h1>

          <p className="text-md md:text-lg text-white/90 mb-5 max-w-2xl line-clamp-1 truncate md:line-clamp-none font-medium leading-relaxed drop-shadow-md">
            {article.excerpt}
          </p>

          <div className="hidden md:block">
            {/* FOOTER */}

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-t border-white/10 pt-8 md:gap-0 gap-6">
              {/* AUTHOR */}

              <div className="flex items-center gap-5">
                <div className="relative">
                  {article.author.avatar ? (
                    <Image
                      src={article.author.avatar}
                      alt={article.author.firstName}
                      width={56}
                      height={56}
                      className="w-14 h-14 rounded-full border-2 border-white/20 object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full border-2 border-white/20 bg-emerald-800 flex items-center justify-center font-serif font-bold text-white">
                      {article.author.firstName?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}

                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-emerald-950 rounded-full" />
                </div>

                <div>
                  <span className="block text-[10px] text-cream-50/40 uppercase tracking-[0.2em] mb-1 font-bold">
                    Curated By
                  </span>

                  <span className="block font-medium text-xl font-serif text-white">
                    {article.author.firstName} {article.author.surname}
                  </span>
                </div>
              </div>

              {/* ACTIONS */}

              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="flex items-center gap-6 mr-4">
                  {/* LIKE */}

                  <div className="flex items-center gap-2">
                    <Heart
                      className={`w-6 h-6 transition-all duration-300 ${
                        isLiked
                          ? "text-red-500 fill-red-500"
                          : "text-cream-50/40 group-hover/likes:text-red-500 group-hover/likes:fill-red-500"
                      }`}
                    />

                    <span className="font-bold text-lg text-white">
                      {article.likes}
                    </span>
                  </div>

                  {/* VIEWS */}

                  <div className="flex items-center gap-2 text-cream-50/40">
                    <Eye className="w-6 h-6" />

                    <span className="font-bold text-lg text-white">
                      {article.reads || 0}
                    </span>
                  </div>
                </div>

                {/* BUTTON */}

                <button
                  onClick={handleExplore}
                  className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-brand-dark text-cream-50 rounded-full font-bold text-sm tracking-wide hover:bg-brand-accent transition-all hover:translate-x-2 active:scale-95 shadow-lg shadow-black/20"
                >
                  EXPLORE STORY
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTROLS */}

      {articles.length > 1 && (
        <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4 z-30 pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation();

              handlePrev();
            }}
            className="p-4 bg-black/20 backdrop-blur-md outline-none rounded-full text-white hover:bg-black/40 transition-all pointer-events-auto"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();

              handleNext();
            }}
            className="p-4 bg-black/20 backdrop-blur-md outline-none rounded-full text-white hover:bg-black/40 transition-all pointer-events-auto"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* DOTS */}

      {articles.length > 1 && (
        <div className="absolute top-8 right-8 z-30 flex gap-2">
          {articles.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();

                setCurrentIndex(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-8 bg-white" : "w-2 bg-white/20"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Hero;
