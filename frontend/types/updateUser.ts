import type { User } from "./user";

export interface UpdateUserResponse {
  success: boolean;
  message?: string;
  user?: User;
  errors?: string;
}

export type DeleteUser = {
  success: boolean;
  message: string;
};
