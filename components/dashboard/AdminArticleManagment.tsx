"use client";

import { useEffect, useState } from "react";

import { DashboardArticle } from "@/types/dashboard";

import { api } from "@/services/api";

import AdminArticleSearch from "./AdminArticleSearch";
import AdminArticleActions from "./AdminArticleActions";

interface AdminArticleManagementProps {
  search?: string;
}

export default function AdminArticleManagement({
  search = "",
}: AdminArticleManagementProps) {
  const [articles, setArticles] = useState<DashboardArticle[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await api.articles.list();

        const fetchedArticles = Array.isArray(data)
          ? data
          : data.articles || [];

        setArticles(fetchedArticles);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.author.firstName.toLowerCase().includes(search.toLowerCase()) ||
      article.author.surname.toLowerCase().includes(search.toLowerCase()) ||
      article.category?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="bg-white rounded-[3rem] border border-emerald-950/5 shadow-2xl p-16 text-center">
        <div className="w-12 h-12 border-4 border-emerald-950/10 border-t-emerald-950 rounded-full animate-spin mx-auto mb-6" />

        <p className="text-sm font-bold uppercase tracking-widest text-emerald-950/40">
          Loading Articles...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[3rem] border border-emerald-950/5 shadow-2xl overflow-hidden">
      {/* HEADER */}

      <div className="p-10 md:p-12 border-b border-emerald-950/5 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <h2 className="text-3xl font-serif font-bold text-emerald-950">
          Global Article Control
        </h2>

        <AdminArticleSearch />
      </div>

      {/* TABLE */}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-emerald-950/2 text-emerald-950/30 text-[10px] uppercase tracking-[0.2em] font-bold">
              <th className="px-12 py-8">Title</th>

              <th className="px-12 py-8">Author</th>

              <th className="px-12 py-8">Status</th>

              <th className="px-12 py-8">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-emerald-950/5">
            {filteredArticles.map((article) => (
              <tr
                key={article._id}
                className="hover:bg-emerald-950/1 transition-all"
              >
                <td className="px-12 py-8 font-serif font-bold text-emerald-950">
                  {article.title}
                </td>

                <td className="px-12 py-8 text-sm text-emerald-950/60">
                  {article.author.firstName} {article.author.surname}
                </td>

                <td className="px-12 py-8">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      article.status === "Published"
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-amber-100 text-amber-600"
                    }`}
                  >
                    {article.status}
                  </span>
                </td>

                <td className="px-12 py-8 flex gap-4">
                  <AdminArticleActions articleId={article._id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
