<template>
  <GlobalLayout>
    <user-account-comp v-if="authStore.changeUserComp" />
    <user-update-account-comp v-else />
  </GlobalLayout>
</template>

<script setup lang="ts">
import GlobalLayout from "@/layouts/globalLayout.vue";
import authMiddleware from "../../middleware/auth";
import { useAuthStore } from "@/stores/authStore";
import { useTheme } from "@/utils/useThems";
//-------------------------------------------------------------------------------------//
const authStore = useAuthStore();
//-------------------------------------------------------------------------------------//
definePageMeta({
  middleware: authMiddleware,
});

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

<style lang="scss" scoped></style>
