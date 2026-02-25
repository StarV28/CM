<template>
  <button class="btn" @click="openEx">{{ t("exchanges.btn-open") }}</button>
  <loading-comp v-if="loading" />
  <div v-else :class="[isActive ? 'active' : '', 'ex-body']">
    <div v-for="(ex, ind) in exchanges" :key="ind" class="ex-box">
      <client-only>
        <apexchart
          class="ex-box__item"
          width="100%"
          height="250px"
          type="candlestick"
          :options="baseOptions"
          :series="[{ data: ex.chartCandles || [] }]"
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
import { useSocketStore } from "@/stores/socketStore";
//-------------------------------------------------------------------------------------//
const { t } = useI18n();

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

const exchanges = ref<Exchanges[]>([]);

//-------------------------------------------------------------------------------------//

const socketStore = useSocketStore();
const exchangesStore = useExchangesStore();

exchanges.value = (await exchangesStore.getExchanges()) || [];
const loading = computed(() => exchangesStore.loading);
//-------------------------------------------------------------------------------------//
watch(
  () => socketStore.data.exchanges,
  (newValue) => {
    if (!newValue?.length) return;

    newValue.forEach((update) => {
      const index = exchanges.value.findIndex((ind) => ind.key === update.key);
      if (index !== -1 && exchanges.value[index]) {
        const apexCandles = (update.candles as Candle[]).map((c) => ({
          x: c.time,
          y: [c.open, c.high, c.low, c.close],
        }));

        exchanges.value[index].chartCandles = apexCandles;
      }
    });
  },
);

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
onMounted(() => {
  socketStore.send({ type: "get-exchanges" });
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
    font-family: "Montserrat", sans-serif;
    text-transform: capitalize;
  }
  h4 {
    font-weight: 100;
    font-family: "Montserrat", sans-serif;
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
</style>
