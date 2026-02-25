import type { User } from "./user";
import type { Favorite } from "./favorite";

export interface ForgetPassDto {
  email: string;
}

export interface CodeForgetDto {
  code: string;
}

export interface ForgetPassResponse {
  success: boolean;
  message?: string;
  attempts?: number | null;
  user?: User | null;
  token?: string | null;
  favorites?: Favorite[];
}
export type ChangePass = {
  password: string;
};

export type AnswerCheckCode = {
  success: boolean;
  id: number;
};
