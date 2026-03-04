// import fs from "fs";
// import path from "path";

// //---------------------------------------//
// interface SitemapRoute {
//   url: string;
//   links: Record<string, string>;
// }
// //---------------------------------------//

// // const langs = ["en", "de", "ua", "tr", "hi"];
// // const pages = [
// //   "/",
// //   "/auth/login",
// //   "/auth/registration",
// //   "/disclaimer",
// //   "/privacy",
// // ];

// //---------------------------------------//
// export default {
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
// };

const langs = ["en", "de", "ua", "tr", "hi"];
const pages = [
  "/",
  "/auth/login",
  "/auth/registration",
  "/disclaimer",
  "/privacy",
];

export default {
  hostname: "https://cmcoins.wpslab.app",
  gzip: true,
  routes: pages.flatMap((p) =>
    langs.map((l) => ({
      url: p,
      links: { [l]: `https://cmcoins.wpslab.app/${l}${p === "/" ? "" : p}` },
    })),
  ),
};
