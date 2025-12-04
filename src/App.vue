<script setup>
import { ref } from 'vue';
import ETFCalculator from './components/ETFCalculator.vue';
import MortgageCalculator from './components/MortgageCalculator.vue';

const activeTab = ref('etf'); // 預設為 ETF 試算器

const tabs = [
  { id: 'etf', name: 'ETF 投資試算', icon: '📈' },
  { id: 'mortgage', name: '房貸試算', icon: '🏠' },
];

function switchTab(tabId) {
  activeTab.value = tabId;
}
</script>

<template>
  <div id="app">
    <!-- Tab 切換 -->
    <div class="tab-container">
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['tab', { active: activeTab === tab.id }]"
          @click="switchTab(tab.id)"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-name">{{ tab.name }}</span>
        </button>
      </div>
    </div>

    <!-- 內容區 -->
    <div class="content">
      <ETFCalculator v-if="activeTab === 'etf'" />
      <MortgageCalculator v-else-if="activeTab === 'mortgage'" />
    </div>
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
  padding: 0;
}

/* Tab 容器 */
.tab-container {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.tabs {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 0;
}

.tab {
  flex: 1;
  padding: 1rem 2rem;
  border: none;
  background: white;
  color: #666;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.tab:hover {
  background: #f8f9fa;
  color: #333;
}

.tab.active {
  color: #667eea;
  border-bottom-color: #667eea;
  background: #f5f7ff;
}

.tab-icon {
  font-size: 1.5rem;
}

.tab-name {
  font-size: 1rem;
}

.content {
  padding: 2rem 0;
}

@media (max-width: 768px) {
  .tab {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }

  .tab-icon {
    font-size: 1.2rem;
  }

  .tab-name {
    font-size: 0.85rem;
  }

  .content {
    padding: 1rem 0;
  }
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
