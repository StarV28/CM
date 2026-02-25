<template>
  <div>
    <form class="form" @submit.prevent="onSubmit">
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
import { changePassword } from "@/utils/validation/auth";
import type { ChangePass } from "../../../types/password-reset";
//-------------------------------------------------------------------------------------//
const localePath = useLocalePath();
const authStore = useAuthStore();
const { t } = useI18n();
const showPass = ref<boolean>(false);
const router = useRouter();

//-------------------------------------------------------------------------------------//
const { handleSubmit, meta, resetForm } = useForm({
  validationSchema: changePassword,
});
//-------------------------------------------------------------------------------------//
const onSubmit = handleSubmit(async (values) => {
  const data: ChangePass = {
    password: values.password,
  };

  resetForm();
  const res = await authStore.changePassword(data);
  if (!res?.success) {
    alert(res?.message ? res.message : "Error change Password");
    router.push(localePath("/"));
  }
  if (res?.success === true) {
    alert("Password change successful ");
    router.push(localePath("account"));
  }
});
</script>

<style scoped>
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
