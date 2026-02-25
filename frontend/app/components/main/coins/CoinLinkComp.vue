<template>
  <NuxtLink v-if="coinLink" class="link" :to="coinLink" style="cursor: pointer">
    {{ label }}
  </NuxtLink>

  <span v-else class="link">
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import type { ICellRendererParams } from "ag-grid-community";
import { useSSRLocale } from "~/composables/useSSRLocale";

const props = defineProps<{
  params: ICellRendererParams;
}>();

const { locale } = useSSRLocale();

const data = computed(() => props.params?.data ?? null);

const label = computed(() => {
  const d = data.value;
  if (!d) return "";
  return `${d.name} (${String(d.symbol).toUpperCase()})`;
});

const coinLink = computed(() => {
  const d = data.value;
  const loc = locale.value;

  if (!d || !d.id || !loc) return null;

  return {
    name: `coin-id___${loc}`,
    params: { id: d.id },
  };
});
</script>

<style scoped lang="scss">
.link {
  font-weight: 500;
  line-height: 1.1;
  color: var(--text-color);
  text-decoration: none;
  cursor: pointer;
}
</style>
