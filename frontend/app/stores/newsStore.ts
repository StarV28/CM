import { defineStore } from "pinia";
import { useApi } from "@/composables/useApi";
import { useSSRLocale } from "@/composables/useSSRLocale";

//-------------------------------------------------------------------------------------//
const loading = ref<boolean>(false);
const error = ref<string | null>(null);

interface News {
  title: string;
  url: string;
  image: string;
  source: string;
  publishedAt: string;
}

//-------------------------------------------------------------------------------------//
export const useNewsStore = defineStore("newsStore", () => {
  const api = useApi();
  const { locale } = useSSRLocale();
  const news = ref<News[]>([]);
  const lastFetched = ref<number | null>(null);
  const land = ref("");
  let interval: ReturnType<typeof setInterval> | null = null;

  //-------------------------------------------------------------------------------------//

  const getNews = async (): Promise<News[]> => {
    loading.value = true;

    const oneHour = 20 * 60 * 1000;
    if (
      lastFetched.value &&
      Date.now() - lastFetched.value < oneHour &&
      land.value === locale.value
    ) {
      return news.value;
    }
    try {
      const data = await api.get<News[]>(
        "/news",
        { params: { locale: locale.value } },
        true
      );
      if (data) {
        news.value = data;
        lastFetched.value = Date.now();
        land.value = locale.value;
      }
      return news.value ?? [];
    } catch (err) {
      error.value = (err as Error)?.message;
      return [];
    } finally {
      loading.value = false;
    }
  };
  //-------------------------------------------------------------------------------------//
  watch(
    locale,
    (newLocale, oldLocale) => {
      if (newLocale && newLocale !== oldLocale) {
        getNews();
      }
    },
    { immediate: true }
  );
  //-------------------------------------------------------------------------------------//
  const startAutoUpdate = () => {
    if (!interval) {
      interval = setInterval(getNews, 20 * 60 * 1000);
    }
  };

  const stopAutoUpdate = () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  };

  //-------------------------------------------------------------------------------------//

  return {
    getNews,
    news,
    loading,
    error,
    startAutoUpdate,
    stopAutoUpdate,
  };
});
