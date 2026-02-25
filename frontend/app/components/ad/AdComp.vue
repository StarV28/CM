<template>
  <div class="ad-wrapper">
    <div v-if="isDev" class="ad__placeholder">AD__PLACEHOLDER</div>
    <div v-else>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const isDev = import.meta.env.DEV;
</script>

<style scoped>
.ad-wrapper {
  width: 100%;
  text-align: center;
  margin: 15px 0;
}
.ad__placeholder {
  width: 100%;
  max-height: 50px;
  border: 2px dashed #aaa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  font-size: 14px;
  background: #f0f0f0;
}
</style>
