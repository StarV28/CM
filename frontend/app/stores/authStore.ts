import { defineStore } from "pinia";
import { useApi } from "@/composables/useApi";
import { useFavoriteStore } from "@/stores/favoriteStore";
import type { User } from "../../types/user";
import type { AuthResponse, CreateUserDto, LoginDto } from "../../types/auth";
import type {
  ForgetPassDto,
  ForgetPassResponse,
  CodeForgetDto,
  ChangePass,
  AnswerCheckCode,
} from "../../types/password-reset";
import { useRuntimeConfig } from "#app";

//-------------------------------------------------------------------------------------//
export const useAuthStore = defineStore("authStore", () => {
  const api = useApi();

  const user = ref<User | null>(null);
  const token = ref<string | null>(null);

  const loading = ref(false);
  const error = ref<string | null>(null);

  const userId = ref<number | null>(null);

  const favoriteStore = useFavoriteStore();

  const changeUserComp = ref<boolean>(true);

  const config = useRuntimeConfig();

  const baseUrl = config.public.apiUrl;

  const tokenCookie = useCookie("token", {
    maxAge: 60 * 60,
    httpOnly: false,
    sameSite: "lax",
    path: "/",
  });
  const userCookie = useCookie<User | null>("user", {
    maxAge: 60 * 60,
    httpOnly: false,
    sameSite: "lax",
    path: "/",
  });

  //-------------------------------------------------------------------------------------//

  const setToken = (t: string) => {
    token.value = t;
    tokenCookie.value = t;
  };
  //-------------------------------------------------------------------------------------//
  const fetchUser = async () => {
    if (!tokenCookie.value) return;

    const data = await $fetch<AuthResponse>(`${baseUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${tokenCookie.value}`,
      },
    });
    favoriteStore.favoriteArr = data.favorites;
    userCookie.value = data.user;
  };
  //-------------------------------------------------------------------------------------//

  const getUserCreate = async (data: CreateUserDto) => {
    loading.value = true;

    try {
      if (userCookie.value && tokenCookie.value) return user.value;

      const result = await api.post<AuthResponse>(
        "/user/create",
        { data },
        false,
      );

      if (!result) throw new Error("No response from API");

      favoriteStore.favoriteArr = result.favorites;

      tokenCookie.value = result.token;
      userCookie.value = result.user;

      return result;
    } catch (err) {
      error.value = (err as Error).message;
      return null;
    } finally {
      loading.value = false;
    }
  };
  //-------------------------------------------------------------------------------------//
  const getLogIn = async (data: LoginDto) => {
    loading.value = true;
    try {
      if (userCookie.value && tokenCookie.value) return user.value;

      const result = await api.post<AuthResponse>(
        "/user/login",
        { data },
        false,
      );
      if (!result) throw new Error("No response from API");

      if (!result.success) {
        return result;
      }

      userCookie.value = result.user;
      tokenCookie.value = result.token;

      favoriteStore.favoriteArr = result.favorites;
    } catch (err) {
      error.value = (err as Error)?.message;
      return null;
    } finally {
      loading.value = false;
    }
  };
  //-------------------------------------------------------------------------------------//
  const getForgetPass = async (
    data: ForgetPassDto,
  ): Promise<ForgetPassResponse | null | undefined> => {
    try {
      const res = await api.post<ForgetPassResponse>(
        "/user/password",
        { data },
        false,
      );
      return res;
    } catch (err) {
      error.value = (err as Error)?.message;
      return null;
    }
  };
  //-------------------------------------------------------------------------------------//
  const checkedCodePass = async (data: CodeForgetDto) => {
    try {
      const res = await api.post<AnswerCheckCode>(
        "/user/password/code",
        { data },
        false,
      );
      userId.value = res?.id ? res?.id : null;

      return res;
    } catch (err) {
      error.value = (err as Error)?.message;
      return null;
    }
  };
  //-------------------------------------------------------------------------------------//
  const changePassword = async (data: ChangePass) => {
    try {
      const res = await api.post<ForgetPassResponse>(
        "/user/password/update",
        { data, id: userId.value },
        false,
      );
      userCookie.value = res?.user ?? null;

      tokenCookie.value = res?.token ?? null;

      favoriteStore.favoriteArr = res?.favorites;

      return res;
    } catch (err) {
      error.value = (err as Error)?.message;
      return null;
    }
  };

  //-------------------------------------------------------------------------------------//

  const logout = () => {
    userCookie.value = null;
    tokenCookie.value = null;
    favoriteStore.favoriteArr = null;
  };
  //-------------------------------------------------------------------------------------//

  return {
    loading,
    error,

    setToken,
    getUserCreate,
    getLogIn,
    fetchUser,
    getForgetPass,
    checkedCodePass,
    changePassword,
    logout,
    changeUserComp,
  };
});
