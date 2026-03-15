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
  exclude: ["/auth/**", "/account"],
  i18n: true,
  gzip: true,
  async urls() {
    const res = await fetch(
      "https://cmcoins.wpslab.app/api/v1/coins?limit=100",
    );
    const data = await res.json();

    const urls = [];

    for (const coin of data.result) {
      for (const loc of locales) {
        const prefix = loc === "en" ? "" : `/${loc}`;

        urls.push({
          loc: `${prefix}/coin/${coin.id}-${slugify(coin.name)}`,
        });
      }
    }
    return urls;
  },
};
