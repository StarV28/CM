<template>
  <div class="wrapper">
    <h1>{{ t("auth.sign-up") }}</h1>
    <form class="form" @submit.prevent="onSubmit">
      <!-- Username -->
      <div class="form__box-inp">
        <label>{{ t("auth.name") }}</label>
        <Field name="username" type="text" />
        <ErrorMessage name="username" class="error" />
      </div>

      <!-- Email -->
      <div class="form__box-inp">
        <label>{{ t("auth.email") }}</label>
        <Field name="email" type="email" />
        <ErrorMessage name="email" class="error" />
      </div>

      <!-- Password -->
      <div class="form__box-inp">
        <label>{{ t("auth.pass") }}</label>
        <Field name="password" :type="showPass ? 'text' : 'password'" />
        <ErrorMessage name="password" class="error" />
      </div>

      <!-- Confirm -->
      <div class="form__box-inp">
        <label>{{ t("auth.c-pass") }}</label>
        <Field name="confirmPassword" :type="showPass ? 'text' : 'password'" />
        <ErrorMessage name="confirmPassword" class="error" />
      </div>

      <div class="form__checkbox">
        <label>{{ t("auth.show-pass") }}</label>
        <input v-model="showPass" type="checkbox" />
      </div>

      <button class="form__btn" type="submit" :disabled="!meta.valid">
        {{ t("auth.send") }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useForm, Field, ErrorMessage } from "vee-validate";
import { registerSchema } from "@/utils/validation/auth";
import { useAuthStore } from "@/stores/authStore";
import type { CreateUserDto } from "../../../types/auth";
import { useSSRLocale } from "@/composables/useSSRLocale";

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

//-------------------------------------------------------------------------------------//
const localePath = useLocalePath();
const authStore = useAuthStore();
const { t } = useI18n();
const { locale } = useSSRLocale();
const showPass = ref<boolean>(false);
const router = useRouter();
// ---------------- FORM ---------------- //
const { handleSubmit, meta, resetForm } = useForm<RegisterForm>({
  validationSchema: registerSchema,
});

// ---------------- SUBMIT ---------------- //
const onSubmit = handleSubmit(async (values) => {
  const payload: CreateUserDto = {
    name: values.username,
    email: values.email,
    password: values.password,
    locale: locale.value,
  };

  const res = await authStore.getUserCreate(payload);
  resetForm();

  if (res && "success" in res && !res.success) {
    alert("message" in res ? res.message : "Registration failed");
    return;
  }
  router.push(localePath("account"));
});
</script>

<style lang="scss" scoped>
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
}
.form__btn:disabled {
  background-color: rgba(128, 128, 128, 0.5);
}
.form__checkbox {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: 7px;
}
.error {
  color: red;
  font-size: 14px;
  font-weight: 200;
}
</style>
