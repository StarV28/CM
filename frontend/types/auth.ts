import type { User } from "./user";
import type { Favorite } from "./favorite";

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  locale?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  success?: boolean;
  message?: string;
  token: string;
  user: User | null;
  favorites?: Favorite[];
  attempts?: number | null;
}
