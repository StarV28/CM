<template>
  <div class="favorite">
    <span
      ref="star"
      class="favorite__coin"
      :style="{
        cursor: 'pointer',
        color: isFav ? 'gold' : '#888',
      }"
      @click="toggle"
      >★</span
    >
  </div>
</template>

<script setup lang="ts">
// import { useAuthStore } from "@/stores/authStore";
import { useFavoriteStore } from "@/stores/favoriteStore";

//-------------------------------------------------------------------------------------//
// const { t } = useI18n();

// const authStore = useAuthStore();
const favoriteStore = useFavoriteStore();

const props = defineProps(["params"]);
const star = ref<HTMLElement | null>(null);

const isFav = computed(() => {
  return favoriteStore.favoriteArr?.some(
    (f) => f.coinId === props.params.value
  );
});
//-------------------------------------------------------------------------------------//

async function toggle() {
  const userData = useCookie("user").value;
  if (!userData) {
    favoriteStore.openInform();
  }

  const parsed = typeof userData === "string" ? JSON.parse(userData) : userData;
  const user = parsed?.user ?? parsed;

  if (user) {
    const coinId =
      typeof props.params.value === "number"
        ? props.params.value
        : Number(props.params.value);

    if (Number.isNaN(coinId)) return;

    const symbol =
      typeof props.params.data.symbol === "string"
        ? props.params.data.symbol
        : String(props.params.data.symbol);

    const data = { userId: user.id, coinId, symbol: symbol };

    const res = await favoriteStore.addFavoriteCoinUser(data);
    favoriteStore.info.show = true;
    favoriteStore.info.text = res as string;
  } else {
    favoriteStore.clickFavoriteEl = star.value;
    favoriteStore.openInform();
  }
}
</script>

<style scoped></style>
