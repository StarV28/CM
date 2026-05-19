import { defineStore } from "pinia";
import { ref } from "vue";
import { useApi } from "@/composables/useApi";
import type { Coins } from "../../types/coin";
import type { Favorite } from "../../types/favorite";
// import { useSSRLocale } from "@/composables/useSSRLocale";

//-------------------------------------------------------------------------------------//

interface CoinsApiResult {
  total: number;
  result: Coins[];
}

//-------------------------------------------------------------------------------------//
export const useCoinsStore = defineStore("coinsStore", () => {
  const api = useApi();
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const coins = ref<Coins[]>([]);
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
        // true,
      );
      coins.value = res?.result ?? [];
      return coins.value;
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
    coins,
  };
});
