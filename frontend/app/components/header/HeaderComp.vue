<template>
  <div class="header">
    <NuxtLink :to="localePath('/')">
      <NuxtImg
        class="header__logo"
        src="/image/logo-CM.jpg"
        format="webp"
        width="45"
        height="45"
        alt="Logo-CM"
      />
    </NuxtLink>
    <div class="header__nav naw">
      <nuxt-link
        :to="user ? localePath('account') : localePath('auth-login')"
        class="naw__btn"
      >
        <icons.login width="15" height="15" />
      </nuxt-link>
      <button type="button" class="naw__btn" @click="toggleLang()">
        <span>{{ localeTitle }}</span>
      </button>
      <HeaderThemesThemToggle />
    </div>
    <div v-if="showLand" class="header__submenu">
      <div class="submenu">
        <span class="submenu__closes" @click="closesWindLand()">❌</span>
        <ul class="submenu__list">
          <li class="submenu__item" @click="setLand('en')">🇬🇧 English</li>
          <li class="submenu__item" @click="setLand('de')">🇩🇪 Deutsch</li>
          <li class="submenu__item" @click="setLand('ua')">🇺🇦 Українська</li>
          <li class="submenu__item" @click="setLand('tr')">🇹🇷 Türkçe</li>
          <li class="submenu__item" @click="setLand('hi')">🇮🇳 हिन्दी</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSSRLocale } from "@/composables/useSSRLocale";
import { icons } from "@/utils/icon";
import type { User } from "../../../types/user";

//-------------------------------------------------------------------------------------//
type LocaleCode =
  | "en"
  // | "en-US"
  | "de"
  // | "de-DE"
  | "ua"
  // | "uk-UA"
  | "tr"
  // | "tr-TR"
  | "hi";
// | "hi-IN";

//-------------------------------------------------------------------------------------//
const showLand = ref(false);
const { locale, setLang } = useSSRLocale();
const localePath = useLocalePath();
const user = ref<User | null>(null);
//--toggle land-----------------------------------------------------------------------------------//
const toggleLang = () => {
  showLand.value = !showLand.value;
};
const closesWindLand = () => {
  showLand.value = false;
};
const setLand = (land: LocaleCode) => {
  // locale.value = land;
  showLand.value = false;
  setLang(land);
};

//-------------------------------------------------------------------------------------//
const localeTitle = computed(() => {
  switch (locale.value) {
    case "en":
      return "🇬🇧";
    case "de":
      return "🇩🇪";
    case "ua":
      // case "uk-UA":
      return "🇺🇦";
    case "tr":
      return "🇹🇷";
    case "hi":
      return "🇮🇳";
    default:
      return "🌍";
  }
});
//-------------------------------------------------------------------------------------//
onMounted(() => {
  const token = useCookie("token");
  if (!token.value) return;

  const userData = useCookie("user").value;
  if (!userData) return;

  const parsed = typeof userData === "string" ? JSON.parse(userData) : userData;
  user.value = parsed?.user ?? parsed;
});
</script>

<style scoped lang="scss">
.header {
  position: relative;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--accent-color);
  // box-shadow: 2px 2px 7px var(--accent-color);
  // border-radius: 6px;
}
.header__logo {
  border-radius: 6px;
}

.naw {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 15px;

  &__btn {
    background-color: var(--bg-color);
    border: none;
    padding: 15px 10px;
    border-radius: 6px;
    cursor: pointer;
    color: var(--text-color);
    transition: background 0.3s;
    box-shadow: 1px 1px 3px rgba(196, 196, 196, 0.5);
    transition: all 0.3s ease;
    &:hover {
      box-shadow: 2px 2px 5px var(--text-color);
      transition: all 0.3s ease;
      transform: scale(1.05);
    }
  }
}
.header__submenu {
  position: absolute;
  top: 110%;
  left: 0;
  width: 100%;
  box-shadow: 2px 2px 7px 2px;
  border-radius: 6px;
  z-index: 999;
  background-color: var(--bg-color);
}
.submenu {
  padding: 25px 15px;
  position: relative;
  &__closes {
    position: absolute;
    top: 15px;
    right: 15px;
    cursor: pointer;
  }
  &__list {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
    grid-template-rows: auto;
    gap: 25px 10px;
  }

  &__item {
    display: flex;
    flex-wrap: nowrap;
    gap: 10px;
    font-weight: 400;
    cursor: pointer;
  }
}
@media (max-width: 768px) {
  // .naw {
  //   flex-direction: column;
  //   gap: 25px;
  // }
  // .naw__btn {
  //   padding: 10px 10px;
  // }
}
</style>
