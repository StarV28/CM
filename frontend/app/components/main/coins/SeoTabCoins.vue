<template>
  <div class="overflow-x-auto">
    <table class="w-full border-collapse">
      <thead>
        <tr class="border-b border-gray-700 text-left">
          <th class="p-3">#</th>
          <th class="p-3">Coin</th>
          <th class="p-3">Price</th>
          <th class="p-3">24h</th>
          <th class="p-3">7d</th>
          <th class="p-3">30d</th>
          <th class="p-3">24h High</th>
          <th class="p-3">24h Low</th>
          <th class="p-3">Market Cap</th>
          <th class="p-3">Volume 24h</th>
          <th class="p-3">Supply</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="coin in coins"
          :key="coin.symbol"
          class="border-b border-gray-800"
        >
          <td class="p-3">
            {{ coin.rating }}
          </td>

          <td class="p-3">
            <div class="flex items-center gap-3">
              <img
                :src="coin.logo"
                :alt="coin.name"
                width="32"
                height="32"
                loading="lazy"
              />

              <div>
                <div>{{ coin.name }}</div>
                <div class="text-sm text-gray-400">
                  {{ coin.symbol }}
                </div>
              </div>
            </div>
          </td>

          <td class="p-3">
            {{ toNumber(coin.price_usd) }}
          </td>

          <td
            class="p-3"
            :class="
              Number(coin.percent_change_24h) >= 0
                ? 'text-green-500'
                : 'text-red-500'
            "
          >
            {{ Number(coin.percent_change_24h).toFixed(2) }}%
          </td>

          <td
            class="p-3"
            :class="
              Number(coin.percent_change_7d) >= 0
                ? 'text-green-500'
                : 'text-red-500'
            "
          >
            {{ Number(coin.percent_change_7d).toFixed(2) }}%
          </td>

          <td
            class="p-3"
            :class="
              Number(coin.percent_change_30d) >= 0
                ? 'text-green-500'
                : 'text-red-500'
            "
          >
            {{ Number(coin.percent_change_30d).toFixed(2) }}%
          </td>

          <td class="p-3">
            {{ toNumber(coin.high24h) }}
          </td>

          <td class="p-3">
            {{ toNumber(coin.low24h) }}
          </td>

          <td class="p-3">${{ toNumber(coin.market_cap) }}</td>

          <td class="p-3">${{ toNumber(coin.volume_24h) }}</td>

          <td class="p-3">
            {{ toNumber(coin.max_supply) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Coins } from "../../../../types/coin";

//---------------------------------------//

defineProps<{ coins: Coins[] }>();

//---------------------------------------//

const toNumber = (v: unknown): number | null => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};
</script>

<style scoped></style>
