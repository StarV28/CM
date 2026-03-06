<template>
  <loading-comp v-if="loading" />
  <div v-else id="coins" class="coins">
    <div class="coins__head">
      <div class="coins__top-btn">
        <button
          class="btn"
          :class="{ 'active-limit': activeLimit === 50 }"
          @click="onShowTopCoins(50)"
        >
          {{ t("coins.title50") }}
        </button>
        <button
          class="btn"
          :class="{ 'active-limit': activeLimit === 100 }"
          @click="onShowTopCoins(100)"
        >
          {{ t("coins.title100") }}
        </button>
        <button
          class="btn"
          :class="{ 'active-limit': activeLimit === null }"
          @click="onShowTopCoins(null)"
        >
          {{ t("coins.titleAll") }}
        </button>
      </div>
      <div class="coins__qr-donate qr-donate">
        <div class="qr-donate__title">
          <span>Support</span>
          <span>the project</span>
          <span>with a Donation</span>
        </div>
        <qrcode-comp />
      </div>
    </div>
    <popup-inform-favorite-comp />
    <popup-info-popup-comp />
    <client-only>
      <ag-grid-vue
        class="ag-theme-custom"
        :row-data="rowData"
        :column-defs="colDefs"
        :components="component"
        style="height: 700px"
        :context="{ vueComponent: true }"
        @grid-ready="onGridReady"
      />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useCoinsStore } from "@/stores/coinsStore";
import { useSocketStore } from "@/stores/socketStore";
import { useFavoriteStore } from "@/stores/favoriteStore";
import { formatNumber } from "@/utils/formatNumber";
import FavoriteCoinComp from "@/components/main/coins/FavoriteCoinComp.vue";
import CoinLink from "@/components/main/coins/CoinLinkComp.vue";
import TradButtonComp from "@/components/main/coins/TradButtonComp.vue";

import type {
  ICellRendererParams,
  ValueFormatterParams,
  GridApi,
  GridReadyEvent,
} from "ag-grid-community";
import type { Coins, RowData, ExchangeName } from "../../../../types/coin";
import type { User } from "../../../../types/user";
import type { Favorite } from "../../../../types/favorite";
import QrcodeComp from "../../donat/QrcodeComp.vue";

//-------------------------------------------------------------------------------------//
const coinsStore = useCoinsStore();
const socketStore = useSocketStore();
const favoriteStore = useFavoriteStore();
const coins = ref<Coins[]>([]);

const rowData = ref<RowData[]>();
const colDefs = ref();
const { t } = useI18n();
const loading = computed(() => coinsStore.loading);
const component = {
  favoriteCoin: FavoriteCoinComp,
  tradButton: TradButtonComp,
};
const user = ref<User | null>(null);
const favorites = ref<Favorite[] | null>(null);
const activeLimit = ref<number | null>(50);
const gridApi = ref<GridApi | null>(null);

//---------------------------------------//

const toNumber = (v: unknown): number | null => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

//-------------------------------------------------------------------------------------//
async function loadCoins(limit: number | null) {
  user.value = useCookie<User | null>("user").value;
  if (user.value) {
    favorites.value = favoriteStore.favoriteArr ?? null;
  }

  coins.value = (await coinsStore.getCoinsApi(limit, favorites.value)) || [];
  rowData.value = sortByFavorites(mapCoinsToRowData(coins.value));
}

//---------------------------------------//
const onShowTopCoins = async (limit: number | null) => {
  activeLimit.value = limit;
  await loadCoins(limit);
};
//--API ag-grid-------------------------------------//
const onGridReady = (params: GridReadyEvent) => {
  gridApi.value = params.api;
  updateColHeaders();
};

//-------------------------------------------------------------------------------------//

watch(
  () => socketStore.data.coins,
  (snapshots) => {
    if (!snapshots || !Array.isArray(snapshots)) return;

    for (const upd of snapshots) {
      const coin = coins.value.find((c) => c.id === upd.id);
      if (!coin) continue;
      Object.assign(coin, upd);
    }
    rowData.value = sortByFavorites(mapCoinsToRowData(coins.value));
  },
);
//---------------------------------------//
watch(
  () => socketStore.data.coin,
  (delta) => {
    if (!delta || !Array.isArray(delta)) return;

    for (const upd of delta) {
      const res = coins.value.find((c) => c.id === upd.id);
      if (!res) continue;
      Object.assign(res, upd);
    }
    rowData.value = sortByFavorites(mapCoinsToRowData(coins.value));
  },
);

//-------------------------------------------------------------------------------------//
function sortByFavorites(rows: RowData[]): RowData[] {
  const favIds = new Set(favoriteStore.favoriteArr?.map((f) => f.coinId));
  return [...rows].sort((a, b) => {
    const aFav = favIds.has(a.id);
    const bFav = favIds.has(b.id);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return a.rank - b.rank;
  });
}

//-------------------------------------------------------------------------------------//
watch(
  () => favoriteStore.favoriteArr,
  () => {
    if (rowData.value) {
      rowData.value = sortByFavorites(rowData.value);
    }
  },
  { deep: true },
);

//-------------------------------------------------------------------------------------//
colDefs.value = [
  {
    field: "rank",
    headerName: "Rank",
    width: 60,
    minWidth: 40,
    maxWidth: 80,
    pinned: "left",
    cellStyle: { border: "none", padding: "0, 3", textAlign: "center" },
  },
  {
    field: "id",
    headerName: "Choice",
    width: 70,
    minWidth: 40,
    maxWidth: 80,
    pinned: "left",
    cellStyle: { border: "none", padding: "0, 3", textAlign: "center" },
    cellRenderer: "favoriteCoin",
  },
  {
    field: "img",
    headerName: "Logo",
    width: 70,
    suppressSizeToFit: true,
    pinned: "left",
    cellRenderer: (p: ICellRendererParams) =>
      `<div style="display:flex;justify-content:center;align-items:center;height:100%;">
         <img src="${p.value}" width="24" height="24" style="border-radius:50%;" />
       </div>`,
  },
  {
    field: "name",
    headerName: "Name",
    width: 200,
    minWidth: 150,
    suppressSizeToFit: true,
    pinned: "left",
    cellRenderer: CoinLink ?? null,
  },
  {
    headerName: "Trade",
    colId: "trade",
    width: 190,
    pinned: "right",
    cellClass: "trade-cell-ag",
    cellRenderer: "tradButton",
    valueGetter: () => null,
  },
  {
    field: "price",
    headerName: "Price",
    minWidth: 140,
    suppressSizeToFit: true,
    cellRenderer: (params: ValueFormatterParams) => {
      const price = params.value;
      const diff = params.data.priceDiff || 0;
      let arrow = "";
      let color = "green";

      if (diff > 0) {
        arrow = "▲";
        color = "green";
      } else if (diff < 0) {
        arrow = "▼";
        color = "red";
      }

      const percentChange =
        diff && params.data.price
          ? ((diff / (price - diff)) * 100).toFixed(2) + "%"
          : "";

      return `<span style="display:flex;align-items:center;justify-content:flex-start;gap:5px; color:${color}">
              <span>$ ${formatNumber(price)}</span>
              <span style="font-size:12px">${arrow} ${percentChange}</span>
            </span>`;
    },
  },
  {
    field: "price_change_24",
    headerName: "24h Change",
    width: 120,
    cellStyle: (params: ValueFormatterParams) => {
      return params.value.startsWith("-")
        ? { color: "red" }
        : { color: "green" };
    },
  },
  {
    field: "price_change_7d",
    headerName: "7d Change",
    width: 120,
    cellStyle: (params: ValueFormatterParams) => {
      return params.value.startsWith("-")
        ? { color: "red" }
        : { color: "green" };
    },
  },
  {
    field: "percent_change_30d",
    headerName: "30d %",
    width: 110,
    cellStyle: (p: ValueFormatterParams) =>
      p.value?.startsWith("-") ? { color: "#dc2626" } : { color: "#16a34a" },
  },

  {
    field: "value_24",
    headerName: "24h Volume",
    width: 120,
    valueFormatter: (p: ValueFormatterParams) => `$ ${formatNumber(p.value)}`,
  },
  {
    field: "volume_change_24h",
    headerName: "Vol 24h %",
    width: 130,
    suppressSizeToFit: true,
    valueFormatter: (p: ValueFormatterParams) =>
      typeof p.value === "number" ? `${p.value.toFixed(2)}%` : "-",
    cellStyle: (p: ValueFormatterParams) =>
      p.value < 0 ? { color: "#dc2626" } : { color: "#16a34a" },
  },
  {
    field: "market_cap",
    headerName: "Market Cap",
    width: 120,
    maxWidth: 200,
    suppressSizeToFit: true,
    valueFormatter: (p: ValueFormatterParams) => `$ ${formatNumber(p.value)}`,
  },
  {
    field: "high24h",
    headerName: "High 24h",
    width: 120,
    maxWidth: 200,
    suppressSizeToFit: true,
    valueFormatter: (p: ValueFormatterParams) =>
      p.value ? `$ ${formatNumber(p.value)}` : "-",
  },

  {
    field: "low24h",
    headerName: "Low 24h",
    width: 120,
    maxWidth: 200,
    suppressSizeToFit: true,
    valueFormatter: (p: ValueFormatterParams) =>
      p.value ? `$ ${formatNumber(p.value)}` : "-",
  },
  {
    field: "total_supply",
    headerName: "Total Supply",
    hide: true,
    valueFormatter: (p: ValueFormatterParams) =>
      p.value ? formatNumber(p.value) : "-",
  },

  {
    field: "max_supply",
    headerName: "Max Supply",
    hide: true,
    valueFormatter: (p: ValueFormatterParams) =>
      p.value ? formatNumber(p.value) : "-",
  },
];
//---------------------------------------//

function mapCoinsToRowData(coinsArray: Coins[]): RowData[] {
  return coinsArray.map((el) => {
    const p24 = toNumber(el.percent_change_24h);
    const p7d = toNumber(el.percent_change_7d);
    const p30d = toNumber(el.percent_change_30d);

    const exchanges: ExchangeName[] = [];

    if (el.binance) exchanges.push("Binance");
    if (el.bybit) exchanges.push("Bybit");
    if (el.okx) exchanges.push("OKX");
    if (el.kraken) exchanges.push("Kraken");

    return {
      id: el.id,
      rank: el.rating,
      name: el.name,
      symbol: el.symbol,
      img: el.logo,
      price: el.price_usd,

      price_change_24: p24 !== null ? `${p24.toFixed(2)}%` : "-",
      price_change_7d: p7d !== null ? `${p7d.toFixed(2)}%` : "-",
      percent_change_30d: p30d !== null ? `${p30d.toFixed(2)}%` : "-",

      value_24: toNumber(el.volume_24h) ?? 0,
      volume_change_24h: toNumber(el.volume_change_24h) ?? 0,
      market_cap: el.market_cap ?? 0,

      high24h: el.high24h ?? 0,
      low24h: el.low24h ?? 0,
      total_supply: el.total_supply ?? 0,
      max_supply: el.max_supply ?? 0,

      exchanges,

      changed: el.changed ?? false,
      priceDiff: el.priceDiff ?? 0,
    };
  });
}

//-------------------------------------------------------------------------------------//
function updateColHeaders() {
  if (!colDefs.value || colDefs.value.length < 3) return;
  // colDefs.value[0].headerName = window.innerWidth > 768 ? "Rank" : "R";
  if (!gridApi.value) return;

  const isMobile = window.innerWidth < 768;

  // Update header name separately
  const rankCol = gridApi.value.getColumn("rank");
  if (rankCol) {
    rankCol.getColDef().headerName = isMobile ? "R" : "Rank";
  }

  gridApi.value.applyColumnState({
    state: [
      { colId: "rank", pinned: isMobile ? null : "left" },
      { colId: "id", pinned: isMobile ? null : "left" },
      { colId: "img", pinned: isMobile ? null : "left" },
      { colId: "name", pinned: "left" },
    ],
  });
}

//-------------------------------------------------------------------------------------//
onMounted(async () => {
  updateColHeaders();
  window.addEventListener("resize", updateColHeaders);

  const tokenCookie = useCookie("token");
  if (tokenCookie) {
    const userData = useCookie("user").value;
    if (userData) {
      await favoriteStore.getListFavorite();
    }
    await loadCoins(50);
    socketStore.connect();
  }
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateColHeaders);
});
</script>

<style lang="scss" scoped>
.coins {
  margin-bottom: 20px;
}
.coins__head {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  border-bottom: 1px solid var(--accent-color);
  padding: 20px 0;
}
.coins__top-btn {
  display: inline-flex;
  align-items: center;
  gap: 15px;
}
.btn {
  padding: 5px 7px;
  border: none;
  background-color: transparent;
  color: var(--text-color);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    transition: all 0.3s ease;
    transform: scale(1.1);
  }
}
.active-limit {
  color: red;
}
.coins__qr-donate {
  display: flex;
  align-items: center;
  gap: 15px;
}
.qr-donate__title {
  display: flex;
  flex-direction: column;
  align-items: start;

  span {
    font-size: 12px;
    font-family: "Montserrat", sans-serif;
    font-weight: 200;
  }
}
@media (max-width: 510px) {
  .coins__head {
    flex-wrap: wrap-reverse;
  }
  .coins__top-btn {
    width: 100%;
    justify-content: space-between;
  }
  .btn {
    font-size: 12px;
    font-weight: 400;
  }
}
</style>
