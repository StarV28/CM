<template>
  <form v-if="changePass" class="form" @submit="onSubmitCode">
    <div class="form__box-inp">
      <label>{{ t("auth.code-enter") }}</label>
      <Field name="code" type="number" />
      <ErrorMessage name="code" class="error" />
    </div>
    <button class="form__btn" :disabled="!meta.valid">
      {{ t("auth.send") }}
    </button>
  </form>
  <AuthChangePassComp v-else />
</template>

<script setup lang="ts">
import { useForm, Field, ErrorMessage } from "vee-validate";
import { forgetChangeCode } from "@/utils/validation/auth";
import { useAuthStore } from "@/stores/authStore";
import type { CodeForgetDto } from "../../../types/password-reset";
//-------------------------------------------------------------------------------------//
const { t } = useI18n();
const authStore = useAuthStore();
const changePass = ref<boolean>(true);
const router = useRouter();
const localPath = useLocalePath();
//-------------------------------------------------------------------------------------//
const { handleSubmit, resetForm, meta } = useForm({
  validationSchema: forgetChangeCode,
});
//-------------------------------------------------------------------------------------//
const onSubmitCode = handleSubmit(async (values) => {
  const data: CodeForgetDto = {
    code: values.code,
  };
  resetForm();
  const res = await authStore.checkedCodePass(data);

  if (!res?.success) {
    alert("Don't right Code");
    router.push(localPath("/"));
  } else {
    changePass.value = false;
  }
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
.error {
  color: red;
  font-size: 14px;
  font-weight: 200;
}
</style>
