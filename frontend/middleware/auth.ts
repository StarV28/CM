import { useLocalePath } from "#i18n";
import type { RouteLocationNormalized } from "vue-router";
//---------------------------------------//

export default defineNuxtRouteMiddleware(
  (to: RouteLocationNormalized, _from: RouteLocationNormalized) => {
    const localePath = useLocalePath();

    const token = useCookie("token");
    const userCookie = useCookie("user");

    const loginPath = localePath("/auth/login");
    const adminPath = localePath("/admin/analytics");

    let user = null;

    if (userCookie.value) {
      if (typeof userCookie.value === "string") {
        try {
          user = JSON.parse(userCookie.value);
        } catch {
          user = null;
        }
      } else {
        user = userCookie.value;
      }
    }

    if (!token.value && to.path !== loginPath) {
      return navigateTo(loginPath);
    }

    if ((!user || user.role !== "admin") && to.path === adminPath) {
      return navigateTo(localePath("/"));
    }
  },
);
