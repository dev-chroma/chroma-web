export interface Category {
  _id: string;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Tag {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface TagsResponse {
  tags: Tag[];
}

export interface CreateCategoryPayload {
  name: string;
  slug?: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  slug?: string;
}

export interface CreateTagPayload {
  name: string;
}
