<script setup>
import MortgageCalculator from './components/MortgageCalculator.vue';
</script>

<template>
  <div id="app">
    <MortgageCalculator />
  </div>
</template>

<style>
/* 全域樣式重置 */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans TC', 'Microsoft JhengHei',
    sans-serif;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  color: #333;
}

#app {
  min-height: 100vh;
  padding: 2rem 0;
}

/* 數字字體 */
input[type='number'],
.result-value-large,
.summary-value,
td {
  font-variant-numeric: tabular-nums;
}

/* 移除數字輸入框的上下箭頭（Chrome, Safari, Edge, Opera） */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* 移除數字輸入框的上下箭頭（Firefox） */
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
