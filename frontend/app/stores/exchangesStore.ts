import { defineStore } from "pinia";
import { useApi } from "@/composables/useApi";
import { useCoinStore } from "@/stores/coinStore";

//-------------------------------------------------------------------------------------//
const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const exchanges = ref([]);

interface Exchanges {
  key: string;
  pair: string;
  candles: [];
}
interface ExchangesApiResponse {
  result: Exchanges[];
}
//-------------------------------------------------------------------------------------//
export const useExchangesStore = defineStore("exchangesStore", () => {
  const api = useApi();
  const coinStore = useCoinStore();
  const coin = computed(() => coinStore.coin);

  //-------------------------------------------------------------------------------------//
  const getExchanges = async (): Promise<Exchanges[]> => {
    if (loading.value) return exchanges.value;
    loading.value = true;
    try {
      const id = coin.value?.cmc_id;
      const result = await api.get<ExchangesApiResponse>(
        `/exchanges/${id}`,
        {},
        true,
      );

      const resObj = result ?? {};
      exchanges.value = Object.values(resObj);

      return exchanges.value;
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
    getExchanges,
    exchanges,
  };
});
