<template>
  <button class="theme-toggle" @click="toggleTheme">
    <span v-if="theme === 'dark'">☀️</span>
    <span v-else>🌙</span>
  </button>
</template>

<script setup lang="ts">
const { theme, toggleTheme } = useTheme();
// const { t } = useI18n();
</script>

<style scoped>
.theme-toggle {
  display: flex;
  flex-wrap: nowrap;
  gap: 7px;
  background: var(--bg-color);
  border: none;
  padding: 15px 10px;
  border-radius: 6px;
  cursor: pointer;
  color: var(--text-color);
  transition: background 0.3s;
  box-shadow: 1px 1px 3px rgba(196, 196, 196, 0.5);
  transition: all 0.3s ease;
  span {
    font-weight: 500;
    letter-spacing: 0.4px;
  }
  &:hover {
    box-shadow: 2px 2px 5px var(--text-color);
    transition: all 0.3s ease;
    transform: scale(1.05);
  }
}
@media (max-width: 768px) {
  /* .theme-toggle {
    padding: 3px 7px;
  } */
}
</style>
