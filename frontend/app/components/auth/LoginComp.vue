<template>
  <div class="wrapper">
    <h1>{{ t("auth.login") }}</h1>

    <form class="form" @submit.prevent="onSubmit">
      <!-- Email -->
      <div class="form__box-inp">
        <label>{{ t("auth.email") }}</label>
        <Field name="email" type="email" />
        <ErrorMessage name="email" class="error" />
      </div>

      <!-- Password -->
      <div class="form__box-inp">
        <div class="form__block-pass">
          <label>{{ t("auth.pass") }}</label>
          <span @click="forgetPass">{{ t("auth.forgot") }}</span>
        </div>
        <Field name="password" :type="showPass ? 'text' : 'password'" />
        <ErrorMessage name="password" class="error" />
      </div>
      <div class="form__warning">
        <div class="form__checkbox">
          <label>{{ t("auth.show-pass") }}</label>
          <input v-model="showPass" type="checkbox" />
        </div>
        <span v-show="attempts" class="attempts"
          >{{ t("auth.attempts") }} {{ attempts }}</span
        >
      </div>
      <!-- Btn Submit -->
      <button class="form__btn" type="submit" :disabled="!meta.valid">
        {{ t("auth.send") }}
      </button>
    </form>
    <!-- LogIn Registration with Google-->
    <button class="form__btn" type="button" @click="loginWithGoogle">
      <span>{{ t("auth.google") }}</span>
    </button>
    <!-- Link on registration -->
    <div class="link-register">
      <span>{{ t("auth.dont") }} </span>
      <nuxt-link :to="localePath('auth-registration')">
        {{ t("auth.register") }}</nuxt-link
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { useForm, Field, ErrorMessage } from "vee-validate";
import { loginForm } from "@/utils/validation/auth";
import { useAuthStore } from "@/stores/authStore";
import type { LoginDto } from "../../../types/auth";
import { useSSRLocale } from "@/composables/useSSRLocale";
import { useRouter, useRoute } from "vue-router";

//------------------------------------------//
const localePath = useLocalePath();
const { t } = useI18n();
const authStore = useAuthStore();
const showPass = ref<boolean>(false);
const router = useRouter();
const { locale } = useSSRLocale();
const attempts = ref<number | null>(null);

const config = useRuntimeConfig();
const baseUrl = config.public.apiUrl;
//-----------------------------------------//
const emit = defineEmits(["toggle"]);
function forgetPass() {
  emit("toggle", true);
}
//---------------Enter with Google----------//
const loginWithGoogle = () => {
  window.location.href = `${baseUrl}/auth/google?locale=${locale.value}`;
};

const route = useRoute();

// ---------------- FORM ---------------- //
const { handleSubmit, resetForm, meta } = useForm({
  validationSchema: loginForm,
});

// ---------------- SUBMIT ---------------- //
const onSubmit = handleSubmit(async (values) => {
  const payload: LoginDto = {
    email: values.email,
    password: values.password,
  };
  const res = await authStore.getLogIn(payload);
  resetForm();

  if (res && "message" in res) {
    attempts.value = res.attempts ?? null;
    alert(res.message);
    return;
  }
  router.push(localePath("account"));
});
//-----------------------------------------//
onMounted(async () => {
  const token = route.query.token?.toString();

  if (token) {
    authStore.setToken(token);
    await authStore.fetchUser();
    router.push(localePath("account"));
  }
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
.form__block-pass {
  width: 100%;
  display: inline-flex;
  justify-content: space-between;
  span {
    font-weight: 200;
    color: rgba(154, 150, 150, 0.611);
    cursor: pointer;
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
.link-register {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 25px;
  span,
  a {
    color: var(--text-color);
    text-decoration: none;
    font-weight: 200;
    line-height: 1.4;
  }
  a:hover {
    text-decoration: underline;
    color: orangered;
  }
}
.form__checkbox {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: 7px;
}
.form__warning {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.error,
.attempts {
  color: red;
  font-weight: 700;
  text-transform: capitalize;
}
</style>
