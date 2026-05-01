<!-- <template>
  <button class="btn" @click="openEx">{{ t("exchanges.btn-open") }}</button>
  <loading-comp v-if="loading" />
  <div v-else id="charts" :class="[isActive ? 'active' : '', 'ex-body']">
    <div v-for="(ex, ind) in exchanges" :key="ind" class="ex-box">
      <client-only>
        <apexchart
          class="ex-box__item"
          width="100%"
          height="250px"
          type="candlestick"
          :options="baseOptions"
          :series="[{ data: ex.candles || [] }]"
        />
        <span class="ex-box__title">
          <h3>{{ ex.key }}</h3>
          <h4>{{ ex.pair }}</h4>
        </span>
      </client-only>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useExchangesStore } from "@/stores/exchangesStore";
// import { useSocketStore } from "@/stores/socketStore";

//-------------------------------------------------------------------------------------//
interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface Exchanges {
  key: string;
  pair: string;
  candles: Candle[];
  chartCandles?: { x: number; y: number[] }[];
}

//---------------------------------------//

const { t } = useI18n();
const exchanges = ref<Exchanges[]>([]);

//-------------------------------------------------------------------------------------//

// const socketStore = useSocketStore();
const exchangesStore = useExchangesStore();

// exchanges.value = (await exchangesStore.getExchanges()) || [];
const loading = computed(() => exchangesStore.loading);
//-------------------------------------------------------------------------------------//
// watch(
//   () => socketStore.data.exchanges,
//   (newValue) => {
//     if (!newValue?.length) return;

//     newValue.forEach((update) => {
//       const index = exchanges.value.findIndex((ind) => ind.key === update.key);
//       if (index !== -1 && exchanges.value[index]) {
//         if (!update.candles?.length) return;
//         const apexCandles = (update.candles as Candle[]).map((c) => ({
//           x: c.time,
//           y: [c.open, c.high, c.low, c.close],
//         }));

//         exchanges.value[index].chartCandles = apexCandles;
//       }
//     });
//   },
// );

//---ApexCharts----------------------------------------------------------------------------------//
// setting for all charts----
const baseOptions = {
  chart: {
    type: "candlestick",
    toolbar: { show: false },
    animations: { enabled: true, speed: 500 },
    background: "black",
  },
  grid: { show: false },
  xaxis: {
    type: "datetime",
    labels: { show: true },
    axisTicks: { show: true },
    axisBorder: { show: true },
  },
  yaxis: { show: true },
  theme: { mode: "dark" },
};
//-------------------------------------------------------------------------------------//
const isActive = ref(false);
const openEx = () => {
  isActive.value = !isActive.value;
};
//-------------------------------------------------------------------------------------//
onMounted(async () => {
  try {
    exchanges.value = (await exchangesStore.getExchanges()) || [];
    console.log("ex", exchanges.value);
    // if (socketStore?.send) {
    //   socketStore.send({ type: "get-exchanges" });
    // }
  } catch (error) {
    console.error("MainExchangesComp mounted error:", error);
  }
});
</script>

<style scoped>
.container {
  position: relative;
}
.ex-body {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  grid-template-rows: auto;
  gap: 10px 15px;

  /* display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 120px; */
}
.ex-box {
  padding: 10px;
}
.ex-box__title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;

  h3 {
    font-weight: 500;
    line-height: 1.1;
    font-family: "Inter", sans-serif;
    text-transform: capitalize;
  }
  h4 {
    font-weight: 100;
    font-family: "Inter", sans-serif;
    line-height: 1.1;
    text-transform: uppercase;
    color: red;
  }
}
.ex-box__item {
  width: 100%;
}
.btn {
  padding: 7px 15px;
  border: none;
  border-radius: 6px;
  background-color: rgba(15, 195, 27, 0.837);
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
  color: var(--text-color);
  box-shadow: 2px 2px 7px var(--text-color);
  margin-top: 20px;
  display: none;
}
@media (max-width: 769px) {
  .btn {
    display: block;
  }
  .ex-body {
    display: none;
  }

  .ex-body.active {
    display: grid;
    margin-top: 20px;
  }

  .ex-box__title {
    h3 {
      font-size: 12px;
      line-height: 0;
    }
    h4 {
      font-size: 12px;
      line-height: 0;
    }
  }
}
@media (max-width: 425px) {
  .btn {
    width: 100%;
  }
}
</style> -->

<template>
  <section class="charts-wrap">
    <button class="btn" @click="toggleCharts">
      <span v-if="!opened">{{ t("exchanges.btn-open") }}</span>
      <span v-else>{{ t("exchanges.btn-close") }}</span>
    </button>

    <loading-comp v-if="loading" />
    <client-only>
      <Transition name="fade">
        <div v-if="opened && !loading" class="charts-grid">
          <div
            v-for="exchange in formattedExchanges"
            :key="exchange.key"
            class="chart-card"
          >
            <div class="chart-head">
              <h3>{{ exchange.key }}</h3>
              <span>{{
                exchange.pair.endsWith("USDT")
                  ? `${exchange.pair.slice(0, -4)}/ USDT`
                  : exchange.pair
              }}</span>
            </div>

            <client-only>
              <apexchart
                width="100%"
                height="250"
                type="candlestick"
                :options="chartOptions"
                :series="[
                  {
                    data: exchange.chartCandles,
                  },
                ]"
              />
            </client-only>
          </div>
        </div>
      </Transition>
    </client-only>
  </section>
</template>

<script setup lang="ts">
import { useExchangesStore } from "@/stores/exchangesStore";
import LoadingComp from "../../LoadingComp.vue";

interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface ExchangeItem {
  key: string;
  pair: string;
  candles: Candle[];
}

const exchangesStore = useExchangesStore();

const { t } = useI18n();
const loading = computed(() => exchangesStore.loading);
const opened = ref(import.meta.client ? window.innerWidth > 768 : true);
const exchanges = ref<ExchangeItem[]>([]);

const toggleCharts = async () => {
  opened.value = !opened.value;

  if (opened.value && !exchanges.value.length) {
    exchanges.value = (await exchangesStore.getExchanges()) || [];
  }
};

const formattedExchanges = computed(() =>
  exchanges.value.map((ex) => ({
    ...ex,
    chartCandles: ex.candles.map((c) => ({
      x: c.time,
      y: [c.open, c.high, c.low, c.close],
    })),
  })),
);

const chartOptions = {
  chart: {
    type: "candlestick",
    toolbar: {
      show: false,
    },
    background: "transparent",
    animations: {
      enabled: true,
      speed: 400,
    },
  },

  theme: {
    mode: "dark",
  },

  grid: {
    borderColor: "#2b2b2b",
    strokeDashArray: 3,
  },

  xaxis: {
    type: "datetime",
    axisTicks: { show: true },
    axisBorder: { show: true },
    labels: {
      datetimeUTC: false,
    },
  },

  yaxis: {
    tooltip: {
      enabled: true,
    },
  },

  tooltip: {
    theme: "dark",
  },
};

onMounted(async () => {
  if (opened.value) {
    exchanges.value = (await exchangesStore.getExchanges()) || [];
  }
});
</script>

<style lang="scss" scoped>
.charts-wrap {
  margin-top: 20px;
}

.btn {
  display: none;
}

.loading-box {
  margin-top: 20px;
  padding: 20px;
}

.charts-grid {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
  gap: 20px;
}

.chart-card {
  background: #111;
  border-radius: 14px;
  padding: 14px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.25);
}

.chart-head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  h3,
  span {
    margin: 0;
    text-transform: capitalize;
    color: #999;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 12px;
  }

  .chart-card {
    padding: 0px;
    border-radius: 10px;
  }
  .chart-head {
    padding: 7px 15px;
    h3,
    span {
      font-size: 12px;
    }
  }
  .btn {
    display: block;
    width: 100%;
    padding: 10px 16px;
    justify-content: center;
    border: none;
    border-radius: 8px;
    background-color: var(--bg-color);
    color: var(--text-color);
    box-shadow: 1px 1px 3px rgba(196, 196, 196, 0.5);
    cursor: pointer;
  }
}
</style>
