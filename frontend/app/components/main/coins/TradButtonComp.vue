<template>
  <div class="trad">
    <div class="trad__menu">
      <a
        v-for="ex in exchanges"
        :key="ex.name"
        target="_blank"
        rel="noopener"
        :href="getUrl(ex)"
        >{{ ex }}</a
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ICellRendererParams } from "ag-grid-community";
import { buildTradeUrl } from "../../../utils/buildLinksEx.helper";
import type { ExchangeName } from "../../../../types/coin";

//---------------------------------------//

const props = defineProps<{ params: ICellRendererParams }>();

const symbol = props.params.data.symbol;
const exchanges = computed(() => props.params.data.exchanges);
const getUrl = (ex: ExchangeName) => buildTradeUrl(ex, symbol);
</script>

<style lang="scss">
.trad {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.trad__menu {
  width: 100%;
  padding-left: 15px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  z-index: 2;

  & a {
    font-size: 12px;
  }
}
</style>
