<template>
  <div class="container">
    <div class="wrapper">
      <header>
        <header-comp />
      </header>
      <main>
        <article class="main">
          <h1 class="main__title">{{ t("priv.title") }}</h1>
          <div class="main__list">
            <p>{{ t("priv.p1") }}</p>
            <h3>{{ t("priv.h31") }}</h3>
            <p>{{ t("priv.p2") }}</p>
            <ul>
              <li>{{ t("priv.li1") }}</li>
              <li>{{ t("priv.li2") }}</li>
              <li>{{ t("priv.li3") }}</li>
            </ul>
            <p>{{ t("priv.p3") }}</p>
            <h3>{{ t("priv.h32") }}</h3>
            <p>{{ t("priv.p4") }}</p>
            <ul>
              <li>{{ t("priv.li4") }}</li>
              <li>{{ t("priv.li5") }}</li>
              <li>{{ t("priv.li6") }}</li>
            </ul>
            <p>{{ t("priv.p5") }}</p>
            <h3>{{ t("priv.h33") }}</h3>
            <p>{{ t("priv.p6") }}</p>
            <h3>{{ t("priv.h34") }}</h3>
            <p>{{ t("priv.p7") }}</p>
          </div>
        </article>
      </main>
      <footer>
        <footer-comp />
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  flex: 1 0 auto;
}
main {
  flex: 1;
}
.main {
  margin-bottom: 35px;
  h1 {
    font-family: "Montserrat", sans-serif;
    font-size: 31px;
    font-weight: 700;
    line-height: 1.1;
  }
  h3 {
    font-family: "Montserrat", sans-serif;
    font-size: 21px;
    font-weight: 500;
    line-height: 1.2;
  }
  p {
    font-size: 18px;
    font-weight: 200;
    line-height: 1.3;
  }
  li {
    font-weight: 200;
    line-height: 1.4;
  }
}
@media (max-width: 769px) {
  .main {
    margin-bottom: 25px;
    h1 {
      font-size: 21px;
      font-weight: 600;
    }
    h3 {
      font-size: 18px;
      font-weight: 500;
    }
    p {
      font-size: 16px;
      font-weight: 200;
    }
    li {
      font-size: 14px;
      font-weight: 200;
      line-height: 1.4;
    }
  }
}
</style>
