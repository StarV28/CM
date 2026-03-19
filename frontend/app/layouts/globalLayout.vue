<template>
  <div class="container">
    <LoadingComp v-if="loading" />
    <div class="wrapper">
      <header>
        <header-comp />
      </header>
      <main>
        <slot />
      </main>
      <footer>
        <footer-comp />
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { useSeoI18n } from "../composables/useSeoI18n";

//---------------------------------------//
const loading = ref(true);
// useSeoI18n();
// const { t } = useI18n();
//---------------------------------------//
onMounted(() => {
  loading.value = false;
});
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  flex: 1 0 auto;
}
main {
  flex: 1;
}
</style>
