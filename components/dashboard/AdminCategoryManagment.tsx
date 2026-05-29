"use client";

import { useEffect, useState } from "react";
import { Tag, Plus, Loader, Pencil, Trash2, Check, X } from "lucide-react";
import { api } from "@/services/api";
import type { Category } from "@/types/category";

const AdminCategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const fetchCategories = async () => {
    try {
      const data = await api.categories.list();
      setCategories(data.categories || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      await fetchCategories();
    };

    loadCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newCategoryName.trim()) return;
    try {
      setCreating(true);
      await api.categories.create({
        name: newCategoryName,
      });

      setNewCategoryName("");
      fetchCategories();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create category",
      );
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this category?");
    if (!confirmed) return;

    try {
      await api.categories.delete(id);
      setCategories((prev) => prev.filter((category) => category._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category._id);
    setEditName(category.name);
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const updated = await api.categories.update(id, {
        name: editName,
      });

      setCategories((prev) =>
        prev.map((category) => (category._id === id ? updated : category)),
      );

      setEditingId(null);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader className="w-8 h-8 animate-spin text-emerald-950/20" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* CREATE */}
      <div className="bg-white p-10 rounded-[3rem] border border-emerald-950/5 shadow-2xl">
        <h2 className="text-2xl font-serif font-bold mb-8">Create Category</h2>
        <form onSubmit={handleAddCategory} className="flex gap-4">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category name..."
            className="flex-1 bg-emerald-950/5 rounded-2xl px-6 py-5 outline-none"
          />

          <button
            type="submit"
            disabled={creating || !newCategoryName.trim()}
            className="px-10 py-5 bg-emerald-950 text-cream-50 rounded-2xl font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-emerald-900 transition-all shadow-xl shadow-emerald-950/20 flex items-center justify-center gap-4 disabled:opacity-50 active:scale-95"
          >
            {creating ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Add Category
          </button>
        </form>

        {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
      </div>

      {/* LIST */}

      <div className="bg-white rounded-[3rem] border border-emerald-950/5 shadow-2xl overflow-hidden">
        <div className="p-10 border-b border-emerald-950/5">
          <h3 className="text-3xl font-serif font-bold">Categories</h3>
        </div>

        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category._id}
              className="p-8 rounded-4xl border border-emerald-950/5 bg-emerald-950/2"
            >
              <div className="flex items-center justify-between mb-6">
                <Tag className="w-5 h-5 text-emerald-950/40" />

                <div className="flex items-center gap-2">
                  {editingId === category._id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(category._id)}
                        className="p-2 rounded-xl hover:bg-emerald-100"
                      >
                        <Check className="w-4 h-4 text-emerald-600" />
                      </button>

                      <button
                        onClick={() => setEditingId(null)}
                        className="p-2 rounded-xl hover:bg-red-100"
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-2 rounded-xl hover:bg-blue-100"
                      >
                        <Pencil className="w-4 h-4 text-blue-500" />
                      </button>

                      <button
                        onClick={() => handleDelete(category._id)}
                        className="p-2 rounded-xl hover:bg-red-100"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {editingId === category._id ? (
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-white rounded-xl px-4 py-3 outline-none border border-emerald-950/10"
                />
              ) : (
                <>
                  <h4 className="text-xl font-serif font-bold">
                    {category.name}
                  </h4>

                  <p className="text-xs uppercase tracking-widest opacity-40 mt-2">
                    /{category.slug}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCategoryManagement;
