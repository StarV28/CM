<template>
  <div class="container">
    <div class="wrapper">
      <header>
        <header-comp />
      </header>
      <main>
        <article class="main">
          <h1 class="main__title">{{ t("disc.title-desc") }}</h1>
          <div class="main__list">
            <h5>
              {{ t("disc.data") }} <span>{{ data }}</span>
            </h5>
            <p>{{ t("disc.p1") }}</p>
            <p>{{ t("disc.p2") }}</p>
            <h5>{{ t("disc.h51") }}</h5>
            <p>{{ t("disc.p3") }}</p>
            <h5>{{ t("disc.h52") }}</h5>
            <p>{{ t("disc.p4") }}</p>
            <h5>{{ t("disc.h53") }}</h5>
            <p>{{ t("disc.h61") }}</p>
            <ul>
              <li>{{ t("disc.li1") }}</li>
              <li>{{ t("disc.li2") }}</li>
              <li>{{ t("disc.li3") }}</li>
              <li>{{ t("disc.li4") }}</li>
              <li>{{ t("disc.li5") }}</li>
              <li>{{ t("disc.li6") }}</li>
              <p>{{ t("disc.p5") }}</p>
            </ul>
            <h5>{{ t("disc.h54") }}</h5>
            <p>{{ t("disc.p6") }}</p>
            <h5>{{ t("disc.h55") }}</h5>
            <p>{{ t("disc.p7") }}</p>
            <h5>{{ t("disc.h56") }}</h5>
            <p>{{ t("disc.p8") }}</p>
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
const data = new Date().toISOString().slice(0, 10);
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
  h5 {
    font-family: "Montserrat", sans-serif;
    font-size: 19px;
    font-weight: 500;
    line-height: 1.1;
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
