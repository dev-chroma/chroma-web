import {
  ArticleQueryParams,
  ArticlesResponse,
  CreateArticlePayload,
  PublicArticle,
  UpdateArticleStatusPayload,
  ArticleStatus,
  UpdateArticlePayload,
} from "@/types/article";
import { AuthResponse, LoginPayload, RegisterPayload } from "@/types/auth";
import { PublicUser, UpdateProfilePayload, UserRole } from "@/types/user";
import type { AdminStats } from "@/types/admin";
import {
  ContactPayload,
  NewsletterPayload,
  PublicResponse,
} from "@/types/public";
import {
  CategoriesResponse,
  Category,
  CreateCategoryPayload,
  CreateTagPayload,
  Tag,
  TagsResponse,
  UpdateCategoryPayload,
} from "@/types/category";

const BASE_URL = "/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  auth: {
    register: async (data: RegisterPayload): Promise<AuthResponse> =>
      fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Registration failed");
        return data;
      }),

    login: async (data: LoginPayload): Promise<AuthResponse> =>
      fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Login failed");
        return data;
      }),
  },

  users: {
    getMe: async (): Promise<PublicUser> => {
      const res = await fetch(`${BASE_URL}/users/me`, {
        headers: getHeaders(),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch profile");
      return data;
    },

    updateMe: async (data: UpdateProfilePayload): Promise<PublicUser> => {
      const res = await fetch(`${BASE_URL}/users/me`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });

      const response = await res.json();
      if (!res.ok)
        throw new Error(response.message || "Failed to update profile");

      return response;
    },

    getPublicProfile: async (id: string): Promise<PublicUser> => {
      const res = await fetch(`${BASE_URL}/users/public/${id}`, {
        headers: getHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch profile");
      }

      return data;
    },

    listAll: async (): Promise<PublicUser[]> => {
      const res = await fetch(`${BASE_URL}/users`, {
        headers: getHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }

      return data;
    },
    listByRole: async (role: UserRole): Promise<PublicUser[]> => {
      const res = await fetch(`${BASE_URL}/users?role=${encodeURIComponent(role)}`, {
        headers: getHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }

      return data;
    },
    updateRole: async (id: string, role: UserRole): Promise<PublicUser> => {
      const res = await fetch(`${BASE_URL}/users/${id}/role`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update role");
      }

      return data;
    },
    delete: async (id: string): Promise<void> => {
      const res = await fetch(`${BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete user");
      }
    },
  },

  articles: {
    list: async (
      params: ArticleQueryParams = {},
    ): Promise<ArticlesResponse> => {
      const query = new URLSearchParams(
        params as Record<string, string>,
      ).toString();

      const res = await fetch(`${BASE_URL}/articles?${query}`, {
        headers: getHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch articles");
      }

      return data;
    },

    getOne: (id: string): Promise<PublicArticle> =>
      fetch(`${BASE_URL}/articles/${id}`, {
        headers: getHeaders(),
      }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Article not found");
        return data;
      }),

    getMyArticles: async (): Promise<ArticlesResponse> =>
      fetch(`${BASE_URL}/articles/my-articles`, {
        headers: getHeaders(),
      }).then(async (res) => {
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Failed to fetch your articles");
        return data;
      }),

    create: async (data: CreateArticlePayload): Promise<PublicArticle> => {
      const res = await fetch(`${BASE_URL}/articles`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      const response = await res.json();
      if (!res.ok)
        throw new Error(response.message || "Failed to create article");
      return response;
    },

    update: async (
      id: string,
      data: UpdateArticlePayload,
    ): Promise<PublicArticle> =>
      fetch(`${BASE_URL}/articles/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
      }).then((res) => res.json()),

    delete: (id: string) =>
      fetch(`${BASE_URL}/articles/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      }).then((res) => res.json()),

    updateStatus: async (
      id: string,
      status: ArticleStatus | UpdateArticleStatusPayload,
    ) => {
      const payload = typeof status === "string" ? { status } : status;

      const res = await fetch(`${BASE_URL}/articles/${id}/status`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.message || "Failed to update article status");
      }

      return response;
    },

    like: (id: string) =>
      fetch(`${BASE_URL}/articles/${id}/like`, {
        method: "POST",
        headers: getHeaders(),
      }).then((res) => res.json()),

    bookmark: (id: string) =>
      fetch(`${BASE_URL}/articles/${id}/bookmark`, {
        method: "POST",
        headers: getHeaders(),
      }).then((res) => res.json()),

    enroll: async (id: string): Promise<{ enrolled: boolean }> => {
      const res = await fetch(`${BASE_URL}/articles/${id}/enroll`, {
        method: "POST",
        headers: getHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update enrollment");
      }

      return data;
    },

    addComment: (id: string, data: { content: string }) =>
      fetch(`${BASE_URL}/articles/${id}/comment`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      }).then((res) => res.json()),

    getComments: (id: string) =>
      fetch(`${BASE_URL}/articles/${id}/comment`, {
        headers: getHeaders(),
      }).then((res) => res.json()),

    incrementViews: async (id: string): Promise<{ reads: number }> => {
      const res = await fetch(`/api/articles/${id}/view`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to increment views");
      }

      return res.json();
    },

    search: (query: string) =>
      fetch(`${BASE_URL}/articles/search?query=${query}`, {
        headers: getHeaders(),
      }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Search failed");
        return data;
      }),
  },

  categories: {
    list: async (): Promise<CategoriesResponse> =>
      fetch(`${BASE_URL}/categories`, {
        headers: getHeaders(),
      }).then((res) => res.json()),

    create: async (payload: CreateCategoryPayload): Promise<Category> =>
      fetch(`${BASE_URL}/categories`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      }).then((res) => res.json()),

    update: async (
      id: string,
      payload: UpdateCategoryPayload,
    ): Promise<Category> => {
      const res = await fetch(`${BASE_URL}/categories/${id}`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update category");
      }

      return data;
    },

    delete: async (
      id: string,
    ): Promise<{
      message: string;
    }> => {
      const res = await fetch(`${BASE_URL}/categories/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete category");
      }

      return data;
    },

    getTags: async (): Promise<TagsResponse> => {
      const res = await fetch(`${BASE_URL}/categories/tags`);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch tags");
      }

      return data;
    },

    createTag: async (payload: CreateTagPayload): Promise<Tag> => {
      const res = await fetch(`${BASE_URL}/categories/tags`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create tag");
      }

      return data;
    },
  },

  admin: {
    getStats: async (): Promise<AdminStats> => {
      const res = await fetch(`${BASE_URL}/admin/stats`, {
        headers: getHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch stats");
      }

      return data;
    },
  },

  public: {
    subscribeNewsletter: async (
      data: NewsletterPayload,
    ): Promise<PublicResponse> => {
      const res = await fetch(`${BASE_URL}/public/newsletter/subscribe`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });

      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.message || "Subscription failed");
      }

      return response;
    },

    submitContactForm: async (
      data: ContactPayload,
    ): Promise<PublicResponse> => {
      const res = await fetch(`${BASE_URL}/public/contact`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });

      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.message || "Failed to send message");
      }

      return response;
    },
  },
};
