<template>
  <GlobalLayout>
    <AuthLoginComp v-if="!forgetPassword" @toggle="handleToggle" />
    <AuthForgetPassEmailComp v-else />
  </GlobalLayout>
</template>

<script setup lang="ts">
import GlobalLayout from "@/layouts/globalLayout.vue";
//-------------------------------------------------------------------------------------//
const forgetPassword = ref<boolean>(false);

function handleToggle(value: boolean) {
  forgetPassword.value = value;
}
</script>

<style scoped></style>
