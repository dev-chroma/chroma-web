"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader } from "lucide-react";

import AdminArticleSearch from "./AdminArticleSearch";
import AdminArticleRecoverActions from "./AdminArticleRecoverActions";

import { DashboardArticle } from "@/types/dashboard";
import { useRouter } from "next/navigation";

interface Props {
  search?: string;
}

export default function AdminArticleRecover({ search = "" }: Props) {
  const [articles, setArticles] = useState<DashboardArticle[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("/api/articles/recovery");
        const data = await res.json();

        setArticles(data.articles || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleRecover = async (id: string) => {
    try {
      await fetch(`/api/articles/recovery/${id}`, {
        method: "PATCH",
      });

      setArticles((prev) => prev.filter((article) => article._id !== id));
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Permanently delete this article?");

    if (!confirmed) {
      return;
    }

    try {
      await fetch(`/api/articles/recovery/${id}`, {
        method: "DELETE",
      });

      setArticles((prev) => prev.filter((article) => article._id !== id));
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.author.firstName.toLowerCase().includes(search.toLowerCase()) ||
      article.author.surname.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader className="w-8 h-8 animate-spin text-emerald-950/20" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[3rem] border border-emerald-950/5 shadow-2xl overflow-hidden">
      <div className="p-10 md:p-12 border-b border-emerald-950/5 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <h2 className="text-3xl font-serif font-bold text-emerald-950">
          Recovery Center
        </h2>

        <AdminArticleSearch />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-emerald-950/2 text-emerald-950/30 text-[10px] uppercase tracking-[0.2em] font-bold">
              <th className="px-12 py-8">Title</th>
              <th className="px-12 py-8">Author</th>
              <th className="px-12 py-8 text-center">Type</th>
              <th className="px-12 py-8 text-center">Deleted</th>
              <th className="px-12 py-8 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-emerald-950/5">
            {filteredArticles.map((article) => (
              <tr
                key={article._id}
                className="group hover:bg-emerald-700/5 transition-colors cursor-pointer"
              >
                <td className="px-12 py-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-emerald-950/5 relative shrink-0">
                      <Image
                        src={article.thumbnail || "/placeholder.jpg"}
                        alt={article.title}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>

                    <span className="font-serif font-bold text-lg text-emerald-950">
                      {article.title}
                    </span>
                  </div>
                </td>

                <td className="px-12 py-8 text-sm text-emerald-950/60">
                  {article.author.firstName} {article.author.surname}
                </td>

                <td className="px-12 py-8">
                  <div className="flex items-center justify-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        article.deletedAt
                          ? "bg-red-100 text-red-600"
                          : "bg-amber-100 text-amber-600"
                      }`}
                    >
                      {article.deletedAt ? "Deleted" : "Draft"}
                    </span>
                  </div>
                </td>

                <td className="px-12 py-8 text-sm text-emerald-950/60">
                  <div className="flex items-center justify-center">
                    {article.deletedAt
                      ? new Date(article.deletedAt).toLocaleDateString()
                      : "-"}
                  </div>
                </td>

                <td className="px-12 py-8">
                  <div className="flex items-center justify-center">
                    <AdminArticleRecoverActions
                      articleId={article._id}
                      onRecover={handleRecover}
                      onDelete={handleDelete}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
