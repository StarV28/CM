<template>
  <LoadingComp v-if="loading" />
  <div v-else class="rates">
    <client-only>
      <Vue3Marquee :duration="40" pause-on-hover>
        <span v-if="rates.length" class="rates__wrapper">
          <span v-for="(rate, ind) in rates" :key="ind" class="rates__item">
            <span class="rates__bank">{{ rate.bank }}</span>
            <span class="rates__currency">{{ rate.currency_code }}</span>
            <span class="rates__values">
              <span class="buy">{{ rate.rate_buy?.toFixed(2) ?? "-" }}</span> /
              <span class="sell">{{ rate.rate_sell?.toFixed(2) ?? "-" }}</span>
            </span>
            <span v-if="ind !== rates.length - 1" class="separator">|</span>
          </span>
        </span>
      </Vue3Marquee>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRatesStore } from "@/stores/ratesStore";
//-------------------------------------------------------------------------------------//

interface Rates {
  bank: string;
  currency_code: string;
  base_currency: string;
  rate_buy: number | null;
  rate_sell: number | null;
  date: string;
}
//-------------------------------------------------------------------------------------//
const ratesStore = useRatesStore();
const rates = ref<Rates[]>([]);
const loading = computed(() => ratesStore.loading);
//-------------------------------------------------------------------------------------//

onMounted(async () => {
  rates.value = await ratesStore.getRates();
});
</script>

<style scoped lang="scss">
.rates {
  padding: 15px 0;
}
.rates__wrapper {
  display: flex;
  gap: 15px;
  // padding: 10px 0;
  white-space: nowrap;
}

.rates__item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
}

.rates__bank {
  color: rgb(14, 154, 63);
  font-weight: 100;
  font-family: "Inter", sans-serif;
}

.rates__currency {
  color: rgb(228, 27, 27);
  font-weight: 700;
}

.rates__values {
  display: flex;
  align-items: center;
  gap: 5px;
}

.rates__values .buy {
  color: var(--text-color);
  font-weight: 200;
}

.rates__values .sell {
  color: var(--text-color);
  font-weight: 200;
}

.separator {
  margin-left: 5px;
  color: #9ca3af;
}
@media (max-width: 768px) {
  .rates__bank,
  .rates__currency,
  .rates__values .buy,
  .rates__values .sell {
    font-size: 12px;
  }
}
</style>
