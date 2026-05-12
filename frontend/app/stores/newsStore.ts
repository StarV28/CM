import { defineStore } from "pinia";
import { useApi } from "@/composables/useApi";

//-------------------------------------------------------------------------------------//

interface News {
  title: string;
  url: string;
  image: string;
  source: string;
  publishedAt: string;
}

//-------------------------------------------------------------------------------------//
export const useNewsStore = defineStore("newsStore", () => {
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const api = useApi();
  const news = ref<News[]>([]);
  const lastFetched = ref<number | null>(null);
  const land = ref("");
  let interval: ReturnType<typeof setInterval> | null = null;

  //-------------------------------------------------------------------------------------//

  const getNews = async (locale: string): Promise<News[]> => {
    loading.value = true;

    const oneHour = 20 * 60 * 1000;
    if (
      lastFetched.value &&
      Date.now() - lastFetched.value < oneHour &&
      land.value === locale
    ) {
      return news.value;
    }
    try {
      const data = await api.get<News[]>(
        "/news",
        { params: { locale: locale } },
        true,
      );
      if (data) {
        news.value = data;
        lastFetched.value = Date.now();
        land.value = locale;
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

  const startAutoUpdate = (locale: string) => {
    if (!interval) {
      interval = setInterval(() => getNews(locale), 20 * 60 * 1000);
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
