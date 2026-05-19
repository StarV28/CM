<template>
  <GlobalLayout>
    <!-- <AdComp id="AdSense" /> -->
    <!-- <MainRatesComp id="charts" /> -->
    <!-- <section class="seo-text" style="opacity: 0; height: 0; overflow: hidden">
      <h2>{{ t("seoText.heading") }}</h2>
      <p>{{ t("seoText.paragraph1") }}</p>
      <p>{{ t("seoText.paragraph2") }}</p>
    </section> -->
    <MainCoinsComp id="coins" />
    <!-- <AdComp id="AdSense" /> -->
    <!-- <MainExchangesComp /> -->
    <MainNewsComp id="news" />
    <!-- <AdComp id="AdSense" /> -->
  </GlobalLayout>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import GlobalLayout from "~/layouts/globalLayout.vue";
import { useTheme } from "@/utils/useThems";
import { useSeo } from "@/composables/useSeo";
import { useCoinsStore } from "@/stores/coinsStore";
import { useFavoriteStore } from "@/stores/favoriteStore";
useSeo();
//-------------------------------------------------------------------------------------//
// const { t } = useI18n();
const coinsStore = useCoinsStore();
const favoriteStore = useFavoriteStore();

const user = useCookie("user");
const token = useCookie("token");

await useAsyncData("home-page", async () => {
  let favorites = null;

  if (token.value && user.value) {
    await favoriteStore.getListFavorite();
    favorites = favoriteStore.favoriteArr;
  }

  return await coinsStore.getCoinsApi(50, favorites);
});
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
