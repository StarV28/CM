<template>
  <div class="container">
    <div class="wrapper">
      <header>
        <header-comp />
      </header>
      <!-- <AdComp id="AdSense" /> -->
      <main>
        <div class="main">
          <main-coins-coin-comp />
          <!-- <main-news-comp /> -->
          <main-exchanges-comp />
        </div>
      </main>
      <footer>
        <footer-comp />
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
  gap: 30px;
}
@media (max-width: 768px) {
  .main {
    display: flex;
    flex-direction: column-reverse;
    gap: 25px;
  }
}
</style>
