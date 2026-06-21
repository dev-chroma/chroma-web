export type UserRole = "Owner" | "Admin" | "Editor" | "Author";

export interface PublicUser {
  _id: string;
  firstName: string;
  surname: string;
  email: string;
  role: UserRole;
  school: string;
  bio?: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  bookmarks?: string[];
  likedArticles?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  surname?: string;
  school?: string;
  bio?: string;
  avatar?: string;
}

export interface UpdateRolePayload {
  role: UserRole;
}
