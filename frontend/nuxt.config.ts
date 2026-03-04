import svgLoader from "vite-svg-loader";
import sitemapConfig from "./sitemap.config";
// import fs from "fs";
// import path from "path";
//---------------------------------------//
// interface SitemapRoute {
//   url: string;
//   links: Record<string, string>;
// }

//---------------------------------------//

export default defineNuxtConfig({
  ssr: true,
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxtjs/i18n",
    "@pinia/nuxt",
    ["@nuxtjs/sitemap", sitemapConfig],
  ],
  plugins: [
    "./plugins/google-verification.server.ts",
    "./plugins/Vue3Marquee.client.ts",
    "./plugins/ws.client.ts",
    "./plugins/apexcharts.client.ts",
    "./plugins/agGridVue.client.ts",
    "./plugins/error-logger.client.ts",
  ],
  app: {
    head: {
      title: "Crypto Monitoring",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
      ],
      script: [
        {
          async: true,
          src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1311643945678594",
          crossorigin: "anonymous",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/logo-CM.ico" }],
    },
  },
  css: ["./app/assets/main.scss", "./app/assets/fonts.scss"],
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_BECK_URL_API,
      wsUrl: process.env.NUXT_PUBLIC_BECK_URL_WS,
      binance_ref: process.env.NUXT_PUBLIC_BINANCE_REF,
    },
  },
  typescript: {
    strict: true,
  },
  devServer: {
    port: 3001,
    host: "localhost",
  },
  vite: {
    plugins: [svgLoader()],
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  //---Language i18n---------------------------------------------------------------------------------//

  i18n: {
    langDir: "locales/",
    strategy: "prefix",
    defaultLocale: "en",
    locales: [
      { code: "en", name: "English", file: "en.json", flag: "🇬🇧" },
      { code: "de", name: "Deutsch", file: "de.json", flag: "🇩🇪" },
      { code: "ua", name: "Українська", file: "ua.json", flag: "🇺🇦" },
      { code: "tr", name: "Türkçe", file: "tr.json", flag: "🇹🇷" },
      { code: "hi", name: "हिन्दी", file: "hi.json", flag: "🇮🇳" },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "lang",
      redirectOn: "root",
    },
  },
  // @ts-expect-e: Nuxt3 does not have sitemap types yet
  // sitemap: {
  //   hostname: "https://cmcoins.wpslab.app",
  //   gzip: true,
  //   routes: async (): Promise<SitemapRoute[]> => {
  //     const languages = ["en", "de", "ua", "tr", "hi"];

  //     // ===== Получаем все страницы Nuxt 3 =====
  //     const pagesDir = path.resolve("./pages");
  //     const walkPages = (dir: string, base = ""): string[] => {
  //       const entries = fs.readdirSync(dir, { withFileTypes: true });
  //       const routes: string[] = [];

  //       for (const entry of entries) {
  //         if (entry.name.startsWith("_")) continue; // игнорируем динамические
  //         if (entry.isDirectory()) {
  //           routes.push(
  //             ...walkPages(
  //               path.join(dir, entry.name),
  //               path.join(base, entry.name),
  //             ),
  //           );
  //         } else if (entry.name.endsWith(".vue")) {
  //           const route = path.join(base, entry.name.replace(".vue", ""));
  //           routes.push(route === "/index" ? "/" : route);
  //         }
  //       }
  //       return routes;
  //     };

  //     const allRoutes = walkPages(pagesDir);

  //     // ===== Формируем sitemap с hreflang =====
  //     const sitemapRoutes: SitemapRoute[] = [];

  //     allRoutes.forEach((page) => {
  //       const route: SitemapRoute = {
  //         url: page,
  //         links: {} as Record<string, string>,
  //       };
  //       languages.forEach((lang) => {
  //         route.links[lang] =
  //           `https://cmcoins.wpslab.app/${lang}${page === "/" ? "" : page}`;
  //       });
  //       sitemapRoutes.push(route);
  //     });

  //     return sitemapRoutes;
  //   },
  // },
  nitro: {},
});
