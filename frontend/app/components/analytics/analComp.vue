<template>
  <div class="main">
    <div class="main__nav">
      <span class="main__link-back">
        <NuxtLink :to="localePath('/')">{{ t("menu.main") }} </NuxtLink>
        <span>-></span> <span>{{ t("anal.title") }}</span>
      </span>
    </div>
    <h1 class="main__title">{{ t("anal.title") }}</h1>
    <div v-if="articles && articles.main" class="article">
      <div class="top">
        <h3 class="top__title">{{ t("anal.titleh3") }}</h3>
        <p class="top__text">{{ articles.main.text }}</p>
        <ul class="top__lists">
          <h5>{{ t("anal.top") }}</h5>
          <li
            v-for="(coin, ind) in articles.main.data.coins"
            :key="ind"
            class="top__items"
          >
            <ul class="top__list">
              <NuxtLink :to="localePath(getCoinRoute(coin))">
                <h5 class="top__item-title">{{ coin.symbol }}</h5>
              </NuxtLink>
              <li class="top__item">
                <span>{{ t("anal.price") }}: </span
                >{{ formatNumber(coin.price) }}$
              </li>
              <li class="top__item">
                <span>{{ t("anal.change") }}: </span
                >{{ formatNumber(coin.change24h) }}$
              </li>
              <li class="top__item">
                <span>{{ t("anal.volume") }}: </span
                >{{ formatNumber(coin.volume) }}$
              </li>
            </ul>
          </li>
        </ul>
        <p class="top__date">Date: {{ articles.main.createdAt }}</p>
      </div>
      <div v-if="articles.previous.length" class="previous">
        <h3 class="previous__title">{{ t("anal.previous") }}</h3>
        <div
          v-for="prev in articles.previous"
          :key="prev.createdAt"
          class="previous__text"
        >
          <h5>{{ t("anal.titleh3") }} {{ prev.createdAt }}</h5>
          <p>{{ prev.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Articles, CoinData } from "../../../types/analytic";
//---------------------------------------//
const { t } = useI18n();
const localePath = useLocalePath();
//---------------------------------------//

defineProps<{ articles: Articles | null | undefined }>();
//---------------------------------------//
const getCoinRoute = (coin: CoinData) => {
  return `/coin/${coin.id}-${coin.symbol}`;
};

//---------------------------------------//

const formatNumber = (n: number | string | null | undefined) => {
  const num = Number(n);

  if (isNaN(num)) return "-";

  return `${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
</script>

<style scoped lang="scss">
.main {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 15px;
  padding: 15px 0;
  &__nav {
    display: inline-flex;
    align-items: start;
    justify-content: space-between;
    gap: 15px;
  }
  &__link-back {
    display: inline-flex;
    align-items: center;
    gap: 7px;

    a {
      font-size: 14px;
      font-weight: 300;
      text-decoration: none;
      color: var(--fan-color);
    }
    span {
      font-size: 14px;
      font-weight: 300;
      color: var(--text-color);
    }
  }
  &__title {
    font-size: 30px;
    font-weight: 200;
    color: var(--text-color);
    margin: 0;
  }
}
.top {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 10px;
  &__title {
    margin: 0;
    font-weight: 300;
    font-size: 14px;
  }
  &__text {
    font-size: 14px;
    font-weight: 200;
    line-height: 1.3;
  }
  &__lists {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 10px;
    margin: 0;
    padding: 0;
    h5 {
      font-size: 14px;
      font-weight: 300;
      margin: 0;
    }
  }
  &__items {
    list-style: none;
    display: flex;
    gap: 7px;
    a {
      text-decoration: none;
    }
    h5 {
      width: 50px;
      color: var(--fan-color);
      &:hover {
        text-decoration: underline;
      }
    }
  }
  &__list {
    display: flex;
    align-items: flex-start;
    padding: 0;
    gap: 15px;
    padding-bottom: 5px;
    border-bottom: 1px solid var(--accent-color);
  }
  &__item {
    display: flex;
    flex-direction: column;
    gap: 5px;
    list-style: none;
    font-size: 12px;
    font-weight: 200;
    span {
      font-size: 12px;
      font-weight: 200;
      color: red;
    }
  }
  &__date {
    font-size: 14px;
    font-weight: 300;
  }
}
.previous__title {
  font-size: 18px;
  font-weight: 300;
}
.previous__text {
  h5 {
    font-size: 14px;
    font-weight: 300;
    margin: 0;
  }
  p {
    font-size: 14px;
    font-weight: 200;
    line-height: 1.3;
  }
}
@media (min-width: 768px) {
  .top {
    &__list {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
      grid-template-rows: auto;
      justify-items: baseline;
    }
  }
}
@media (min-width: 426px) {
  .top {
    &__title {
      font-size: 18px;
    }
    &__text {
      font-size: 16px;
    }
    &__lists {
      width: 100%;
    }
    &__items {
      width: 100%;
      h5 {
        font-size: 16px;
        font-weight: 400;
        width: 150px;
      }
    }
    &__list {
      width: 100%;
      justify-content: space-between;
    }
    &__item {
      flex-direction: row;
      gap: 7px;
      font-size: 16px;
      span {
        font-size: 16px;
      }
    }
  }
  .previous__title {
    font-size: 27px;
  }
  .previous__text {
    h5 {
      font-size: 18px;
    }
    p {
      font-size: 16px;
    }
  }
}
</style>
