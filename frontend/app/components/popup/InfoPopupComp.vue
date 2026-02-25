<template>
  <ClientOnly>
    <Teleport to="body">
      <div v-if="favoriteStore.info.show" class="box">
        <p>{{ favoriteStore.info.text }}</p>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useFavoriteStore } from "@/stores/favoriteStore";
//-------------------------------------------------------------------------------------//
const favoriteStore = useFavoriteStore();
//-------------------------------------------------------------------------------------//
watch(
  () => favoriteStore.info.show,
  (newValue) => {
    if (newValue) {
      setTimeout(() => {
        favoriteStore.info.show = false;
      }, 10000);
    }
  }
);
</script>

<style scoped></style>
