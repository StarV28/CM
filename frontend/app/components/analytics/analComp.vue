<template>
  <div class="main">
    <div class="main__nav nav">
      <span class="nav__link-back">
        <NuxtLink to="/">Main Page </NuxtLink>
        <span>-></span> <span>Analytics Page</span>
      </span>
    </div>
    <h1 class="main__title">Analytics Page</h1>
    <div v-if="articles && articles.main" class="main__article article">
      <section class="article__top top">
        <h3 class="top__title">{{ articles.main.title }}</h3>
        <p class="top__text">{{ articles.main.text }}</p>
        <ul class="top__lists">
          <h5>Top Coins</h5>
          <li
            v-for="(coin, ind) in articles.main.data.coins"
            :key="ind"
            class="top__items"
          >
            <ul class="top__list">
              <h5 class="top__item-title">{{ coin.symbol }}</h5>
              <li class="top__item">
                <span>price: </span>{{ formatNumber(coin.price) }}$
              </li>
              <li class="top__item">
                <span>Change24h: </span>{{ formatNumber(coin.change24h) }}$
              </li>
              <li class="top__item">
                <span>Volume: </span>{{ formatNumber(coin.volume) }}$
              </li>
            </ul>
          </li>
        </ul>
        <p class="article__date">Date: {{ articles.main.createdAt }}</p>
      </section>

      <section v-if="articles.previous.length" class="main__previous previous">
        <h3 class="previous__title">Previous</h3>
        <div
          v-for="prev in articles.previous"
          :key="prev.createdAt"
          class="previous__text"
        >
          <h5>{{ prev.title }} ({{ prev.createdAt }})</h5>
          <p>{{ prev.text }}</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Articles } from "../../../types/analytic";
//---------------------------------------//

defineProps<{ articles: Articles | null | undefined }>();

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
  gap: 25px;
  padding: 15px 0;
}
.main__nav {
  padding: 15px 0 0 0;
  display: flex;
  align-items: center;
  gap: 15px;
  padding-bottom: 5px;
  border-bottom: 1px solid var(--text-color);
  a {
    font-size: 18px;
    text-decoration: none;
    font-weight: 500;
    color: var(--fan-color);
    &:hover {
      text-decoration: underline;
    }
  }
  span {
    font-size: 14px;
    color: var(--text-color);
    font-weight: 200;
  }
}
.main__title,
.previous__title {
  font-size: 31px;
  font-weight: 200;
  line-height: 1.1;
  color: var(--fan-color);
  margin: 0;
}
.top {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 5px;

  &__title {
    font-size: 18px;
    font-weight: 300;
    line-height: 1.1;
    color: var(--text-color);
    margin: 0;
  }

  &__text {
    font-size: 14px;
    font-weight: 300;
    line-height: 1.4;
    letter-spacing: 1px;
    color: var(--text-color);
  }

  &__lists {
    width: 100%;
    margin: 0;
    padding-left: 0;
    display: flex;
    flex-direction: column;
    gap: 7px;

    h5 {
      font-size: 18px;
      font-weight: 300;
      line-height: 1.1;
      color: var(--fan-color);
      margin: 0;
    }
  }
  &__items {
    width: 100%;
    list-style: none;
    margin-bottom: 7px;
  }

  &__list {
    width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    gap: 15px;
    list-style: none;
    padding-left: 0;
  }
  &__item {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 16px;
    font-weight: 300;
    color: green;

    span {
      font-size: 14px;
      font-weight: 300;
      color: var(--text-color);
    }
  }
}
.article__date {
  font-size: 18px;
  color: var(--text-color);
  font-weight: 300;
}
.previous__text {
  h5 {
    font-size: 18px;
    font-weight: 300;
    line-height: 1.1;
    color: var(--text-color);
    margin: 7px 0 0 0;
  }
  p {
    font-size: 14px;
    font-weight: 300;
    line-height: 1.4;
    letter-spacing: 1px;
    color: var(--text-color);
  }
}
</style>
