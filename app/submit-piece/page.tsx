"use client";

import {
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  FormEvent,
} from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { Book, Image as ImageIcon, Send, Target, Type } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import type { Category } from "@/types/category";
import type {
  PublicArticle,
  CreateArticlePayload,
  UpdateArticlePayload,
} from "@/types/article";

interface FormDataState {
  title: string;
  excerpt: string;
  body: string;
  category: string;
  thumbnail: string;
}

const SubmitArticle = () => {
  const router = useRouter();
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : undefined;
  const { user, loading: authLoading } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormDataState>({
    title: "",
    excerpt: "",
    body: "",
    category: "",
    thumbnail: "",
  });

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
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

  const fetchCategories = useCallback(async () => {
    try {
      const data = await api.categories.list();

      setCategories(data.categories || []);
    } catch (error: unknown) {
      console.error("Failed to fetch categories:", error);
    }
  }, []);

  const fetchArticle = useCallback(async () => {
    if (!id || !user) return;

    try {
      const article: PublicArticle = await api.articles.getOne(id);

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
    } catch (error: unknown) {
      console.error("Failed to fetch article:", error);
      router.push("/dashboard");
    }
  }, [id, user, router]);

  useEffect(() => {
    const loadCategories = async () => {
      await fetchCategories();
    };

    loadCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!authLoading && user && id) {
      const loadArticle = async () => {
        await fetchArticle();
      };
      loadArticle();
    }
  }, [authLoading, user, id, fetchArticle]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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

      if (id) {
        await api.articles.update(id, payload as UpdateArticlePayload);
      } else {
        await api.articles.create(payload as CreateArticlePayload);
      }

      router.push("/dashboard");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Submission failed");
      }
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
        {/* HEADER */}

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

        {/* ERROR */}

        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-500/10 text-red-600 rounded-3xl text-sm font-bold">
            {error}
          </div>
        )}

        {/* FORM */}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* TOP GRID */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* TITLE */}

            <div className="bg-white p-8 rounded-[2.5rem] border border-emerald-950/5 shadow-xl shadow-emerald-950/5 space-y-4">
              <div className="flex items-center gap-3 text-emerald-950/40">
                <Type className="w-4 h-4" />

                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Title of your work
                </span>
              </div>

              <input
                type="text"
                placeholder="Enter a compelling title..."
                className="w-full bg-transparent border-none p-0 text-2xl font-serif font-bold text-emerald-950 placeholder:text-emerald-950/10 outline-none"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                required
              />
            </div>

            {/* CATEGORY */}

            <div className="bg-white p-8 rounded-[2.5rem] border border-emerald-950/5 shadow-xl shadow-emerald-950/5 space-y-4">
              <div className="flex items-center gap-3 text-emerald-950/40">
                <Target className="w-4 h-4" />

                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Select Realm
                </span>
              </div>

              <select
                className="w-full bg-transparent border-none p-0 text-xl font-serif font-bold text-emerald-950 outline-none appearance-none cursor-pointer"
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                required
              >
                <option value="" disabled>
                  Choose Category...
                </option>

                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* EXCERPT */}

          <div className="bg-white p-10 rounded-[3rem] border border-emerald-950/5 shadow-xl shadow-emerald-950/5 space-y-4">
            <div className="flex items-center gap-3 text-emerald-950/40">
              <Book className="w-4 h-4" />

              <span className="text-[10px] font-bold uppercase tracking-widest">
                Brief Summary (Excerpt)
              </span>
            </div>

            <textarea
              placeholder="Write a short summary that entices readers..."
              className="w-full bg-transparent border-none p-0 text-lg font-medium text-emerald-950/60 placeholder:text-emerald-950/10 outline-none min-h-25 resize-none"
              value={formData.excerpt}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  excerpt: e.target.value,
                }))
              }
              required
            />
          </div>

          {/* IMAGE */}

          <div className="bg-white p-10 rounded-[3rem] border border-emerald-950/5 shadow-xl shadow-emerald-950/5 space-y-4">
            <div className="flex items-center gap-3 text-emerald-950/40">
              <ImageIcon className="w-4 h-4" />

              <span className="text-[10px] font-bold uppercase tracking-widest">
                Cover Image
              </span>
            </div>

            <div className="relative">
              {formData.thumbnail ? (
                <div className="relative rounded-2xl overflow-hidden aspect-video group">
                  <div className="relative w-full h-full min-h-75">
                    <Image
                      src={formData.thumbnail}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="absolute inset-0 bg-emerald-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          thumbnail: "",
                        }))
                      }
                      className="px-6 py-2 bg-white text-emerald-950 rounded-full font-bold text-[10px] uppercase tracking-widest"
                    >
                      Change Image
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-emerald-950/10 rounded-2xl cursor-pointer hover:border-emerald-950/20 hover:bg-emerald-950/2 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon className="w-8 h-8 text-emerald-950/20 mb-3" />

                    <p className="text-xs font-bold text-emerald-950/40 uppercase tracking-widest">
                      Select Image
                    </p>

                    <p className="text-[10px] text-emerald-950/20 mt-2 font-medium">
                      JPEG, PNG or WebP (Max 5MB)
                    </p>
                  </div>

                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
          </div>

          {/* BODY */}

          <div className="bg-white p-12 rounded-[4rem] border border-emerald-950/5 shadow-2xl shadow-emerald-950/5 space-y-6">
            <div className="flex items-center justify-between border-b border-emerald-950/5 pb-6">
              <div className="flex items-center gap-3 text-emerald-950/40">
                <PenTool className="w-4 h-4" />

                <span className="text-[10px] font-bold uppercase tracking-widest italic">
                  The Chronicle
                </span>
              </div>

              <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-950/20">
                {formData.body.split(/\s+/).filter(Boolean).length} Words
              </div>
            </div>

            <textarea
              placeholder="Let your soul flow onto the digital parchment..."
              className="w-full bg-transparent border-none p-0 text-xl font-medium leading-relaxed text-emerald-950 placeholder:text-emerald-950/5 outline-none min-h-125 resize-none"
              value={formData.body}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  body: e.target.value,
                }))
              }
              required
            />
          </div>

          {/* SUBMIT */}

          <div className="flex justify-center pt-8">
            <button
              type="submit"
              disabled={isLoading}
              className="group px-20 py-6 bg-emerald-950 text-cream-50 rounded-full font-bold text-sm tracking-[0.3em] hover:bg-emerald-900 transition-all shadow-2xl shadow-emerald-950/40 flex items-center gap-6 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-cream-50/20 border-t-cream-50 rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />

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

const PenTool = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 19 7-7 3 3-7 7-3-3Z" />

    <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5Z" />

    <path d="m2 2 5 5" />

    <path d="m8.5 8.5 1 1" />
  </svg>
);

export default SubmitArticle;
