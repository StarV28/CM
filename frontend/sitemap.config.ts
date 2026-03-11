const locales = ["en", "de", "ua", "tr", "hi"];

//---------------------------------------//
export default {
  exclude: ["/auth/**", "/account"],
  i18n: true,
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
          loc: `${prefix}/coins/${coin.name.toLowerCase().replace(/\s+/g, "-")}`,
        });
      }
    }
    return urls;
  },
};
