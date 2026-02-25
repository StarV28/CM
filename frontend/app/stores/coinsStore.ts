import { defineStore } from "pinia";
import { ref } from "vue";
import { useApi } from "@/composables/useApi";
import type {
  Coin,
  Coins,
  ExchangeName,
  CoinWithDescription,
} from "../../types/coin";
import type { Favorite } from "../../types/favorite";
import { useSSRLocale } from "@/composables/useSSRLocale";

//-------------------------------------------------------------------------------------//
const loading = ref<boolean>(false);
const error = ref<string | null>(null);

interface CoinByIdRes {
  result: Coin;
  description?: string;
}
interface CoinsApiResult {
  total: number;
  result: Coins[];
}
// type CoinWithDescription = Coin & { description?: string };
type Description = { description: string };

//-------------------------------------------------------------------------------------//
export const useCoinsStore = defineStore("coinsStore", () => {
  const api = useApi();
  const { locale } = useSSRLocale();

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
  //-------------------------------------------------------------------------------------//

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
  const getDescriptionCoinId = async (id: string): Promise<string | null> => {
    loading.value = true;
    try {
      const res = await api.get<Description>(
        `/coins/${id}/description`,
        {
          params: { locale: locale.value },
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
    loading,
    error,
    getCoinsApi,
    getCoinId,
    getDescriptionCoinId,
  };
});
