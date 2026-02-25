// composables/useSeo.ts
import { useHead } from "#app";
import { useI18n } from "vue-i18n";

type JsonLdObject = {
  [key: string]: string | number | boolean | JsonLdObject | JsonLdObject[];
};

export function useSeo(
  options: {
    title?: string;
    description?: string;
    ogTitle?: string;
    ogDescription?: string;
    url?: string;
    image?: string;
    jsonLd?: JsonLdObject;
  } = {}
) {
  const { t, locale } = useI18n();

  const title = options.title || t("seo.title");
  const description = options.description || t("seo.description");
  const ogTitle = options.ogTitle || t("seo.ogTitle");
  const ogDescription = options.ogDescription || t("seo.ogDescription");
  const currentLocale = locale.value; // синхронно
  const url = options.url || `https://your-domain.com/${currentLocale}`;
  const image = options.image || "/og-image-main.jpg";

  useHead({
    title,
    meta: [
      { name: "description", content: description },
      { property: "og:title", content: ogTitle },
      { property: "og:description", content: ogDescription },
      { property: "og:type", content: "website" },
      { property: "og:image", content: image },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: ogTitle },
      { name: "twitter:description", content: ogDescription },
      { name: "twitter:image", content: image },
    ],
    link: [
      { rel: "canonical", href: url },
      { rel: "alternate", hreflang: "en", href: "https://your-domain.com/en" },
      { rel: "alternate", hreflang: "de", href: "https://your-domain.com/de" },
      { rel: "alternate", hreflang: "uk", href: "https://your-domain.com/ua" },
      { rel: "alternate", hreflang: "tr", href: "https://your-domain.com/tr" },
      { rel: "alternate", hreflang: "hi", href: "https://your-domain.com/hi" },
    ],
    script: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify(
          options.jsonLd ||
            ({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Crypto Monitoring",
              url,
              description,
            } as JsonLdObject)
        ),
      },
    ],
  });
}

//-------------------------------------------------------------------------------------//
export function useSeoCoin(coinName: string) {
  const { t } = useI18n();

  useHead({
    title: t("seo.coinTitle", { name: coinName }),
    meta: [
      {
        name: "description",
        content: t("seo.coinDescription", { name: coinName }),
      },
      { property: "og:title", content: t("seo.coinTitle", { name: coinName }) },
      {
        property: "og:description",
        content: t("seo.coinDescription", { name: coinName }),
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/og-image-main.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: t("seo.coinTitle", { name: coinName }),
      },
      {
        name: "twitter:description",
        content: t("seo.coinDescription", { name: coinName }),
      },
      { name: "twitter:image", content: "/og-image-main.jpg" },
    ],
  });
}
