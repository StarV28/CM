import { defineNuxtPlugin, useHead, useRuntimeConfig } from "#imports";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.siteUrl || "https://cmcoins.wpslab.app";

  nuxtApp.hook("app:rendered", ({ ssrContext }) => {
    const route = ssrContext?.url || "/";
    const locales = ["en", "de", "ua", "tr", "hi"]; // твои языки

    // Текущий язык из URL
    let currentLang = "en";
    for (const l of locales) {
      if (route.startsWith(`/${l}/`) || route === `/${l}`) {
        currentLang = l;
        break;
      }
    }

    const pathWithoutLang =
      currentLang === "en" ? route : route.replace(`/${currentLang}`, "");

    // Canonical
    const canonicalHref = `${baseUrl}${pathWithoutLang}`;

    // hreflang
    const alternateLinks = locales.map((l) => {
      const href =
        l === "en"
          ? `${baseUrl}${pathWithoutLang}`
          : `${baseUrl}/${l}${pathWithoutLang}`;
      return { rel: "alternate", hreflang: l, href };
    });

    useHead({
      link: [{ rel: "canonical", href: canonicalHref }, ...alternateLinks],
    });
  });
});
