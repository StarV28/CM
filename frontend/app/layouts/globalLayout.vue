<template>
  <div class="container">
    <LoadingComp v-if="loading" />
    <div class="wrapper">
      <MainRatesComp v-if="route.path === localPath('/')" />
      <header>
        <header-comp />
      </header>
      <main>
        <slot />
      </main>
      <footer>
        <footer-comp id="footer" />
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useLocalePath } from "#i18n";
//---------------------------------------//
const route = useRoute();
const localPath = useLocalePath();
const loading = ref(true);
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
