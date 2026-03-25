import { defineStore } from "pinia";
import { useApi } from "@/composables/useApi";
import type { AnalyticsResponse } from "../../types/analytic";

//---------------------------------------//
export const useAnalyticsStore = defineStore("analyticsStore", () => {
  const api = useApi();

  //---------------------------------------//
  const getAnalytics = async (
    locale: string,
  ): Promise<AnalyticsResponse | null> => {
    const res = await api.get<AnalyticsResponse>("/analytics", {
      params: { locale: locale },
    });
    console.log("res anal store---------->", res);
    return res ?? null;
  };

  return { getAnalytics };
});
