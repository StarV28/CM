import VueApexCharts from "vue3-apexcharts";
import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.client) return;
  nuxtApp.vueApp.use(VueApexCharts);
});
