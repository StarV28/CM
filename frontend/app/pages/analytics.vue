<template>
  <div>
    <GlobalLayout>
      <AnalyticsAnalComp />
    </GlobalLayout>
  </div>
</template>

<script setup lang="ts">
import GlobalLayout from "../layouts/globalLayout.vue";
//---------------------------------------//
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
