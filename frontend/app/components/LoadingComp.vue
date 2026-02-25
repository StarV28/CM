<template>
  <div class="loading">
    <svg viewBox="0 0 200 60" class="ekg">
      <polyline
        class="line"
        :points="points"
        fill="none"
        stroke="url(#grad)"
        stroke-width="2"
        vector-effect="non-scaling-stroke"
      />
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ff3b1f" />
          <stop offset="50%" stop-color="#ff8c00" />
          <stop offset="100%" stop-color="#ff3b1f" />
        </linearGradient>
      </defs>
    </svg>
    <h3>Loading...</h3>
  </div>
</template>

<script setup lang="ts">
const points =
  "0,30 20,30 30,10 40,50 50,30 60,30 70,15 80,45 90,30 100,30 120,10 140,50 160,30 180,30 200,30";
</script>

<style scoped lang="scss">
.loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;

  h3 {
    font-size: 21px;
    font-weight: 200;
    color: rgba(128, 128, 128, 0.421);
  }
}

.ekg {
  width: 200px;
  height: 60px;
  polyline {
    stroke-dasharray: 300;
    stroke-dashoffset: 300;
    animation: pulse 1.5s linear infinite;
  }
}

@keyframes pulse {
  0% {
    stroke-dashoffset: 300;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
</style>
