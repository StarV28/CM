import { defineNuxtPlugin } from "#app";
import { useI18n } from "vue-i18n";
import { useRoute, useHead } from "#imports";

export default defineNuxtPlugin(() => {
  const { locale, locales } = useI18n();
  const route = useRoute();

  const baseUrl = "https://cmcoins.wpslab.app"; // твой домен

  // Формируем canonical URL
  const currentPath =
    locale.value === "en"
      ? route.path === "/"
        ? ""
        : route.path
      : `/${locale.value}${route.path === "/" ? "" : route.path}`;

  const canonicalHref = `${baseUrl}${currentPath}`;

  // Формируем hreflang для всех языков
  const alternateLinks = locales.map((l) => {
    const href =
      l.code === "en"
        ? `${baseUrl}${route.path === "/" ? "" : route.path}`
        : `${baseUrl}/${l.code}${route.path === "/" ? "" : route.path}`;

    return {
      rel: "alternate",
      hreflang: l.code,
      href,
    };
  });

  // Применяем useHead
  useHead({
    link: [{ rel: "canonical", href: canonicalHref }, ...alternateLinks],
  });
});
