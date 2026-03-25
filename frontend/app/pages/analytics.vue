<template>
  <div>
    <GlobalLayout>
      <AnalyticsAnalComp :articles="articles" />
    </GlobalLayout>
  </div>
</template>

<script setup lang="ts">
import GlobalLayout from "../layouts/globalLayout.vue";
import { useAnalyticsStore } from "@/stores/analyticStore";
import { useHead } from "#imports";
import { useSSRLocale } from "@/composables/useSSRLocale";

//---------------------------------------//
const { locale } = useSSRLocale();
const lang = locale.value ?? "en";
const analyticStore = useAnalyticsStore();
//---------------------------------------//
const { data: articles } = await useAsyncData("analytics", () =>
  analyticStore.getAnalytics(lang),
);

//---------------------------------------//

watchEffect(() => {
  if (!articles.value?.main) return;

  useHead({
    title: articles.value.main.title,
    script: [
      {
        key: "ld-json",
        type: "application/ld+json",
        innerHTML: JSON.stringify(articles.value.main.schema),
      },
    ],
  });
});
//---------------------------------------//
onMounted(async () => {
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
