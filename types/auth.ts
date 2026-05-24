import { PublicUser } from "./user";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  surname: string;
  email: string;
  password: string;
  school: string;
  dateOfBirth: string;
}

export interface AuthResponse {
  token: string;
  user: PublicUser;
  message?: string;
}
