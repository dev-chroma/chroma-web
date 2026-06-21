"use client";

import { useEffect, useState } from "react";
import { DashboardArticle } from "@/types/dashboard";
import type { ArticleStatus } from "@/types/article";
import { api } from "@/services/api";

import AdminArticleSearch from "./AdminArticleSearch";
import AdminArticleActions from "./AdminArticleActions";
import { Edit, Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PublicUser } from "@/types/user";

const editorStatusOptions: ArticleStatus[] = ["Editing", "Edited"];

const statusBadgeClass = (status: ArticleStatus) => {
  if (status === "Published") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (status === "Paused") {
    return "bg-blue-100 text-blue-700";
  }

  if (status === "Editing") {
    return "bg-purple-100 text-purple-700";
  }

  if (status === "Edited") {
    return "bg-pink-100 text-pink-700";
  }

  return "bg-amber-100 text-amber-700";
};

interface AdminArticleManagementProps {
  search?: string;
  currentUser?: {
    _id: string;
    firstName: string;
    surname: string;
    role: string;
  };
}

export default function AdminArticleManagement({
  search = "",
  currentUser,
}: AdminArticleManagementProps) {
  const [articles, setArticles] = useState<DashboardArticle[]>([]);
  const [editors, setEditors] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingArticleId, setUpdatingArticleId] = useState<string | null>(
    null,
  );

  const isEditor = currentUser?.role === "Editor";

  useEffect(() => {
    const fetchArticlesAndEditors = async () => {
      try {
        const articlesPromise = api.articles.list({ status: "all" });
        const usersPromise = isEditor
          ? Promise.resolve([])
          : api.users.listByRole("Editor");

        const [articlesData, usersData] = await Promise.all([
          articlesPromise,
          usersPromise,
        ]);

        const fetchedArticles = Array.isArray(articlesData)
          ? articlesData
          : articlesData.articles || [];

        setArticles(fetchedArticles);

        setEditors(usersData);
      } catch (error) {
        console.error("Failed to fetch articles and editors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticlesAndEditors();
  }, [isEditor]);

  const updateArticle = async (
    articleId: string,
    payload: { status?: ArticleStatus; assignedEditor?: string | null },
  ) => {
    setUpdatingArticleId(articleId);

    try {
      const updatedArticle = await api.articles.updateStatus(
        articleId,
        payload,
      );

      setArticles((prev) =>
        prev.map((article) =>
          article._id === articleId
            ? { ...article, ...updatedArticle }
            : article,
        ),
      );
    } catch (error) {
      console.error("Failed to update article:", error);
    } finally {
      setUpdatingArticleId(null);
    }
  };

  const handleAssignEditor = async (articleId: string, editorId: string) => {
    await updateArticle(articleId, {
      assignedEditor: editorId || null,
      status: editorId ? "Editing" : "Pending",
    });
  };

  const handleStatusChange = async (
    articleId: string,
    status: ArticleStatus,
  ) => {
    await updateArticle(articleId, { status });
  };

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.author.firstName.toLowerCase().includes(search.toLowerCase()) ||
      article.author.surname.toLowerCase().includes(search.toLowerCase()) ||
      article.category?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const displayedArticles = isEditor
    ? filteredArticles.filter((article) => {
        const editorId =
          typeof article.assignedEditor === "string"
            ? article.assignedEditor
            : article.assignedEditor?._id;
        return (
          String(editorId) === String(currentUser?._id) &&
          article.status !== "Published"
        );
      })
    : filteredArticles;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader className="w-8 h-8 animate-spin text-emerald-950/20" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[3rem] border border-emerald-950/5 shadow-2xl overflow-hidden">
      {/* HEADER */}

      <div className="p-10 md:p-12 border-b border-emerald-950/5 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <h2 className="text-3xl font-serif font-bold text-emerald-950">
          {isEditor ? "My Assigned Edits" : "Global Article Control"}
        </h2>

        <AdminArticleSearch />
      </div>

      {/* TABLE */}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-emerald-950/2 text-emerald-950/30 text-[10px] uppercase tracking-[0.2em] font-bold">
              <th className="w-[30%] px-12 py-8">Title</th>
              <th className="w-[20%] px-12 py-8">Author</th>
              <th className="w-[15%] px-12 py-8 text-center">Status</th>
              {!isEditor && (
                <th className="w-[20%] px-12 py-8 text-center">
                  Assigned Editor
                </th>
              )}
              <th
                className={`${isEditor ? "w-[35%]" : "w-[15%]"} px-12 py-8 text-center`}
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-emerald-950/5">
            {displayedArticles.map((article) => (
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
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <Link href={`/article/${article._id}`} className="flex-1">
                      <span className="font-serif line-clamp-1 font-bold text-xl text-emerald-950 group-hover:text-emerald-700 transition-colors">
                        {article.title}
                      </span>
                    </Link>
                  </div>
                </td>

                <td className="px-12 py-8 text-sm text-emerald-950/60">
                  {article.author.firstName} {article.author.surname}
                </td>

                <td className="px-12 py-8">
                  <div className="flex justify-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusBadgeClass(article.status)}`}
                    >
                      {article.status}
                    </span>
                  </div>
                </td>

                {!isEditor && (
                  <td className="px-12 py-8">
                    <div className="flex justify-center">
                      <select
                        value={
                          typeof article.assignedEditor === "string"
                            ? article.assignedEditor
                            : article.assignedEditor?._id || ""
                        }
                        onChange={(e) =>
                          handleAssignEditor(article._id, e.target.value)
                        }
                        disabled={updatingArticleId === article._id}
                        className="bg-emerald-950/5 text-emerald-950 border border-emerald-950/10 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-950/10 cursor-pointer"
                      >
                        <option value="">Unassigned</option>
                        {editors.map((editor) => (
                          <option key={editor._id} value={editor._id}>
                            {editor.firstName} {editor.surname}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                )}

                <td className="px-12 py-8">
                  <div className="flex justify-center">
                    {isEditor ? (
                      <div className="flex items-center gap-3">
                        <select
                          value={
                            editorStatusOptions.includes(article.status)
                              ? article.status
                              : "Editing"
                          }
                          onChange={(e) =>
                            handleStatusChange(
                              article._id,
                              e.target.value as ArticleStatus,
                            )
                          }
                          disabled={updatingArticleId === article._id}
                          className="bg-emerald-950/5 text-emerald-950 border border-emerald-950/10 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-950/10 cursor-pointer"
                        >
                          {editorStatusOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>

                        <Link
                          href={`/edit-piece/${article._id}`}
                          className="px-6 py-4 bg-emerald-950 text-cream-50 flex gap-2 items-center rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-emerald-900 transition-all shadow-md active:scale-95 cursor-pointer"
                        >
                          <Edit className="w-4 h-4 inline-block mr-2" />
                          Edit Article
                        </Link>
                      </div>
                    ) : (
                      <AdminArticleActions
                        articleId={article._id}
                        status={article.status}
                        onStatusChange={(newStatus) => {
                          setArticles((prev) =>
                            prev.map((a) =>
                              a._id === article._id
                                ? { ...a, status: newStatus }
                                : a,
                            ),
                          );
                        }}
                        onUpdated={() => {
                          setArticles((prev) =>
                            prev.filter((a) => a._id !== article._id),
                          );
                        }}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="p-10 md:p-12 bg-emerald-950/2 flex justify-between items-center border-t border-emerald-950/5">
        <p className="text-[10px] uppercase tracking-widest font-bold text-emerald-950/30">
          Showing all records
        </p>

        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-xl bg-white border border-emerald-950/5 flex items-center justify-center text-emerald-950 font-bold shadow-sm">
            1
          </button>

          <button className="w-10 h-10 rounded-xl hover:bg-white transition-all flex items-center justify-center text-emerald-950/20 font-bold hover:shadow-sm">
            2
          </button>
        </div>
      </div>
    </div>
  );
}
