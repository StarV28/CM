import { defineStore } from "pinia";
import { useApi } from "@/composables/useApi";
import type { AnalyticsResponse, Articles } from "../../types/analytic";

//---------------------------------------//
export const useAnalyticsStore = defineStore("analyticsStore", () => {
  const api = useApi();

  //---------------------------------------//
  const getAnalytics = async (locale: string): Promise<Articles | null> => {
    const res = await api.get<AnalyticsResponse>("/analytics", {
      params: { locale: locale },
    });
    return res?.articles ?? null;
  };

  return { getAnalytics };
});
