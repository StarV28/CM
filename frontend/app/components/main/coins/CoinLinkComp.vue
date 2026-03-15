<template>
  <NuxtLink v-if="coinLink" class="link" :to="coinLink">
    {{ label }}
  </NuxtLink>

  <span v-else class="link__label">
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

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const coinLink = computed(() => {
  const d = data.value;
  const loc = locale.value;

  if (!d || !d.id || !loc) return null;

  return {
    name: `coin-id___${loc}`,
    params: { id: `${d.id}-${slugify(d.name)}` },
  };
});
</script>

<style scoped lang="scss"></style>
