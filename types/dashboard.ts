import type { PublicUser } from "./user";
import type { PublicArticle, ArticleStatus } from "./article";

export type DashboardTab =
  | "my-studio"
  | "user-management"
  | "all-articles"
  | "category-management"
  | "deleted-articles"
  | "notifications";

export interface AdminStats {
  totalUsers: number;
  totalArticles: number;
  pendingArticles: number;
  publishedArticles: number;
  totalComments?: number;
  draftArticles?: number;
  totalReads?: number;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardArticle extends PublicArticle {
  author: PublicUser;
  status: ArticleStatus;
  deletedAt?: string;
}
