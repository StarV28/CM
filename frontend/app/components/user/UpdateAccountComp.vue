<template>
  <loading-comp v-if="authStore.loading" />
  <div v-else class="wrapper">
    <div class="link-back">
      <span @click="backAccount">{{ t("user.back") }}</span>
    </div>
    <form class="form" @submit="onSubmit">
      <div class="form__box-inp">
        <label>{{ t("user.name") }}</label>
        <Field name="userName" type="text" />
        <ErrorMessage name="userName" class="error" />
      </div>
      <div class="form__box-inp">
        <label>{{ t("user.email") }}</label>
        <Field name="email" type="email" />
        <ErrorMessage name="email" class="error" />
      </div>
      <button class="form__btn">
        {{ t("auth.send") }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useForm, Field, ErrorMessage } from "vee-validate";
import { changeAccount } from "@/utils/validation/auth";
import { useAuthStore } from "@/stores/authStore";
import type { User } from "../../../types/user";
import { useUserStore } from "@/stores/userStore";
import type { ApiErrorResponse } from "../../../types/error.type";

//-------------------------------------------------------------------------------------//
const authStore = useAuthStore();
const { t } = useI18n();
const userStore = useUserStore();

//-------------------------------------------------------------------------------------//
function backAccount() {
  authStore.changeUserComp = true;
}

//-------------------------------------------------------------------------------------//
const { handleSubmit, resetForm } = useForm({
  validationSchema: changeAccount,
});
//-------------------------------------------------------------------------------------//
const onSubmit = handleSubmit(async (values) => {
  if (values.userName === undefined && values.email === undefined) {
    return;
  }
  const user = useCookie<User | null>("user");
  if (!user.value) {
    throw new Error("User is not available");
  }

  const payload: User = {
    id: user.value.id,
    name: values.userName ?? user.value?.name,
    email: values.email ?? user.value?.email,
  };

  const res = await userStore.updateUser(payload);
  resetForm();

  if (res?.success === false) {
    const errorMessage =
      Array.isArray(res.errors) &&
      res.errors.length > 0 &&
      res.errors[0] &&
      typeof res.errors[0] === "object" &&
      "message" in res.errors[0]
        ? (res.errors[0] as ApiErrorResponse).message
        : typeof res.message === "string"
        ? res.message
        : "Error Update User";
    alert(errorMessage);
    return;
  } else {
    alert("Update User successful");
    authStore.changeUserComp = true;
  }
});
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 25px 0;
}
.link-back {
  cursor: pointer;
  span {
    font-size: 14px;
    font-weight: 500;
    color: var(--fan-color);
    text-decoration: underline;
    transition: all 0.3s ease;
    &:hover {
      transition: color 0.3s ease;
      text-decoration: none;
    }
  }
}
.form {
  max-width: 400px;
  margin: 40px auto;
  padding: 35px;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  gap: 25px;
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
.error {
  color: red;
  font-size: 14px;
  font-weight: 200;
}
</style>
