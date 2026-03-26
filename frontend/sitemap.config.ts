const locales = ["en", "de", "ua", "tr", "hi"];

//---------------------------------------//
function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

//---------------------------------------//
export default {
  exclude: ["/auth/**", "/account", "/admin/**"],
  i18n: true,
  gzip: true,
  async urls() {
    const res = await fetch("https://wpslab.app/api/v1/coins?limit=50");
    const data = await res.json();

    const urls = [];

    // --- STATIC ---
    const staticPages = ["", "/analytics"];

    for (const loc of locales) {
      const prefix = loc === "en" ? "" : `/${loc}`;

      for (const page of staticPages) {
        urls.push({
          loc: `${prefix}${page}`,
          lastmod: new Date().toISOString(),
          changefreq: "daily",
          priority: page === "" ? 1.0 : 0.9,
        });
      }
    }

    for (const coin of data.result) {
      for (const loc of locales) {
        const prefix = loc === "en" ? "" : `/${loc}`;

        urls.push({
          loc: `${prefix}/coin/${coin.id}-${slugify(coin.name)}`,
          lastmod: new Date().toISOString(),
          changefreq: "daily",
          priority: 0.8,
        });
      }
    }
    return urls;
  },
};
