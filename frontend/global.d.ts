/// <reference types="nuxt/schema" />
// import type { NavigationGuard } from "vue-router";
export {};

declare module "nuxt/schema" {
  interface PageMeta {
    middleware?: string | string[] | NavigationGuard | NavigationGuard[];
  }
}

// Делаем `defineNuxtRouteMiddleware` видимым
declare module "#app" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface NuxtApp {}
}

declare global {
  const defineNuxtRouteMiddleware: typeof import("#app")["defineNuxtRouteMiddleware"];
  const navigateTo: typeof import("#app")["navigateTo"];
  const definePageMeta: typeof import("#app")["definePageMeta"];
  const useLocalePath: typeof import("#i18n")["useLocalePath"];
}
