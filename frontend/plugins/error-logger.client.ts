import { defineNuxtPlugin, useRuntimeConfig } from "nuxt/app";
//-------------------------------------------------------------------------------------//
export type FrontendErrorPayload = {
  type: "js" | "vue" | "fetch" | "promise";
  store?: string;
  message: string;
  stack?: string;
  url?: string;
  info?: string;
  userAgent?: string;
  time?: string;
};
export const errorPluginSend = async (error: FrontendErrorPayload) => {
  try {
    const config = useRuntimeConfig();
    const baseUrl = config.public.apiUrl;
    await fetch(`${baseUrl}/error/log-error`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(error),
    });
  } catch (err) {
    console.error("Error sending frontend log:", (err as Error)?.message);
  }
};
//-------------------------------------------------------------------------------------//

export default defineNuxtPlugin((_nuxtApp) => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiUrl;

  // Перехватываем глобальные ошибки
  window.addEventListener("error", async (event) => {
    await fetch(`${baseUrl}/error/log-error`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: event.message,
        stack: event.error?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
      }),
    });
  });

  window.addEventListener("unhandledrejection", async (event) => {
    await fetch(`${baseUrl}/error/log-error`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: event.reason?.message || "Unhandled promise rejection",
        stack: event.reason?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
      }),
    });
  });
});
