import { useRuntimeConfig, useCookie } from "#app";
import type { FrontendErrorPayload } from "../../plugins/error-logger.client";
import { errorPluginSend } from "../../plugins/error-logger.client";

//-------------------------------------------------------------------------------------//
export const useApi = () => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiUrl;
  const token = useCookie("token");

  const request = async <T>(
    url: string,
    options: Record<string, unknown> = {},
    ssr = false,
    storeName?: string,
  ) => {
    try {
      if (ssr && import.meta.server) {
        const { query, body, ...rest } = options;

        const { data, error } = await useFetch<T>(`${baseUrl}${url}`, {
          ...rest,
          server: true,
          lazy: false,
          params: options.params as Record<string, unknown>,
          body: options.body as Record<string, unknown>,
        });

        if (error.value) throw error.value;
        return data.value;
      } else {
        return await $fetch<T>(`${baseUrl}${url}`, {
          headers: {
            Authorization: token.value ? `Bearer ${token.value}` : "",
          },
          ...options,
        });
      }
    } catch (err: unknown) {
      const error = err as Error;

      const payload: FrontendErrorPayload = {
        type: "fetch",
        store: storeName,
        message: error.message,
        stack: error.stack,
        url: import.meta.client ? window.location.href : "SSR",
        userAgent: import.meta.client ? navigator.userAgent : "SSR",
        time: new Date().toISOString(),
      };
      await errorPluginSend(payload);

      throw error;
    }
  };

  return {
    get: <T>(url: string, options = {}, ssr = false, storeName?: string) =>
      request<T>(url, { method: "GET", ...options }, ssr, storeName),
    post: <T>(
      url: string,
      body = {},
      options = {},
      ssr = false,
      storeName?: string,
    ) => request<T>(url, { method: "POST", body, ...options }, ssr, storeName),
    put: <T>(
      url: string,
      body = {},
      options = {},
      ssr = false,
      storeName?: string,
    ) => request<T>(url, { method: "PUT", body, ...options }, ssr, storeName),
    del: <T>(url: string, options = {}, ssr = false) =>
      request<T>(url, { method: "DELETE", ...options }, ssr),
  };
};
