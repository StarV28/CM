<template>
  <div class="main">
    <div class="main__nav nav">
      <span class="nav__link-back">
        <NuxtLink to="/">Main Page</NuxtLink>
      </span>
    </div>
    <h1>Analytics Page</h1>
  </div>
</template>

<script setup lang="ts">
import { useAnalyticsStore } from "@/stores/analyticStore";
import { useSSRLocale } from "@/composables/useSSRLocale";

//---------------------------------------//
const { locale } = useSSRLocale();
const lang = locale.value ?? "en";
const analyticStore = useAnalyticsStore();
await analyticStore.getAnalytics(lang);
</script>

<style scoped></style>
