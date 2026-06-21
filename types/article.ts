import type { PublicUser } from "./user";

export type ArticleStatus = "Draft" | "Pending" | "Editing" | "Edited" | "Published" | "Paused";

export interface UpdateArticleStatusPayload {
  status?: ArticleStatus;
  assignedEditor?: string | null;
}

export interface ArticleCategory {
  _id: string;
  name: string;
}

export interface PublicArticle {
  _id: string;
  title: string;
  excerpt?: string;
  content: string;
  author: PublicUser;
  enrolledBy?: string[];
  status: ArticleStatus;
  category: ArticleCategory;
  thumbnail?: string;
  featuredImage?: string;
  tags: string[];
  readTime: string;
  likes: number;
  commentsCount: number;
  bookmarksCount: number;
  likedBy?: string[];
  viewedBy?: string[];
  reads: number;
  assignedEditor?: string | PublicUser;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateArticlePayload {
  title: string;
  excerpt?: string;
  content: string;
  category: string;
  thumbnail?: string;
  featuredImage?: string;
  tags?: string[];
  readTime?: string;
}

export interface UpdateArticlePayload {
  title?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  thumbnail?: string;
  featuredImage?: string;
  tags?: string[];
  readTime?: string;
  status?: ArticleStatus;
}

export interface ArticleQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  status?: ArticleStatus | "all";
  search?: string;
  author?: string;
  tags?: string[];
  sortBy?: "likes" | "latest";
}

export interface CommentPayload {
  content: string;
}

export interface ArticleComment {
  _id: string;
  content: string;
  article: string;
  author: PublicUser;
  createdAt: string;
  updatedAt: string;
}

export interface PopulatedCategory {
  _id: string;
  name: string;
  slug: string;
}

export interface PopulatedArticle {
  _id: string;
  title: string;
  excerpt?: string;
  content: string;
  author: PublicUser | string;
  enrolledBy?: string[];
  status: "Draft" | "Pending" | "Editing" | "Edited" | "Published" | "Paused";
  category: PopulatedCategory | string;
  thumbnail?: string;
  featuredImage?: string;
  tags: string[];
  readTime: string;
  likes: number;
  commentsCount: number;
  bookmarksCount: number;
  bookmarkedBy: string[];
  reads: number;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArticlesResponse {
  articles: PublicArticle[];
  totalPages?: number;
  currentPage?: number;
  totalArticles?: number;
}
