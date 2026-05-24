"use client";

import { useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";

import Hero from "@/components/Hero";

import { api } from "@/services/api";

import type {
  PublicArticle,
  ArticlesResponse,
  ArticleQueryParams,
} from "@/types/article";
import ArticleCard from "@/components/ArticleCard";
import Sidebar from "@/components/Sidebar";

const HomePage = () => {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get("category");
  const [articles, setArticles] = useState<PublicArticle[]>([]);
  const [trendingArticles, setTrendingArticles] = useState<PublicArticle[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const params: ArticleQueryParams = {
          status: "Published",
        };

        if (categoryFilter) {
          params.category = categoryFilter;
        }

        const data: ArticlesResponse = await api.articles.list(params);

        setArticles(data.articles || []);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      }
    };

    fetchArticles();
  }, [categoryFilter]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data: ArticlesResponse = await api.articles.list({
          status: "Published",

          sortBy: "likes",

          limit: 3,
        });

        setTrendingArticles(data.articles || []);
      } catch (error) {
        console.error("Failed to fetch trending articles:", error);
      }
    };

    fetchTrending();
  }, []);

  if (articles.length === 0) {
    return (
      <div className="min-h-screen py-32 flex flex-col items-center justify-center bg-cream-50 text-center px-4">
        <h2 className="text-4xl font-serif font-bold text-emerald-950 mb-4">
          The Library is Quiet...
        </h2>

        <p className="text-emerald-950/60 font-bold mb-12 max-w-md italic uppercase tracking-widest text-xs">
          Currently, no masterpieces have been published. Check back soon!
        </p>

        <button
          onClick={() => window.location.reload()}
          className="px-10 py-4 bg-emerald-950 text-cream-50 rounded-full font-bold text-[10px] tracking-[0.3em] uppercase hover:bg-emerald-900 transition-all shadow-2xl shadow-emerald-950/20 active:scale-95"
        >
          Refresh Chronicles
        </button>
      </div>
    );
  }

  return (
    <div className="font-sans selection:bg-emerald-950 selection:text-white">
      <main className="container mx-auto px-4 py-12 md:py-8">
        {/* HERO */}

        {!categoryFilter && articles.length > 0 && (
          <div className="mb-24 md:mb-32">
            <Hero articles={articles.slice(0, 3)} />
          </div>
        )}

        {/* CONTENT */}

        <div className="flex flex-col lg:flex-row gap-20 xl:gap-32">
          {/* MAIN */}

          <div className="lg:w-2/3">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6">
              <div>
                <h2 className="text-4xl font-serif font-bold text-emerald-950 mb-2">
                  {categoryFilter
                    ? `${categoryFilter} Collection`
                    : "Latest Masterpieces"}
                </h2>

                <div className="h-1.5 w-20 bg-emerald-950 rounded-full" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 xl:gap-20">
              {articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>

            <div className="mt-24 flex justify-center">
              <button className="group px-16 py-5 bg-white border border-emerald-950/10 text-emerald-950 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-950 hover:text-cream-50 transition-all duration-500 shadow-xl shadow-emerald-950/5 active:scale-95">
                LOAD MORE
                <span className="text-emerald-950/30 group-hover:text-cream-50/30 transition-colors ml-2">
                  CHRONICLES
                </span>
              </button>
            </div>
          </div>

          {/* SIDEBAR */}

          <div className="lg:w-1/3">
            <Sidebar trendingArticles={trendingArticles} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
