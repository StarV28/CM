import { defineStore } from "pinia";
import { useApi } from "@/composables/useApi";
//-------------------------------------------------------------------------------------//
const loading = ref(false);
const error = ref<string | null>(null);

interface Rates {
  bank: string;
  currency_code: string;
  base_currency: string;
  rate_buy: number | null;
  rate_sell: number | null;
  date: string;
}
//-------------------------------------------------------------------------------------//

export const useRatesStore = defineStore("ratesStore", () => {
  //-------------------------------------------------------------------------------------//
  const getRates = async (): Promise<Rates[]> => {
    loading.value = true;
    try {
      const api = useApi();
      const rates = await api.get<Rates[]>("/rates/banks", {}, true);
      return rates || [];
    } catch (err) {
      error.value = (err as Error)?.message;
      return [];
    } finally {
      loading.value = false;
    }
  };
  return {
    getRates,
    loading,
  };
});
