import {
  defineNuxtPlugin,
  useHead,
  useRuntimeConfig,
  useRoute,
} from "#imports";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.siteUrl || "https://cmcoins.wpslab.app";
  const locales = ["en", "de", "ua", "tr", "hi"];
  const defaultLocale = "en";

  nuxtApp.provide("$seoHead", () => {
    const route = useRoute();
    const path =
      route.path.endsWith("/") && route.path !== "/"
        ? route.path.slice(0, -1)
        : route.path;

    let currentLang = defaultLocale;
    for (const l of locales) {
      if (path === `/${l}` || path.startsWith(`/${l}/`)) currentLang = l;
    }

    const pathWithoutLang =
      currentLang === defaultLocale
        ? path
        : path.replace(`/${currentLang}`, "");

    const canonicalHref =
      currentLang === defaultLocale
        ? `${baseUrl}${pathWithoutLang}`
        : `${baseUrl}/${currentLang}${pathWithoutLang}`;

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

    useHead({
      link: [{ rel: "canonical", href: canonicalHref }, ...alternateLinks],
    });
  });
});
