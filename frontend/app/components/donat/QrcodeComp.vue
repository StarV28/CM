<template>
  <div>
    <qrcode-vue :value="paymentUri" :size="50" class="donate__qr" />
  </div>
</template>

<script setup lang="ts">
import QrcodeVue from "qrcode.vue";
//---------------------------------------//
const usdtAddress = "TQ6vPRhwH56XgCx1Qb3XZZqsErzGtVBMd3";
const paymentUri = `tron:${usdtAddress}`;
</script>

<style scoped></style>
