import { defineStore } from "pinia";
import { useApi } from "@/composables/useApi";
import { useSSRLocale } from "@/composables/useSSRLocale";
import type { AnalyticsResponse } from "../../types/analytic";

//---------------------------------------//
export const useAnalyticsStore = defineStore("analyticsStore", () => {
  const api = useApi();
  const { locale } = useSSRLocale();

  //---------------------------------------//
  const getAnalytics = async (): Promise<AnalyticsResponse | null> => {
    const res = await api.get<AnalyticsResponse>("/analytics", {
      params: { locale },
    });

    return res ?? null;
  };

  return getAnalytics;
});
