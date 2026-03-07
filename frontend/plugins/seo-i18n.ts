// plugins/seo-i18n.ts
import {
  defineNuxtPlugin,
  useHead,
  useRuntimeConfig,
  useRoute,
  useRequestEvent,
} from "#imports";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.siteUrl || "https://cmcoins.wpslab.app";
  const locales = ["en", "de", "ua", "tr", "hi"];
  const defaultLocale = "en";

  nuxtApp.provide("$seoHead", () => {
    let path = "/";

    if (import.meta.server) {
      // на сервере берём путь из запроса
      const event = useRequestEvent();
      path = event.node.req.url || "/";
    } else {
      // на клиенте через useRoute
      const route = useRoute();
      path = route.path;
    }

    // нормализуем слэш на конце
    path = path !== "/" && path.endsWith("/") ? path.slice(0, -1) : path;

    // определяем текущий язык
    let currentLang = defaultLocale;
    for (const l of locales) {
      if (path === `/${l}` || path.startsWith(`/${l}/`)) currentLang = l;
    }

    // путь без префикса языка
    const pathWithoutLang =
      currentLang === defaultLocale
        ? path
        : path.replace(`/${currentLang}`, "");

    // canonical
    const canonicalHref =
      currentLang === defaultLocale
        ? `${baseUrl}${pathWithoutLang}`
        : `${baseUrl}/${currentLang}${pathWithoutLang}`;

    // hreflang
    const alternateLinks = locales.map((l) => {
      const href =
        l === defaultLocale
          ? `${baseUrl}${pathWithoutLang}`
          : `${baseUrl}/${l}${pathWithoutLang}`;
      return { rel: "alternate", hreflang: l, href };
    });

    alternateLinks.push({
      rel: "alternate",
      hreflang: "x-default",
      href: `${baseUrl}${pathWithoutLang}`,
    });

    // ставим head
    useHead({
      link: [{ rel: "canonical", href: canonicalHref }, ...alternateLinks],
    });
  });
});
