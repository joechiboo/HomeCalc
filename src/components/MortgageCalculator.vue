<script setup>
import { ref, computed, watch } from 'vue';
import { calculateMortgage, comparePlans, formatCurrency } from '../utils/mortgage';

// 響應式狀態
const principal = ref(16102679);
const monthlyPayment = ref(64432);
const annualRate = ref(2.19);

// 計算結果
const result = computed(() => {
  if (!principal.value || !monthlyPayment.value || !annualRate.value) {
    return null;
  }

  try {
    // 主要計算
    const mainResult = calculateMortgage(
      principal.value,
      annualRate.value,
      monthlyPayment.value
    );

    // 與標準方案 (70000, 2.19%) 比較
    const comparison = comparePlans(
      {
        principal: principal.value,
        annualRate: 2.19,
        monthlyPayment: 70000
      },
      {
        principal: principal.value,
        annualRate: annualRate.value,
        monthlyPayment: monthlyPayment.value
      }
    );

    return {
      ...mainResult,
      comparison: {
        monthlyDiff: comparison.monthlyDiff,
        yearsSaved: comparison.yearsSaved,
        interestSaved: comparison.interestSaved
      }
    };
  } catch (error) {
    console.error('計算錯誤:', error);
    return null;
  }
});

// 快速選擇方案
const quickSelect = (amount) => {
  monthlyPayment.value = amount;
};

// 方案預設值
const suggestions = {
  minimum: 64432,
  standard: 70000,
  aggressive: 80000
};
</script>

<template>
  <div class="mortgage-calculator">
    <div class="calculator-header">
      <h1>房貸還款試算器</h1>
      <p class="subtitle">了解您的還款計劃，做出最佳財務決策</p>
    </div>

    <!-- 輸入面板 -->
    <div class="input-panel">
      <div class="input-group">
        <label for="principal">本金餘額（元）</label>
        <input
          id="principal"
          v-model.number="principal"
          type="number"
          min="100000"
          max="100000000"
          step="1000"
        />
      </div>

      <div class="input-group">
        <label for="monthlyPayment">每月還款（元）</label>
        <input
          id="monthlyPayment"
          v-model.number="monthlyPayment"
          type="number"
          min="10000"
          max="500000"
          step="1000"
        />
      </div>

      <div class="input-group">
        <label for="annualRate">年利率（%）</label>
        <input
          id="annualRate"
          v-model.number="annualRate"
          type="number"
          min="0.1"
          max="10"
          step="0.01"
        />
      </div>
    </div>

    <!-- 快速選擇按鈕 -->
    <div class="quick-select">
      <button
        v-for="(amount, key) in suggestions"
        :key="key"
        :class="{ active: monthlyPayment === amount }"
        @click="quickSelect(amount)"
      >
        {{ formatCurrency(amount) }}
        <span class="label">{{ key === 'minimum' ? '最低' : key === 'standard' ? '標準' : '積極' }}</span>
      </button>
    </div>

    <!-- 結果顯示 -->
    <div v-if="result" class="results">
      <!-- 還款期限 -->
      <div class="result-card primary">
        <h2>還款期限</h2>
        <div class="result-value-large">
          {{ result.years }} 年 {{ result.months }} 個月
        </div>
        <div class="result-subtitle">
          共 {{ result.totalMonths }} 個月
        </div>
      </div>

      <!-- 財務摘要 -->
      <div class="summary-grid">
        <div class="summary-card">
          <div class="summary-label">總還款金額</div>
          <div class="summary-value">{{ formatCurrency(result.totalPayment) }} 元</div>
        </div>

        <div class="summary-card">
          <div class="summary-label">總利息支出</div>
          <div class="summary-value highlight">{{ formatCurrency(result.totalInterest) }} 元</div>
        </div>
      </div>

      <!-- 前3期還款明細 -->
      <div class="payment-schedule">
        <h3>前3期還款明細</h3>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>期數</th>
                <th class="text-right">利息</th>
                <th class="text-right">本金</th>
                <th class="text-right">剩餘本金</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in result.schedule" :key="row.period">
                <td>第 {{ row.period }} 期</td>
                <td class="text-right">{{ formatCurrency(row.interest) }} 元</td>
                <td class="text-right">{{ formatCurrency(row.principal) }} 元</td>
                <td class="text-right">{{ formatCurrency(row.remaining) }} 元</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 方案比較 -->
      <div class="comparison-card">
        <h3>與方案A比較（70,000元/月，2.19%）</h3>
        <div class="comparison-grid">
          <div class="comparison-item">
            <span class="comparison-label">每月減少支出：</span>
            <span class="comparison-value positive">
              {{ formatCurrency(result.comparison.monthlyDiff) }} 元
            </span>
          </div>
          <div class="comparison-item">
            <span class="comparison-label">還款期限增加：</span>
            <span class="comparison-value warning">
              約 {{ Math.abs(parseFloat(result.comparison.yearsSaved)) }} 年
            </span>
          </div>
          <div class="comparison-item">
            <span class="comparison-label">增加利息支出：</span>
            <span class="comparison-value negative">
              {{ formatCurrency(Math.abs(result.comparison.interestSaved)) }} 元
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 無結果提示 -->
    <div v-else class="no-result">
      <p>請輸入正確的數值進行計算</p>
    </div>
  </div>
</template>

<style scoped>
.mortgage-calculator {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.calculator-header {
  text-align: center;
  margin-bottom: 2rem;
}

.calculator-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.125rem;
  color: #6b7280;
}

/* 輸入面板 */
.input-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.input-group input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.input-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 快速選擇 */
.quick-select {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.quick-select button {
  flex: 1;
  min-width: 150px;
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.quick-select button:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.quick-select button.active {
  border-color: #3b82f6;
  background: #3b82f6;
  color: white;
}

.quick-select button .label {
  font-size: 0.75rem;
  opacity: 0.8;
}

/* 結果卡片 */
.results {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.result-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  border-radius: 1rem;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.result-card h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  opacity: 0.9;
}

.result-value-large {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.result-subtitle {
  font-size: 1rem;
  opacity: 0.8;
}

/* 財務摘要 */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.summary-card {
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
}

.summary-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.summary-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
}

.summary-value.highlight {
  color: #dc2626;
}

/* 還款明細表 */
.payment-schedule {
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
}

.payment-schedule h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f9fafb;
}

th, td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

th {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.text-right {
  text-align: right;
}

tbody tr:hover {
  background: #f9fafb;
}

/* 方案比較 */
.comparison-card {
  background: #fffbeb;
  border-left: 4px solid #f59e0b;
  padding: 1.5rem;
  border-radius: 0.5rem;
}

.comparison-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #92400e;
  margin-bottom: 1rem;
}

.comparison-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.comparison-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.comparison-label {
  color: #78350f;
}

.comparison-value {
  font-weight: 600;
}

.comparison-value.positive {
  color: #059669;
}

.comparison-value.warning {
  color: #d97706;
}

.comparison-value.negative {
  color: #dc2626;
}

/* 無結果提示 */
.no-result {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .mortgage-calculator {
    padding: 1rem;
  }

  .calculator-header h1 {
    font-size: 2rem;
  }

  .result-value-large {
    font-size: 2rem;
  }

  .quick-select {
    flex-direction: column;
  }

  .quick-select button {
    min-width: 100%;
  }
}
</style>
