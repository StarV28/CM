<template>
  <ClientOnly>
    <Teleport to="body">
      <div
        v-if="favoriteStore.showInform"
        ref="popupEl"
        class="favorite__inform"
      >
        <p>
          Register to unlock this feature. Pick up to 5 favorite coins, and
          we’ll always show them at the top.
        </p>
        <div class="favorite__blok-btn">
          <NuxtLink :to="localePath('auth-login')" @click="closeInform"
            >LogIn</NuxtLink
          >
          <NuxtLink :to="localePath('auth-registration')" @click="closeInform"
            >Sign Up</NuxtLink
          >
        </div>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useFavoriteStore } from "@/stores/favoriteStore";

//-------------------------------------------------------------------------------------//
const popupEl = ref<HTMLElement | null>(null);
const localePath = useLocalePath();
const favoriteStore = useFavoriteStore();
//-------------------------------------------------------------------------------------//
const closeInform = () => {
  favoriteStore.closeInform();
};

//-------------------------------------------------------------------------------------//
onMounted(() => {
  document.addEventListener("click", (e) => {
    if (
      favoriteStore.showInform &&
      popupEl.value &&
      popupEl.value !== e.target &&
      favoriteStore.clickFavoriteEl !== e.target
    ) {
      favoriteStore.closeInform();
    }
  });
});
</script>

<style scoped></style>
