import { useLocalePath } from "#i18n";
import type { RouteLocationNormalized } from "vue-router";

export default defineNuxtRouteMiddleware(
  (to: RouteLocationNormalized, _from: RouteLocationNormalized) => {
    const localePath = useLocalePath();
    const isAuthenticated = useCookie("token");
    const loginPath = localePath("/auth/login");

    if (!isAuthenticated.value && to.path !== loginPath) {
      return navigateTo(loginPath);
    }
  }
);
