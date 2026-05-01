import { defineStore } from "pinia";
import { useApi } from "@/composables/useApi";
import type { Coin, ExchangeName, CoinWithDescription } from "../../types/coin";
//-------------------------------------------------------------------------------------//

interface CoinByIdRes {
  result: Coin;
  description?: string;
}
type Description = { description: string };
//-------------------------------------------------------------------------------------//

const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const coin = ref<CoinWithDescription>();
//-------------------------------------------------------------------------------------//

export const useCoinStore = defineStore("coinStore", () => {
  const api = useApi();

  //---------------------------------------//

  const getCoinId = async (id: string): Promise<CoinWithDescription | null> => {
    loading.value = true;
    try {
      const res = await api.get<CoinByIdRes>(`/coins/${id}`, {}, true);

      if (!res?.result) return null;

      const exchanges: ExchangeName[] = [];

      const { binance, bybit, okx, kraken, ...rest } = res.result;

      if (binance) exchanges.push("Binance");
      if (bybit) exchanges.push("Bybit");
      if (okx) exchanges.push("OKX");
      if (kraken) exchanges.push("Kraken");

      coin.value = { ...rest, exchanges };

      return {
        ...rest,
        exchanges,
      };
    } catch (err) {
      error.value = (err as Error)?.message;
      return null;
    } finally {
      loading.value = false;
    }
  };
  //-------------------------------------------------------------------------------------//
  const getDescriptionCoinId = async (
    id: string,
    locale: string,
  ): Promise<string | null> => {
    loading.value = true;
    try {
      const res = await api.get<Description>(
        `/coins/${id}/description`,
        {
          params: { locale: locale },
        },
        true,
      );
      return res?.description ?? null;
    } catch (err) {
      error.value = (err as Error)?.message;
      return null;
    } finally {
      loading.value = false;
    }
  };
  return {
    getCoinId,
    getDescriptionCoinId,
    coin,

    loading,
    error,
  };
});
