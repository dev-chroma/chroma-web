"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { api } from "@/services/api";

import type { DashboardArticle } from "@/types/dashboard";

import { Trash2, Edit, Search } from "lucide-react";

const AdminArticleManagement = () => {
  const router = useRouter();
  const [articles, setArticles] = useState<DashboardArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchArticles = async () => {
    try {
      const data = await api.articles.list();
      setArticles(Array.isArray(data) ? data : data.articles || []);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadArticles = async () => {
      await fetchArticles();
    };

    loadArticles();
  }, []);

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to archive this article? It will be permanently deleted after 7 days.",
      )
    )
      return;
    try {
      await api.articles.delete(id);
      fetchArticles();
    } catch (error) {
      console.error("Failed to archive article:", error);
    }
  };

  if (loading) return <div>Loading articles...</div>;

  return (
    <div className="bg-white rounded-[3rem] border border-emerald-950/5 shadow-2xl overflow-hidden">
      <div className="p-10 md:p-12 border-b border-emerald-950/5 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <h2 className="text-3xl font-serif font-bold text-emerald-950">
          Global Article Control
        </h2>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-950/30" />
          <input
            type="text"
            placeholder="Search all pieces..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-emerald-950/5 border-none rounded-xl py-3 pl-12 pr-6 text-sm font-medium w-64 outline-none focus:ring-2 focus:ring-emerald-950/10 transition-all"
          />
        </div>
      </div>
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
            {articles
              .filter(
                (article) =>
                  article.title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  article.author.firstName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  article.author.surname
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  article.category?.name
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()),
              )
              .map((a) => (
                <tr
                  key={a._id}
                  className="hover:bg-emerald-950/1 transition-all"
                >
                  <td className="px-12 py-8 font-serif font-bold text-emerald-950">
                    {a.title}
                  </td>
                  <td className="px-12 py-8 text-sm text-emerald-950/60">
                    {a.author.firstName} {a.author.surname}
                  </td>
                  <td className="px-12 py-8">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        a.status === "Published"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-amber-100 text-amber-600"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="px-12 py-8 flex gap-4">
                    <button
                      onClick={() => router.push(`/edit-piece/${a._id}`)}
                      className="p-2 hover:bg-emerald-50 text-emerald-950/40 hover:text-emerald-950 rounded-lg transition-colors"
                      title="Edit Submission"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(a._id)}
                      className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                      title="Archive Piece"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminArticleManagement;
