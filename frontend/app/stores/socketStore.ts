import { defineStore } from "pinia";
import type { Coin, Coins } from "../../types/coin";
//-------------------------------------------------------------------------------------//
interface CryptoRates {
  [key: string]: number;
}

// interface Coin {
//   id: string;
//   symbol: string;
//   name: string;
//   image: string;
//   price_usd: number;
//   market_cap: number;
//   rank: number;
//   price_change_percentage_24h: number;
//   price_change_percentage_7d: number;
//   volume_24h: number;
//   last_updated: string;
//   current_price?: number;
// }

interface Exchange {
  key: string;
  pair: string;
  candles: [];
}

interface WsData {
  rates?: CryptoRates;
  coins?: Coins[];
  coin?: Coin[];
  exchanges?: Exchange[];
}
interface WsRequest {
  type: "get-coins" | "get-exchanges" | "get-rates";
}

//-------------------------------------------------------------------------------------//

export const useSocketStore = defineStore("socketStore", () => {
  const socket = ref<WebSocket | null>(null);
  const data = ref<WsData>({});
  const isConnected = ref(false);
  const config = useRuntimeConfig();
  const baseUrl = config.public.wsUrl;

  //-------------------------------------------------------------------------------------//
  const connect = () => {
    if (!import.meta.client) return;
    if (!baseUrl) throw new Error("WS base URL is not defined");
    socket.value = new WebSocket(baseUrl);

    socket.value.onopen = () => {
      console.log("🔹 WS connected");
      isConnected.value = true;
    };

    socket.value.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        const toArray = (data: WsData) =>
          Array.isArray(data) ? data : Object.values(data || {});

        switch (parsed.type) {
          case "coins:snapshots":
            data.value.coins = toArray(parsed.data);
            break;

          case "coins:delta":
            data.value.coin = toArray(parsed.data);
            break;

          case "exchange-update":
            data.value.exchanges = parsed.data;
            break;
          case "rates-update":
            data.value.rates = parsed.data;
            break;
          default:
            console.warn("⚠️ Unknown WS message type:", parsed.type);
        }
      } catch (err) {
        console.error("WS parse error:", err);
      }
    };

    socket.value.onclose = () => {
      console.log("🔹 WS disconnected, reconnecting in 3s...");
      isConnected.value = false;
      setTimeout(() => connect(), 3000);
    };

    socket.value.onerror = (err) => {
      console.error("WS error:", err);
      socket.value?.close();
    };
  };

  const send = (payload: WsRequest) => {
    if (socket.value && isConnected.value) {
      socket.value.send(JSON.stringify(payload));
    }
  };

  return {
    data,
    isConnected,
    connect,
    send,
  };
});
