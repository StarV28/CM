<template>
  <div class="wrapper">
    <h1>{{ t("auth.forget-pass") }}</h1>
    <form v-if="changeTypeEmail" class="form" @submit="onSubmit">
      <div class="form__box-inp">
        <label>{{ t("auth.enter-email") }}</label>
        <Field name="email" type="email" />
        <ErrorMessage name="email" class="error" />
      </div>
      <span v-show="attempts" class="attempts"
        >{{ t("auth.attempts") }} {{ attempts }}</span
      >
      <button class="form__btn" :disabled="!meta.valid">
        {{ t("auth.send") }}
      </button>
    </form>
    <AuthForgetPassCodeComp v-else />
  </div>
</template>

<script setup lang="ts">
import { useForm, Field, ErrorMessage } from "vee-validate";
import { forgetForm } from "@/utils/validation/auth";
import { useAuthStore } from "@/stores/authStore";
import type { ForgetPassDto } from "../../../types/password-reset";
import { useRouter } from "vue-router";
//-------------------------------------------------------------------------------------//
const { t } = useI18n();
const authStore = useAuthStore();
const changeTypeEmail = ref<boolean>(true);
const attempts = ref<number | null>(null);
const router = useRouter();
const localePath = useLocalePath();
//-------------------------------------------------------------------------------------//
const { handleSubmit, resetForm, meta } = useForm({
  validationSchema: forgetForm,
});
//-------------------------------------------------------------------------------------//
const changeType = () => {
  changeTypeEmail.value = !changeTypeEmail.value;
};
//-------------------------------------------------------------------------------------//
const onSubmit = handleSubmit(async (values) => {
  const payload: ForgetPassDto = {
    email: values.email,
  };

  const result = await authStore.getForgetPass(payload);
  resetForm();

  if (!result?.success) {
    alert(result?.message);
    attempts.value = result?.attempts ?? 0;
    if (attempts.value <= 0) return router.push(localePath("/"));
    return;
  }

  changeType();
});
</script>

<style scoped>
.wrapper {
  max-width: 400px;
  margin: 40px auto;
  padding: 35px;
}
.form {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  gap: 25px;
  &:not(:last-child) {
    margin-bottom: 25px;
  }
}
.form__box-inp {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  gap: 10px;

  input {
    width: 100%;
    padding: 10px 5px;
    border: none;
    border-radius: 6px;
    background-color: var(--bg-color);
    box-shadow: 1px 1px 5px var(--text-color);
    color: var(--text-color);
  }
}
.form__btn {
  width: 100%;
  padding: 7px 15px;
  background-color: green;
  border: none;
  border-radius: 6px;
  box-shadow: 2px 2px 5px var(--text-color);
  color: #ffff;
  cursor: pointer;
}
.form__btn:disabled {
  background-color: rgba(128, 128, 128, 0.5);
}
.error,
.attempts {
  text-transform: capitalize;
  color: red;
  text-transform: capitalize;
  font-weight: 200;
}
</style>
