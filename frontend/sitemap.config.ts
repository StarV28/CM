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
