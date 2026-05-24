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
import { Image as ImageIcon } from "lucide-react";
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
          {/* TITLE + CATEGORY */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-emerald-950/5 shadow-xl">
              <input
                type="text"
                placeholder="Enter title..."
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                className="w-full bg-transparent outline-none text-2xl font-serif font-bold"
                required
              />
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-emerald-950/5 shadow-xl">
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                className="w-full bg-transparent outline-none text-xl font-serif font-bold"
                required
              >
                <option value="">Choose Category</option>

                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* EXCERPT */}

          <textarea
            value={formData.excerpt}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                excerpt: e.target.value,
              }))
            }
            placeholder="Write excerpt..."
            className="w-full min-h-30 rounded-3xl p-8"
            required
          />

          {/* IMAGE */}

          <div className="bg-white rounded-3xl p-8">
            {formData.thumbnail ? (
              <div className="relative aspect-video rounded-3xl overflow-hidden">
                <Image
                  src={formData.thumbnail}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <label className="flex items-center justify-center h-48 border-2 border-dashed rounded-3xl cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />

                <ImageIcon className="w-8 h-8" />
              </label>
            )}
          </div>

          {/* CONTENT */}

          <textarea
            value={formData.body}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                body: e.target.value,
              }))
            }
            placeholder="Write article..."
            className="w-full min-h-125 rounded-[3rem] p-12"
            required
          />

          {/* SUBMIT */}

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="px-16 py-5 rounded-full bg-emerald-950 text-white font-bold"
            >
              {isLoading
                ? "Submitting..."
                : id
                  ? "UPDATE WORK"
                  : "SUBMIT FOR REVIEW"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitArticle;
