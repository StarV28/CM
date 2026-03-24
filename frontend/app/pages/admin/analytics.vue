<template>
  <div class="main">
    <h1>admin panel, analytics</h1>
    <form ref="formRef" class="form" @submit.prevent="onSubmit">
      <label>
        text
        <textarea v-model="text" />
      </label>
      <label>
        language
        <select id="" v-model="lang" name="lang">
          <option value="ua">ua</option>
          <option value="en">en</option>
          <option value="de">de</option>
          <option value="tr">tr</option>
          <option value="hi">hi</option>
        </select>
      </label>
      <button class="form__btn">Update Text Analytics</button>
    </form>
  </div>
</template>

<script setup lang="ts">
const text = ref("");
const lang = ref("ua");
const formRef = ref<HTMLFormElement | null>(null);
//---------------------------------------//

const onSubmit = () => {
  const payload = { text: text.value, lang: lang.value };
  console.log("------------", payload);
  formRef.value?.reset();
};
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  min-height: 100vh;
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: start;
}
.form {
  min-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 15px;

  label {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 5px;
    text-transform: capitalize;
    color: rgb(117, 14, 212);
  }

  &__btn {
    width: 320px;
    padding: 5px 15px;
    text-align: center;
    color: red;
    font-size: 14px;
  }
}
</style>
