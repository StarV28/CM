<template>
  <div class="header">
    <div class="header__top top">
      <NuxtLink class="top__box-logo" :to="localePath('/')">
        <NuxtImg
          class="top__logo"
          src="/image/logo-CM.jpg"
          format="webp"
          width="45"
          height="45"
          alt="Logo-CM"
        />
        <span>
          <h5>TradMon</h5>
          <p>cryptocurrency aggregator</p>
        </span>
      </NuxtLink>
      <div class="top__nav naw">
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
      <div v-if="showLand" class="top__submenu">
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
    <div v-if="IsMain" class="header__bottom">
      <section class="seo-text">
        <div class="seo-text__title">
          <h1>{{ t("seo.bottomText1") }}</h1>
          <p>{{ t("seo.bottomText2") }}</p>
        </div>
        <ul class="seo-text__menu">
          <li class="seo-text__item">
            <NuxtLink :to="localePath('analytics')" class="seo-text__link">{{
              t("seo.anal")
            }}</NuxtLink>
          </li>
          <li class="seo-text__item">
            <NuxtLink class="seo-text__link" @click="scrollTo('coins')">{{
              t("seo.topCoins")
            }}</NuxtLink>
          </li>
          <li class="seo-text__item">
            <NuxtLink class="seo-text__link" @click="scrollTo('charts')">{{
              t("seo.charts")
            }}</NuxtLink>
          </li>
          <li class="seo-text__item">
            <NuxtLink class="seo-text__link" @click="scrollTo('news')">{{
              t("seo.news")
            }}</NuxtLink>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSSRLocale } from "@/composables/useSSRLocale";
import { icons } from "@/utils/icon";
import type { User } from "../../../types/user";
import { useRoute } from "vue-router";
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
const { t } = useI18n();
const route = useRoute();
//---------------------------------------//
const pathMap = ["/", "/de", "/ua", "/tr", "/hi"];
const IsMain = computed(() => pathMap.includes(route.path));
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
//---------------------------------------//
function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

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
  display: flex;
  flex-direction: column;
  gap: 15px;
  border-bottom: 1px solid var(--accent-color);
}
.header__top {
  position: relative;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--accent-color);
}
.top__logo {
  border-radius: 6px;
}
.top__box-logo {
  display: flex;
  gap: 10px;
  align-items: center;
  text-decoration: none;

  span {
    display: flex;
    flex-direction: column;
    gap: 5px;
    h5 {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
      font-family: "Montserrat", sans-serif;
      color: rgb(226, 176, 50);
      letter-spacing: 1px;
    }
    p {
      margin: 0;
      font-size: 12px;
      font-weight: 200;
      text-transform: capitalize;
      color: var(--text-color);
    }
  }
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
.top__submenu {
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
//---------------------------------------//
.seo-text {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding-bottom: 15px;

  &__title {
    width: 100%;
    padding: 10px 0;
    h1 {
      font-size: 18px;
      line-height: 1.1;
      font-weight: 200;
      color: var(--text-color);
      margin: 0 0 7px 0;
    }
    p {
      font-size: 14px;
      line-height: 1.3;
      font-weight: 200;
      color: var(--text-color);
      margin: 0;
    }
  }
  &__menu {
    width: 100%;
    display: inline-flex;
    justify-content: flex-end;
    align-items: center;
    gap: 15px;
    margin: 0;
    padding: 0;
  }
  &__item {
    list-style: none;
    position: relative;
    cursor: pointer;

    &::before {
      content: "";
      position: absolute;
      top: 100%;
      left: 0;
      width: 10%;
      opacity: 0;
      height: 1px;
      background-color: var(--fan-color);
      transition: all 0.3s ease;
    }
    &:hover {
      &::before {
        transition: all 0.3s ease;
        width: 100%;
        opacity: 1;
      }
    }
  }

  &__link {
    font-family: "Montserrat", sans-serif;
    text-decoration: none;
    font-size: 14px;
    font-weight: 200;
    color: var(--fan-color);
  }
}
@media (max-width: 970px) {
  .seo-text {
    flex-direction: column-reverse;
  }
}
@media (max-width: 768px) {
  .seo-text {
    gap: 5px;
  }
  .seo-text__title {
    h1 {
      font-size: 12px;
    }
    p {
      font-size: 8px;
    }
  }
  .seo-text__link {
    font-size: 12px;
  }
}
@media (max-width: 560px) {
  .top__box-logo {
    display: flex;
    flex-direction: column;
    gap: 5px;
    align-items: start;

    span {
      h5 {
        font-size: 12px;
        font-weight: 500px;
      }
      p {
        font-size: 8px;
        font-weight: 200;
      }
    }
  }
}
</style>
