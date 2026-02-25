import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { defineNuxtPlugin } from "#app";
import { AgGridVue } from "ag-grid-vue3";

export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.client) return;
  ModuleRegistry.registerModules([AllCommunityModule]);
  nuxtApp.vueApp.component("AgGridVue", AgGridVue);
});
