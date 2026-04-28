import { defineStore } from "pinia";
import { useApi } from "@/composables/useApi";
// import { useCoinStore } from "@/stores/coinStore";

//-------------------------------------------------------------------------------------//
const loading = ref<boolean>(false);
const error = ref<string | null>(null);

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
  // const coinStore = useCoinStore();

  //-------------------------------------------------------------------------------------//
  const getExchanges = async (): Promise<Exchanges[]> => {
    loading.value = true;
    try {
      const result = await api.get<ExchangesApiResponse>(
        "/exchanges",
        {},
        true,
      );
      const resObj = result?.result ?? {};
      const exchangesArray: Exchanges[] = Object.values(resObj);

      return exchangesArray;
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
  };
});
