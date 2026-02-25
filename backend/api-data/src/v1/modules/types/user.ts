export interface UserRequest {
  data: User;
}
export type User = {
  id?: string | number | null | undefined;
  name: string | null;
  email: string;
  password?: string;
  locale?: string;
  success?: boolean;
  message?: string;
};
