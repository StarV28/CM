import { defineStore } from "pinia";
import { ref } from "vue";
import { useApi } from "@/composables/useApi";
import type { Coins } from "../../types/coin";
import type { Favorite } from "../../types/favorite";
// import { useSSRLocale } from "@/composables/useSSRLocale";

//-------------------------------------------------------------------------------------//
const loading = ref<boolean>(false);
const error = ref<string | null>(null);

interface CoinsApiResult {
  total: number;
  result: Coins[];
}

//-------------------------------------------------------------------------------------//
export const useCoinsStore = defineStore("coinsStore", () => {
  const api = useApi();

  //-------------------------------------------------------------------------------------//
  const getCoinsApi = async (
    limit: number | null = 50,
    favorites: Favorite[] | null,
  ): Promise<Coins[]> => {
    loading.value = true;
    try {
      const url = limit ? `/coins?limit=${limit}` : `/coins`;
      const res = await api.get<CoinsApiResult>(
        url,
        {
          params: {
            favorites: favorites?.map((f) => f.coinId).join(","),
          },
        },
        true,
      );
      return res?.result ?? [];
    } catch (err) {
      error.value = (err as Error)?.message;
      return [];
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    getCoinsApi,
  };
});
