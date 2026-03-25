<template>
  <div class="main">
    <div class="main__nav nav">
      <span class="nav__link-back">
        <NuxtLink to="/">Main Page</NuxtLink>
      </span>
    </div>
    <div v-if="articles && articles.main">
      <section class="main-article">
        <h1>{{ articles.main.title }}</h1>
        <p>{{ articles.main.text }}</p>
        <ul>
          <li v-for="(coin, ind) in articles.main.data.coins" :key="ind">
            <ul>
              <h5>{{ coin.symbol }}</h5>
              <li><span>price: </span>{{ formatNumber(coin.price) }}$</li>
              <li>
                <span>Change24h: </span>{{ formatNumber(coin.change24h) }}$
              </li>
              <li><span>Volume: </span>{{ formatNumber(coin.volume) }}$</li>
            </ul>
          </li>
        </ul>
        <p>{{ articles.main.createdAt }}</p>
      </section>

      <section v-if="articles.previous.length" class="previous-articles">
        <h3>Previous</h3>
        <div v-for="prev in articles.previous" :key="prev.createdAt">
          <h5>{{ prev.title }} ({{ prev.createdAt }})</h5>
          <p>{{ prev.text }}</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAnalyticsStore } from "@/stores/analyticStore";
import { useSSRLocale } from "@/composables/useSSRLocale";
import type { Articles } from "../../../types/analytic";
//---------------------------------------//

const { locale } = useSSRLocale();
const lang = locale.value ?? "en";
const analyticStore = useAnalyticsStore();

const articles = ref<Articles | null>(null);
//---------------------------------------//
const formatNumber = (n: number | string | null | undefined) => {
  const num = Number(n);

  if (isNaN(num)) return "-";

  return `${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
//---------------------------------------//

onMounted(async () => {
  try {
    articles.value = await analyticStore.getAnalytics(lang);
  } catch (err) {
    console.error("Failed to fetch analytics:", err);
  }
});
</script>

<style scoped lang="scss"></style>
