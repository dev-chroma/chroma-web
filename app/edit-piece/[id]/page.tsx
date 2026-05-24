"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Send, Book, Target, Type, X, ImageIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import type {
  PublicArticle,
  CreateArticlePayload,
  UpdateArticlePayload,
} from "@/types/article";
import type { Category } from "@/types/category";
import Image from "next/image";

interface SubmitFormData {
  title: string;

  excerpt: string;

  body: string;

  category: string;

  thumbnail: string;
}

const SubmitArticlePage = () => {
  const router = useRouter();

  const params = useParams();

  const id = typeof params?.id === "string" ? params.id : undefined;

  const { user, loading: authLoading } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState<SubmitFormData>({
    title: "",
    excerpt: "",
    body: "",
    category: "",
    thumbnail: "",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");

      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        thumbnail: reader.result as string,
      }));
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.categories.list();

        setCategories(data.categories || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id || !user) return;

      try {
        const article = await api.articles.getOne(id);

        setFormData({
          title: article.title || "",
          excerpt: article.excerpt || "",
          body: article.content || "",
          category: article.category?._id || "",
          thumbnail: article.thumbnail || "",
        });

        const isAuthor = article.author._id === user._id;

        const isAdmin = user.role === "Admin" || user.role === "Editor";

        if (!isAuthor && !isAdmin) {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Failed to fetch article:", error);

        router.push("/dashboard");
      }
    };

    if (!authLoading && user) {
      fetchArticle();
    }
  }, [id, user, authLoading, router]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    setError("");

    try {
      const payload: CreateArticlePayload | UpdateArticlePayload = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.body,
        category: formData.category,
        thumbnail: formData.thumbnail,
      };

      let response: PublicArticle | null = null;

      if (id) {
        response = await api.articles.update(
          id,
          payload as UpdateArticlePayload,
        );
      } else {
        response = await api.articles.create(payload as CreateArticlePayload);
      }

      if (response) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);

      setError(error instanceof Error ? error.message : "Submission failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-cream-50 py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-6 bg-emerald-950 rounded-full" />

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-950/40">
              {id ? "Modifying Creation" : "New Creation"}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-bold text-emerald-950">
            {id ? "Refine Your Masterpiece" : "Draft Your Masterpiece"}
          </h1>
        </header>

        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-500/10 text-red-600 rounded-3xl text-sm font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title + Category */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-emerald-950/5 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <Type className="w-4 h-4 text-emerald-950/40" />

                <span className="text-[10px] uppercase tracking-widest text-emerald-950/40">
                  Title
                </span>
              </div>

              <input
                type="text"
                required
                placeholder="Enter title..."
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                className="w-full bg-transparent outline-none text-2xl font-serif font-bold"
              />
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-emerald-950/5 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-4 h-4 text-emerald-950/40" />

                <span className="text-[10px] uppercase tracking-widest text-emerald-950/40">
                  Category
                </span>
              </div>

              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                className="w-full bg-transparent outline-none text-xl font-serif font-bold"
              >
                <option value="">Select Category</option>

                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Excerpt */}

          <div className="bg-white p-10 rounded-[3rem] border border-emerald-950/5 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <Book className="w-4 h-4 text-emerald-950/40" />

              <span className="text-[10px] uppercase tracking-widest text-emerald-950/40">
                Excerpt
              </span>
            </div>

            <textarea
              required
              placeholder="Short summary..."
              value={formData.excerpt}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  excerpt: e.target.value,
                }))
              }
              className="w-full min-h-30 bg-transparent outline-none resize-none"
            />
          </div>

          {/* Thumbnail */}

          {/* Thumbnail */}

          <div className="bg-white p-10 rounded-[3rem] border border-emerald-950/5 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <ImageIcon className="w-4 h-4 text-emerald-950/40" />

              <span className="text-[10px] uppercase tracking-widest text-emerald-950/40">
                Cover Image
              </span>
            </div>

            {formData.thumbnail ? (
              <div className="relative rounded-4xl overflow-hidden aspect-video group">
                <Image
                  src={formData.thumbnail}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  fill
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <label className="cursor-pointer">
                    <div className="px-6 py-3 rounded-full bg-white/90 backdrop-blur-md text-emerald-950 font-bold text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all">
                      Change Image
                    </div>

                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      thumbnail: "",
                    }))
                  }
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-red-500 transition-all flex items-center justify-center text-lg font-bold"
                >
                  <X />
                </button>
              </div>
            ) : (
              <label className="group relative flex flex-col items-center justify-center h-64 border-2 border-dashed border-emerald-950/10 rounded-4xl cursor-pointer overflow-hidden transition-all hover:border-emerald-950/30 hover:bg-emerald-950/2">
                {/* Animated bg */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute inset-y-0 left-[-40%] w-[30%] animate-[uploadShimmer_2.5s_infinite] bg-linear-to-r from-transparent via-emerald-500/10 to-transparent blur-2xl rotate-12" />
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-3xl bg-emerald-950/5 flex items-center justify-center mb-6 shadow-inner">
                    <ImageIcon className="w-10 h-10 text-emerald-950/30" />
                  </div>

                  <span className="text-lg font-serif font-bold text-emerald-950 mb-2">
                    Upload Cover Image
                  </span>

                  <span className="text-sm text-emerald-950/40">
                    PNG, JPG, WEBP up to 5MB
                  </span>
                </div>

                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>

          <style jsx>{`
            @keyframes uploadShimmer {
              0% {
                transform: translateX(-200%) rotate(12deg);
              }

              100% {
                transform: translateX(500%) rotate(12deg);
              }
            }
          `}</style>

          {/* Content */}

          <div className="bg-white p-12 rounded-[4rem] border border-emerald-950/5 shadow-2xl">
            <textarea
              required
              placeholder="Write your masterpiece..."
              value={formData.body}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  body: e.target.value,
                }))
              }
              className="w-full min-h-125 resize-none bg-transparent outline-none text-lg leading-relaxed"
            />
          </div>

          {/* Submit */}

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="px-20 py-6 bg-emerald-950 text-white rounded-full flex items-center gap-4 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />

                  {id ? "UPDATE WORK" : "SUBMIT FOR REVIEW"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitArticlePage;
