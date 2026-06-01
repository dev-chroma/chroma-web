"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Send, Book, Target, Type, X, ImageIcon, PenTool } from "lucide-react";
import { api } from "@/services/api";

import type {
  PublicArticle,
  CreateArticlePayload,
  UpdateArticlePayload,
} from "@/types/article";
import type { Category } from "@/types/category";

interface ArticleEditorFormProps {
  categories: Category[];
  article?: PublicArticle;
  isEdit?: boolean;
}

interface FormDataState {
  title: string;
  excerpt: string;
  body: string;
  category: string;
  thumbnail: string;
  thumbnailPublicId: string;
}

function calculateReadTime(text: string, wpm = 225) {
  const cleanText = text.trim();

  if (!cleanText) {
    return 0;
  }

  const wordCount = cleanText.split(/\s+/).length;

  return Math.ceil(wordCount / wpm);
}

export default function ArticleEditorForm({
  categories,
  article,
  isEdit = false,
}: ArticleEditorFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormDataState>({
    title: article?.title || "",
    excerpt: article?.excerpt || "",
    body: article?.content || "",
    category: article?.category?._id || "",
    thumbnail: article?.thumbnail || "",
    thumbnailPublicId: "",
  });

  const readTime = calculateReadTime(formData.body);
  const wordCount = formData.body.trim()
    ? formData.body.trim().split(/\s+/).length
    : 0;

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    URL.revokeObjectURL(previewUrl);

    setFormData((prev) => ({
      ...prev,
      thumbnail: previewUrl,
    }));

    try {
      setImageUploading(true);

      // delete old image first
      if (formData.thumbnailPublicId) {
        await fetch("/api/upload/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            publicId: formData.thumbnailPublicId,
          }),
        });
      }

      const uploadData = new FormData();

      uploadData.append("thumbnail", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setFormData((prev) => ({
        ...prev,
        thumbnail: data.url,
        thumbnailPublicId: data.publicId,
      }));
    } catch (error) {
      console.error(error);

      setError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setImageUploading(true);

      if (formData.thumbnailPublicId) {
        await fetch("/api/upload/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            publicId: formData.thumbnailPublicId,
          }),
        });
      }

      setFormData((prev) => ({
        ...prev,
        thumbnail: "",
        thumbnailPublicId: "",
      }));
    } finally {
      setImageUploading(false);
    }
  };

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
        readTime: `${readTime} min`,
      };

      if (isEdit && article?._id) {
        await api.articles.update(article._id, payload as UpdateArticlePayload);
      } else {
        console.log("SUBMIT PAYLOAD:", payload);
        await api.articles.create(payload as CreateArticlePayload);
      }
      router.replace("/dashboard");
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Submission failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 py-24">
      <div className="container mx-auto px-4">
        {/* HEADER */}

        <header className="mb-16">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1.5 h-6 bg-emerald-950 rounded-full" />

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-950/40">
              {isEdit ? "Refining Creation" : "New Creation"}
            </span>
          </div>

          <div className="flex items-center gap-5">
            <div className="w-18 h-18 rounded-4xl bg-emerald-950 text-cream-50 flex items-center justify-center shadow-2xl shadow-emerald-950/20">
              <PenTool className="w-8 h-8" />
            </div>

            <div>
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-emerald-950 leading-tight">
                {isEdit ? "Refine Your Masterpiece" : "Draft Your Masterpiece"}
              </h1>

              <p className="text-emerald-950/40 italic text-lg mt-2">
                Every unforgettable story begins with a single line.
              </p>
            </div>
          </div>
        </header>

        {/* ERROR */}

        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-500/10 text-red-600 rounded-3xl text-sm font-bold">
            {error}
          </div>
        )}

        {/* FORM */}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* TITLE + CATEGORY */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* TITLE */}

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

            {/* CATEGORY */}

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

          {/* EXCERPT */}

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
              className="w-full min-h-30 bg-transparent outline-none resize-none text-lg"
            />
          </div>

          {/* THUMBNAIL */}

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
                  fill
                  className="object-cover"
                />

                {/*Loading */}
                {imageUploading && (
                  <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />

                    <p className="mt-4 text-white text-xs font-bold uppercase tracking-[0.3em]">
                      Uploading...
                    </p>
                  </div>
                )}

                {/* OVERLAY */}

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

                {/* REMOVE */}

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-red-500 transition-all flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <label className="group relative flex flex-col items-center justify-center h-72 border-2 border-dashed border-emerald-950/10 rounded-4xl cursor-pointer overflow-hidden transition-all hover:border-emerald-950/30 hover:bg-emerald-950/2">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute inset-y-0 left-[-40%] w-[30%] animate-[uploadShimmer_2.5s_infinite] bg-linear-to-r from-transparent via-emerald-500/10 to-transparent blur-2xl rotate-12" />
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-3xl bg-emerald-950/5 flex items-center justify-center mb-6 shadow-inner">
                    <ImageIcon className="w-10 h-10 text-emerald-950/30" />
                  </div>

                  <span className="text-xl font-serif font-bold text-emerald-950 mb-2">
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

          {/* CONTENT */}

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
              className="w-full min-h-175 resize-none bg-transparent outline-none text-lg leading-relaxed"
            />

            {/* WRITING STATS */}

            <div className="mt-8 pt-6 border-t border-emerald-950/5 flex items-center justify-between">
              <div>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-emerald-950/40 font-bold mb-1">
                  Word Count
                </span>

                <span className="text-2xl font-serif font-bold text-emerald-950">
                  {wordCount.toLocaleString()}
                </span>
              </div>

              <div className="text-right">
                <span className="block text-[10px] uppercase tracking-[0.2em] text-emerald-950/40 font-bold mb-1">
                  Read Time
                </span>

                <span className="text-2xl font-serif font-bold text-emerald-950">
                  {readTime} min
                </span>
              </div>
            </div>
          </div>

          {/* SUBMIT */}

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="px-20 py-6 bg-emerald-950 text-white rounded-full flex items-center gap-4 disabled:opacity-50 shadow-2xl shadow-emerald-950/20 hover:scale-105 transition-all"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />

                  {isEdit ? "UPDATE WORK" : "SUBMIT FOR REVIEW"}
                </>
              )}
            </button>
          </div>
        </form>
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
    </div>
  );
}
