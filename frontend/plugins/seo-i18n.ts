import { defineNuxtPlugin, useRoute, useI18n, useHead } from "#imports";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:rendered", () => {
    const route = useRoute();
    const { locale, locales } = useI18n();
    const baseUrl = "https://cmcoins.wpslab.app";

    // Текущий путь с префиксом
    const currentPath =
      locale.value === "en"
        ? route.path === "/"
          ? ""
          : route.path
        : `/${locale.value}${route.path === "/" ? "" : route.path}`;

    const canonicalHref = `${baseUrl}${currentPath}`;

    // hreflang для всех языков
    const alternateLinks = locales.map((l) => {
      const href =
        l.code === "en"
          ? `${baseUrl}${route.path === "/" ? "" : route.path}`
          : `${baseUrl}/${l.code}${route.path === "/" ? "" : route.path}`;
      return { rel: "alternate", hreflang: l.code, href };
    });

    useHead({
      link: [{ rel: "canonical", href: canonicalHref }, ...alternateLinks],
    });
  });
});
