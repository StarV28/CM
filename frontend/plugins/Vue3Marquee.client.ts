import Vue3Marquee from "vue3-marquee";
import { defineNuxtPlugin } from "nuxt/app";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue3Marquee, { name: "Vue3Marquee" });
});
