// server/middleware/locale.ts
import geoip from "geoip-lite";
import type { H3Event } from "h3";

export default defineEventHandler((event: H3Event) => {
  // -----------------------------
  // 1️⃣ Получаем IP клиента
  // -----------------------------
  const headers = getRequestHeaders(event);

  const cookieLang = getCookie(event, "lang"); // сначала смотрим cookie
  if (cookieLang) {
    (event as H3Event & { detectedLang?: string }).detectedLang = cookieLang;
    return; // cookie есть — используем её и выходим
  }

  const ipHeader = headers["x-forwarded-for"] || headers["x-real-ip"];
  let ip: string | undefined;

  if (ipHeader) {
    // Если несколько IP через запятую, берём первый
    ip = Array.isArray(ipHeader)
      ? ipHeader[0]
      : ipHeader.toString().split(",")[0];
  }

  // Если нет заголовков (например, локально), берём IP из сокета
  if (!ip) {
    ip = event.node.req.socket?.remoteAddress || "127.0.0.1"; // fallback на localhost
  }

  // -----------------------------
  // 2️⃣ Определяем язык по стране
  // -----------------------------
  let detectedLang = "en"; // дефолтный язык

  try {
    const geo = geoip.lookup(ip); // определяем страну по IP
    const country = geo?.country?.toLowerCase();

    // Маппинг к i18n кодам
    const map: Record<string, string> = {
      ua: "uk",
      de: "de",
      tr: "tr",
      in: "hi",
    };

    detectedLang = country && map[country] ? map[country] : "en";
  } catch (err) {
    console.error("Error Server Locale", (err as Error)?.message);
    detectedLang = "en"; // fallback
  }

  // -----------------------------
  // 3️⃣ Сохраняем язык в cookie
  // -----------------------------
  setCookie(event, "lang", detectedLang, { httpOnly: false, sameSite: "lax" });

  // -----------------------------
  // 4️⃣ Добавляем в контекст события для SSR/API
  // -----------------------------
  (event as H3Event & { detectedLang?: string }).detectedLang = detectedLang;
});
