import { useHead, useRuntimeConfig, useRoute } from "#imports";

export const useSeoI18n = () => {
  const config = useRuntimeConfig();
  const route = useRoute();

  const baseUrl = config.public.siteUrl || "https://cmcoins.wpslab.app";

  const locales = ["en", "de", "ua", "tr", "hi"];
  const defaultLocale = "en";

  let path = route.path;

  if (path !== "/" && path.endsWith("/")) {
    path = path.slice(0, -1);
  }

  let currentLang = defaultLocale;

  for (const l of locales) {
    if (path === `/${l}` || path.startsWith(`/${l}/`)) {
      currentLang = l;
      break;
    }
  }

  const pathWithoutLang =
    currentLang === defaultLocale ? path : path.replace(`/${currentLang}`, "");

  const canonical =
    currentLang === defaultLocale
      ? `${baseUrl}${pathWithoutLang}`
      : `${baseUrl}/${currentLang}${pathWithoutLang}`;

  const links = locales.map((l) => {
    const href =
      l === defaultLocale
        ? `${baseUrl}${pathWithoutLang}`
        : `${baseUrl}/${l}${pathWithoutLang}`;

    return {
      rel: "alternate",
      hreflang: l,
      href,
    };
  });

  links.push({
    rel: "alternate",
    hreflang: "x-default",
    href: `${baseUrl}${pathWithoutLang}`,
  });

  useHead({
    link: [{ rel: "canonical", href: canonical }, ...links],
  });
};
