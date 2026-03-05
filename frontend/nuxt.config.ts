import svgLoader from "vite-svg-loader";
import sitemapConfig from "./sitemap.config";

//---------------------------------------//

export default defineNuxtConfig({
  ssr: true,
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    ["@nuxtjs/sitemap", sitemapConfig],
    "@nuxtjs/i18n",
    "@pinia/nuxt",
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
        {
          name: "google-site-verification",
          content: "google537cfa2634da0649.html",
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
    plugins: [svgLoader() as any],
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  //---Language i18n---------------------------------------------------------------------------------//

  i18n: {
    langDir: "locales/",
    strategy: "prefix_except_default",
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
  nitro: {},
});
