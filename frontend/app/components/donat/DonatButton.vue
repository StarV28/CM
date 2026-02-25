<template>
  <div class="donate">
    <h3>Support the project with a Donation</h3>
    <div class="donate__box">
      <!-- <qrcode-vue :value="paymentUri" :size="50" class="donate__qr" /> -->
      <qrcode-comp />
      <a
        class="donate__btn"
        href="https://nowpayments.io/donation?api_key=6a6155c4-b3c7-4b59-9e12-a130378949a0"
        target="_blank"
        rel="noreferrer noopener"
      >
        <img
          src="https://nowpayments.io/images/embeds/donation-button-black.svg"
          alt="Crypto donation button by NOWPayments"
        />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import QrcodeComp from "./QrcodeComp.vue";

// import QrcodeVue from "qrcode.vue";

//---------------------------------------//
// const usdtAddress = "TQ6vPRhwH56XgCx1Qb3XZZqsErzGtVBMd3";
// const paymentUri = `tron:${usdtAddress}?amount=5`;
</script>

<style lang="scss" scoped>
.donate {
  width: 100%;
  text-align: center;

  h3 {
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 200;
    color: var(--text-color);
    border-bottom: 1px solid var(--accent-color);
    padding-bottom: 5px;
  }
}
.donate__box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}
.donate__btn {
  width: 150px;
  overflow: hidden;

  img {
    width: 100%;
  }
}
</style>
