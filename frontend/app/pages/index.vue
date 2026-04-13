<template>
  <GlobalLayout>
    <!-- <AdComp id="AdSense" /> -->
    <MainRatesComp id="charts" />
    <section class="seo-text" style="opacity: 0; height: 0; overflow: hidden">
      <h2>{{ t("seoText.heading") }}</h2>
      <p>{{ t("seoText.paragraph1") }}</p>
      <p>{{ t("seoText.paragraph2") }}</p>
    </section>
    <MainCoinsComp id="coins" />
    <!-- <AdComp id="AdSense" /> -->
    <MainExchangesComp />
    <MainNewsComp id="news" />
    <!-- <AdComp id="AdSense" /> -->
  </GlobalLayout>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import GlobalLayout from "~/layouts/globalLayout.vue";
import { useTheme } from "@/utils/useThems";
import { useSeo } from "@/composables/useSeo";
useSeo();
//-------------------------------------------------------------------------------------//
const { t } = useI18n();
//-------------------------------------------------------------------------------------//
onMounted(() => {
  const { setTheme } = useTheme();
  const saved = localStorage.getItem("theme") as "light" | "dark" | null;
  if (saved) setTheme(saved);
  else
    setTheme(
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",
    );
});
</script>

<style lang="scss" scoped></style>
