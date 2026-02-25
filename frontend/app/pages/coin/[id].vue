<template>
  <div>
    <coin-layout />
  </div>
</template>

<script setup lang="ts">
import CoinLayout from "@/layouts/coinLayout.vue";
import { useTheme } from "@/utils/useThems";
//-------------------------------------------------------------------------------------//
onMounted(() => {
  const { setTheme } = useTheme();
  const saved = localStorage.getItem("theme") as "light" | "dark" | null;
  if (saved) setTheme(saved);
  else
    setTheme(
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    );
});
</script>

<style scoped></style>
