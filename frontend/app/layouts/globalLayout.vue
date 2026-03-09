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
        <section
          class="seo-text"
          style="opacity: 0; height: 0; overflow: hidden"
        >
          <p>{{ t("seo.bottomText1") }}</p>
          <ul>
            <li>
              <NuxtLink :to="`#coins`">{{ t("seo.topCoins") }}</NuxtLink>
            </li>
            <li>
              <NuxtLink :to="`#charts`">{{ t("seo.charts") }}</NuxtLink>
            </li>
            <li>
              <NuxtLink :to="`#news`">{{ t("seo.news") }}</NuxtLink>
            </li>
          </ul>
          <p>{{ t("seo.bottomText2") }}</p>
        </section>

        <footer-comp />
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSeoI18n } from "../composables/useSeoI18n";
//---------------------------------------//
const loading = ref(true);
useSeoI18n();
const { t } = useI18n();
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
