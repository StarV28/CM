<template>
  <loading-comp v-if="loading" />
  <div v-else>
    <div v-if="coin" class="coin">
      <section class="seo-text">
        <h1>{{ t("seo.coinTitle", { name: coin.name }) }}</h1>
        <p>{{ t("seo.coinDescription", { name: coin.name }) }}</p>
      </section>

      <div class="coin__back">
        <nuxt-link :to="localePath('/')">{{ t("menu.main") }}</nuxt-link>
        <span> -> </span>
        <span>{{ coin.name }}</span>
      </div>
      <div class="coin__main-coin main-coin">
        <div class="main-coin__title">
          <div class="main-coin__image">
            <img :src="coin.logo" alt="Coin" />
          </div>
          <div class="main-coin__title-box">
            <h2>{{ coin.name }}</h2>
            <h4>
              Rank: <span>{{ coin.rating }}</span>
            </h4>
          </div>
        </div>
        <div class="main-coin__price-us" :class="formattedPrice">
          <h3>Price:</h3>
          <span> {{ formatNumber(coin.price_usd) }} $ </span>
          <span
            class="present"
            :class="coin.percent_change_24h >= 0 ? 'positive' : 'negative'"
          >
            {{ Math.abs(coin.percent_change_24h).toFixed(2) }}
            %
          </span>
        </div>
      </div>
      <div v-if="exchanges" class="coin__trad trad">
        <div v-for="(ex, ind) in exchanges" :key="ind" class="trad__ex">
          <h5>
            Exchange: <span>{{ ex }}</span>
          </h5>
          <a :href="getUrl(ex)" target="_blank" rel="noopener">Buy</a>
        </div>
      </div>
      <div class="coin__data data">
        <div class="data__market-camp">
          <h5>{{ t("coin.marketCap") }}</h5>
          <span>{{ formatNumber(coin.market_cap) }}</span>
        </div>
        <div class="data__market-cap-change-24">
          <h5>{{ t("coin.marketCap24") }}</h5>
          <div class="data__box">
            <!-- <span
              :class="coin.market_cap_change_24h >= 0 ? 'positive' : 'negative'"
            >
              {{ formatNumber(coin.market_cap_change_24h).replace("-", "") }}
            </span> -->
            <!-- <span>/</span> -->
            <span
              :class="
                coin.market_cap_change_percentage_24h >= 0
                  ? 'positive'
                  : 'negative'
              "
              >{{
                Math.abs(coin.market_cap_change_percentage_24h).toFixed(2)
              }}
              %</span
            >
          </div>
        </div>
        <div class="data__total-supply">
          <h5>{{ t("coin.totalSupply") }}</h5>
          <span>{{ formatNumber(coin.total_supply) }}</span>
        </div>
        <div class="data__max-supply">
          <h5>{{ t("coin.maxSupply") }}</h5>
          <span>{{
            coin.max_supply > 0 ? formatNumber(coin.max_supply) : "∞"
          }}</span>
        </div>
        <div class="data__circulating-supply">
          <h5>{{ t("coin.circSupply") }}</h5>
          <span>{{ formatNumber(coin.circulating_supply) }}</span>
        </div>
        <div class="data__volume-24">
          <h5>{{ t("coin.volume24") }}</h5>
          <span>{{ formatNumber(coin.volume_24h) }} $</span>
        </div>
        <div class="data__volume-change-24">
          <h5>{{ t("coin.volumeChange24") }}</h5>
          <span>{{ formatNumber(coin.volume_change_24h) }} $</span>
        </div>
        <div class="data__high-24">
          <h5>{{ t("coin.high24") }}</h5>
          <span>{{ formatNumber(coin.high_24h) }} $</span>
        </div>
        <div class="data__low-24">
          <h5>{{ t("coin.low24") }}</h5>
          <span>{{ formatNumber(coin.low_24h) }} $</span>
        </div>
        <div class="data__price-change-percentage-24h">
          <h5>{{ t("coin.priceChPre24h") }}</h5>
          <div class="data__box">
            <span
              :class="coin.percent_change_24h >= 0 ? 'positive' : 'negative'"
            >
              <span v-if="coin.percent_change_24h < 0">▼</span>
              <span v-if="coin.percent_change_24h >= 0">▲</span>
              {{ Math.abs(coin.percent_change_24h).toFixed(2) }} %</span
            >
          </div>
        </div>
        <div class="data__price-change-percentage-7d">
          <h5>{{ t("coin.priceChPre7d") }}</h5>
          <div class="data__box">
            <span
              :class="coin.percent_change_7d >= 0 ? 'positive' : 'negative'"
            >
              <span v-if="coin.percent_change_7d < 0">▼</span>
              <span v-if="coin.percent_change_7d >= 0">▲</span>
              {{ Math.abs(coin.percent_change_7d).toFixed(2) }} %</span
            >
          </div>
        </div>
        <div class="data__price-change-percentage-30">
          <h5>{{ t("coin.priceChPre30d") }}</h5>
          <div class="data__box">
            <span
              :class="coin.percent_change_30d >= 0 ? 'positive' : 'negative'"
            >
              <span v-if="coin.percent_change_30d < 0">▼</span>
              <span v-if="coin.percent_change_30d > 0">▲</span>
              {{ Math.abs(coin.percent_change_30d).toFixed(2) }}
              %</span
            >
          </div>
        </div>
      </div>
      <div class="coin__calculator">
        <h3>{{ t("coin.calculator") }}</h3>
        <div class="block-calc">
          <label>
            {{ coin.name }}
            <input v-model.number="coinAmount" type="number" placeholder="1" />
          </label>
          <span>{{ formatNumber(usdAmount) }} $</span>
        </div>
      </div>
      <div v-if="coin.website" class="coin__web-data">
        <h5>{{ t("coin.website") }}</h5>
        <div class="data__box">
          <a :href="coin.website" target="_blank">{{ coin.website }}</a>
        </div>
      </div>
      <div v-if="coin.explorer" class="coin__explorer">
        <h5>{{ t("coin.explorer") }}</h5>
        <div class="data__box">
          <a :href="coin.explorer" target="_blank">{{ coin.explorer }}</a>
        </div>
      </div>
      <!-- <div class="coin__history history">
        <h3>{{ t("coin.history") }}</h3>
        <div class="history__max-price">
          <div class="history__box">
            <h5>MAX Price:</h5>
            <div class="data__box">
              <span>{{ formatNumber(coin.ath) }} $</span>
              <span v-if="coin.ath >= coin.price_usd" :style="{ color: 'red' }">
                ▼ {{ Math.abs(coin.ath_change_percentage).toFixed(2) }} %
              </span>
            </div>
          </div>
          <span
            >{{ t("coin.data") }}:
            {{
              coin.ath_date ? coin.ath_date.slice(0, 19).replace("T", " ") : "-"
            }}</span
          >
        </div>
        <div class="history__low-price">
          <div class="history__box">
            <h5>LOW Price:</h5>
            <div class="data__box">
              <span>{{ formatNumber(coin.atl) }} $</span>
              <span v-if="coin.atl <= coin.price_usd" :style="{ color: 'red' }">
                ▼ {{ Math.abs(coin.atl_change_percentage).toFixed(2) }} %
              </span>
            </div>
          </div>
          <span
            >{{ t("coin.data") }}:
            {{
              coin.atl_date ? coin.atl_date.slice(0, 19).replace("T", " ") : "-"
            }}</span
          >
        </div>
      </div> -->
      <client-only>
        <div v-if="descriptionTranslator" class="coin__description">
          <h3>{{ t("coin.desc") }} {{ coin.name }}</h3>
          <p>
            {{ descriptionTranslator }}
          </p>
        </div>
      </client-only>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useCoinsStore } from "@/stores/coinsStore";
import type { CoinWithDescription, ExchangeName } from "../../../../types/coin";
import { useSSRLocale } from "@/composables/useSSRLocale";
// import { useSocketStore } from "@/stores/socketStore";
import { useSeoCoin } from "@/composables/useSeo";
import { buildTradeUrl } from "../../../utils/buildLinksEx.helper";

//-------------------------------------------------------------------------------------//

const coinsStore = useCoinsStore();
const route = useRoute();
const id = String(route.params.id).split("-")[0] ?? "";
const coin = ref<CoinWithDescription | null>();
const formattedPrice = ref("");
const { locale } = useSSRLocale();
const localePath = useLocalePath();
const descriptionTranslator = ref<string | null>(null);
const { t } = useI18n();
// const socketStore = useSocketStore();
const loading = computed(() => coinsStore.loading);
//-------------------------------------------------------------------------------------//
coin.value = await coinsStore.getCoinId(id);
const res: unknown = await coinsStore.getDescriptionCoinId(id);
if (res == null) {
  descriptionTranslator.value = null;
} else if (typeof res === "string") {
  descriptionTranslator.value = res;
} else {
  descriptionTranslator.value = String(res);
}
//---------------------------------------//
const symbol = coin.value?.symbol;
const exchanges = computed(() => coin.value?.exchanges);
const getUrl = (ex: ExchangeName) => buildTradeUrl(ex, symbol as string);

//------SEO for coin-------------------------------------------------------------------------------//
if (coin.value) {
  useSeoCoin(coin.value.name);
}
//-------------------------------------------------------------------------------------//
const formatNumber = (n: number | string | null | undefined) => {
  const num = Number(n);

  if (isNaN(num)) return "-";

  return `${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
//-------------------------------------------------------------------------------------//
watch(
  () => coin.value?.price_usd,
  (newPrice, oldPrice) => {
    if (newPrice == null || oldPrice == null) return;
    if (oldPrice < newPrice) {
      formattedPrice.value = "positive";
    } else {
      formattedPrice.value = "negative";
    }
  },
);
//-------------------------------------------------------------------------------------//
const coinAmount = ref<number | string | null>(null);
const usdAmount = ref(coin.value?.price_usd ?? 0);

watch(coinAmount, (newVal) => {
  if (newVal == null || newVal === "") {
    usdAmount.value = coin.value?.price_usd ?? 0;
  } else {
    if (typeof newVal !== "string") {
      usdAmount.value = newVal * (coin.value?.price_usd ?? 0);
    } else {
      usdAmount.value = Number(formatNumber(coin.value?.price_usd));
    }
  }
});

//--------Locale-----------------------------------------------------------------------------//
watch(locale, async (newLocale, oldLocale) => {
  if (newLocale && newLocale !== oldLocale && id) {
    const res: unknown = await coinsStore.getDescriptionCoinId(id);
    if (res == null) {
      descriptionTranslator.value = null;
    } else if (typeof res === "string") {
      descriptionTranslator.value = res;
    } else {
      descriptionTranslator.value = String(res);
    }
  }
});
//-ws------------------------------------------------------------------------------------//
// watch(
//   () => socketStore.data.coin,
//   (newValue) => {
//     if (!newValue || !Array.isArray(newValue)) return;

//     const found = newValue.find((el) => el.id === Number(id));
//     if (found) {
//       coin.value = found;
//     }
//   }
// );
</script>

<style scoped lang="scss">
.positive {
  color: green;
}
.negative {
  color: red;
}
h3 {
  margin: 0;
  font-family: "Inter", sans-serif;
  font-size: 19px;
  font-weight: 700;
  line-height: 1.1;
}
h5 {
  margin: 0;
  font-family: "Inter", sans-serif;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.1;
  text-transform: capitalize;
}
//-------------------------------------------------------------------------------------//
.coin {
  display: flex;
  flex-direction: column;
  gap: 55px;
  align-items: start;
  width: 100%;
  flex: 1;
}
.seo-text {
  h1 {
    font-family: "Montserrat", sans-serif;
    font-size: 18px;
    line-height: 1.1;
    font-weight: 500;
    color: var(--fan-color);
  }
  p {
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    line-height: 1.5;
    font-weight: 200;
    color: var(--fan-color);
  }
}
.coin__back {
  padding: 15px 0 0 0;
  display: flex;
  align-items: center;
  gap: 15px;
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
.main-coin {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 7px;
  align-items: start;
  border-bottom: 1px solid var(--accent-color);
  padding-bottom: 15px;
}
.main-coin__title {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
}
.main-coin__image {
  position: relative;
  width: 30px;
  padding-bottom: 30px;
  overflow: hidden;

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
.main-coin__title-box {
  display: flex;
  gap: 5px;
  align-items: end;
  h2 {
    font-family: "Montserrat", sans-serif;
    font-size: 41px;
    font-weight: 700;
    line-height: 1.1;
    margin: 0;
  }
  h4 {
    font-size: 18px;
    font-weight: 600;
    line-height: 1.4;
    margin: 0;

    span {
      font-family: "Montserrat", sans-serif;
      font-size: 21px;
      font-weight: 700;
      color: blueviolet;
    }
  }
}
.main-coin__price-us {
  display: flex;
  gap: 15px;
  align-items: end;
  padding: 10px 0;

  span {
    font-size: 18px;
    font-weight: 500;
  }
}
.coin__trad {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  gap: 15px;
}
.trad__ex {
  width: 100%;
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 7px;
  border-bottom: 1px dashed rgba(128, 128, 128, 0.19);
  padding-bottom: 2px;

  & a {
    padding: 5px 10px;
    background-color: rgb(0, 128, 0);
    font-size: 12px;
    color: #fff;
    border-radius: 2px;
    text-decoration: none;
    transition: all 0.3s ease;
    &:hover {
      transition: all 0.3s ease;
      box-shadow: 2px 2px 5px var(--text-color);
    }
  }
}
.data {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 25px;
  padding-bottom: 15px;
}
.data__market-camp,
.data__market-cap-change-24,
.data__total-supply,
.data__max-supply,
.data__circulating-supply,
.data__volume-24,
.data__high-24,
.data__low-24,
.data__price-change-percentage-7d,
.data__price-change-percentage-30,
.data__volume-change-24,
.data__price-change-percentage-24h,
.coin__web-data,
.coin__explorer {
  width: 100%;
  display: flex;
  align-items: start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 7px;
  border-bottom: 1px dashed rgba(128, 128, 128, 0.19);
  span {
    font-weight: 500;
    line-height: 1.3;
  }
  @media (max-width: 968px) {
    span {
      font-size: 14px;
    }
  }
}
.data__box {
  display: inline-flex;
  gap: 7px;
  align-items: end;
  overflow: hidden;
}
.coin__calculator {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--accent-color);
}
.block-calc {
  width: 320px;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;

  label {
    display: flex;
    width: 100%;
    padding: 5px 7px;
    gap: 5px;
    align-items: center;
    border: 1px solid var(--accent-color);

    input {
      width: 80%;
      padding: 5px 10px;
      border: none;
      background-color: var(--bg-color);
      color: var(--text-color);
      &::placeholder {
        color: var(--text-color);
      }
    }
  }
  span {
    width: 100%;
    padding: 7px;
    border: 1px solid var(--accent-color);
  }
}
.history {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--accent-color);
}
.history__max-price,
.history__low-price {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 15px;
}
.history__box {
  width: 100%;
  display: flex;
  gap: 15px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px dashed rgba(128, 128, 128, 0.19);
}
.coin__description {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 25px;
  padding-bottom: 15px;

  p {
    font-weight: 200;
    line-height: 1.5;
  }
}
@media (max-width: 968px) {
  h3 {
    font-size: 16px;
  }
  h5 {
    font-size: 14px;
  }
  .coin {
    gap: 25px;
  }
  .coin__back {
    a {
      font-size: 16px;
    }
  }
  .main-coin__title-box {
    h1 {
      font-size: 31px;
      font-weight: 600;
    }
    h4 {
      font-size: 16px;
      font-weight: 500;

      span {
        font-size: 19px;
        font-weight: 600;
      }
    }
  }
  .main-coin__price-us {
    span {
      font-size: 16px;
      font-weight: 400;
    }
  }
  span {
    font-size: 14px;
  }
}
@media (max-width: 520px) {
  h3 {
    font-size: 16px;
  }
  h5 {
    font-size: 14px;
  }
  .seo-text {
    h1 {
      font-size: 16px;
      font-weight: 400;
    }
    p {
      font-size: 16px;
    }
  }
  .coin {
    gap: 25px;
  }
  .coin__back {
    a {
      font-size: 14px;
    }
  }
  .main-coin__title-box {
    h1 {
      font-size: 31px;
      font-weight: 600;
    }
    h4 {
      font-size: 14px;
      font-weight: 500;

      span {
        font-size: 17px;
        font-weight: 600;
      }
    }
  }
  .block-calc {
    max-width: 260px;
  }
  .main-coin__price-us {
    span {
      font-size: 16px;
      font-weight: 400;
    }
  }
  .coin__description {
    gap: 0px;
    padding-bottom: 0px;
    p {
      line-height: 1.5;
    }
  }
  span {
    font-size: 14px;
  }
}
</style>
