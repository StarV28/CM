import { defineNuxtPlugin, useHead, useRuntimeConfig } from "#imports";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.siteUrl || "https://cmcoins.wpslab.app";
  const locales = ["en", "de", "ua", "tr", "hi"];
  const defaultLocale = "en";

  nuxtApp.hook("app:rendered", ({ ssrContext }) => {
    // Получаем путь запроса на сервере
    const rawUrl = ssrContext?.event?.req?.url || "/";

    // Нормализуем путь (убираем слэш в конце, если есть)
    const normalizedRoute =
      rawUrl !== "/" && rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;

    // Определяем текущий язык
    let currentLang = defaultLocale;
    for (const l of locales) {
      if (normalizedRoute === `/${l}` || normalizedRoute.startsWith(`/${l}/`)) {
        currentLang = l;
        break;
      }
    }

    // Путь без префикса языка
    const pathWithoutLang =
      currentLang === defaultLocale
        ? normalizedRoute
        : normalizedRoute.replace(`/${currentLang}`, "");

    // Формируем canonical с учётом языка
    const canonicalHref =
      currentLang === defaultLocale
        ? `${baseUrl}${pathWithoutLang}`
        : `${baseUrl}/${currentLang}${pathWithoutLang}`;

    // Формируем hreflang ссылки
    const alternateLinks = locales.map((l) => {
      const href =
        l === defaultLocale
          ? `${baseUrl}${pathWithoutLang}`
          : `${baseUrl}/${l}${pathWithoutLang}`;
      return { rel: "alternate", hreflang: l, href };
    });

    // x-default ссылка для всех остальных
    alternateLinks.push({
      rel: "alternate",
      hreflang: "x-default",
      href: `${baseUrl}${pathWithoutLang}`,
    });

    // Устанавливаем head
    useHead({
      link: [{ rel: "canonical", href: canonicalHref }, ...alternateLinks],
    });
  });
});
