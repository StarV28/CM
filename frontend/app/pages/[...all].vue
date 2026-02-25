<template>
  <div class="not-found">
    <h1>404 — Page Not Found</h1>
    <p>{{ t("404.message") }}</p>

    <NuxtLink to="/" class="back">{{ t("404.btn") }}</NuxtLink>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
useSeoMeta({
  title: "Page Not Found — 404",
  description: "The requested page does not exist.",
});
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
  text-align: center;
  padding: 20px;
}
.back {
  margin-top: 20px;
  background: #4c6ef5;
  color: #fff;
  padding: 12px 22px;
  border-radius: 8px;
  text-decoration: none;
}
</style>
