<template>
  <div class="etf-calculator">
    <div class="calculator-header">
      <h1 class="title">ETF 投資試算器</h1>
    </div>

    <!-- 當前持倉 -->
    <div class="card">
      <h2 class="card-title">當前投資組合</h2>
      <div class="holdings-grid">
        <div
          v-for="holding in holdings"
          :key="holding.code"
          class="holding-item"
        >
          <div class="holding-header">
            <span class="etf-code">{{ holding.code }}</span>
            <span class="etf-name">{{ getETFInfo(holding.code).name }}</span>
          </div>
          <div class="holding-detail">
            <label>持有股數</label>
            <input
              v-model.number="holding.shares"
              type="number"
              class="input-field"
              @input="calculate"
            />
          </div>
          <div class="holding-detail">
            <label>當前股價</label>
            <input
              v-model.number="holding.price"
              type="number"
              step="0.1"
              class="input-field"
              @input="calculate"
            />
          </div>
          <div class="holding-value">
            市值: {{ formatCurrency(calculateHoldingValue(holding)) }} 元
          </div>
        </div>
      </div>
      <div class="portfolio-summary">
        <div class="summary-item">
          <span class="label">總投資金額</span>
          <span class="value">{{ formatCurrency(currentPortfolio.totalValue) }} 元</span>
        </div>
      </div>
    </div>

    <!-- 定期定額設定 -->
    <div class="card">
      <h2 class="card-title">定期定額投資設定</h2>

      <!-- 階段設定 -->
      <div class="stages-container">
        <div
          v-for="(stage, index) in stages"
          :key="index"
          class="stage-item"
        >
          <h3 class="stage-title">階段 {{ index + 1 }}</h3>
          <div class="stage-fields">
            <div class="field">
              <label>開始月份</label>
              <input
                v-model.number="stage.startMonth"
                type="number"
                min="1"
                class="input-field"
                @input="calculate"
              />
            </div>
            <div class="field">
              <label>結束月份</label>
              <input
                v-model.number="stage.endMonth"
                type="number"
                min="1"
                class="input-field"
                @input="calculate"
              />
            </div>
            <div class="field">
              <label>每月投入金額 (元)</label>
              <input
                v-model.number="stage.monthlyAmount"
                type="number"
                step="1000"
                class="input-field"
                @input="calculate"
              />
            </div>
            <button
              v-if="stages.length > 1"
              class="btn-remove"
              @click="removeStage(index)"
            >
              移除
            </button>
          </div>
        </div>
        <button class="btn-add" @click="addStage">
          + 新增階段
        </button>
      </div>

      <!-- 預測期間 -->
      <div class="field">
        <label>預測期間 (年)</label>
        <div class="period-buttons">
          <button
            v-for="period in [1, 3, 5, 10]"
            :key="period"
            :class="['period-btn', { active: totalYears === period }]"
            @click="setTotalYears(period)"
          >
            {{ period }} 年
          </button>
        </div>
      </div>
    </div>

    <!-- 報酬率設定 -->
    <div class="card">
      <h2 class="card-title">報酬率假設</h2>
      <div class="returns-grid">
        <div
          v-for="holding in holdings"
          :key="holding.code"
          class="return-item"
        >
          <label>{{ holding.code }} {{ getETFInfo(holding.code).name }}</label>
          <div class="return-input">
            <input
              v-model.number="customReturns[holding.code]"
              type="number"
              step="0.1"
              min="0"
              max="30"
              class="input-field"
              @input="calculate"
            />
            <span class="unit">%</span>
          </div>
        </div>
      </div>
      <div class="field">
        <label>
          <input
            v-model="reinvestDividend"
            type="checkbox"
            @change="calculate"
          />
          股息再投入
        </label>
      </div>
    </div>

    <!-- 預測結果 -->
    <div v-if="result" class="card result-card">
      <h2 class="card-title">投資預測結果</h2>

      <div class="summary-grid">
        <div class="summary-box">
          <div class="summary-label">預測期末總資產</div>
          <div class="summary-value highlight">
            {{ formatCurrency(result.summary.finalValue) }} 元
          </div>
        </div>
        <div class="summary-box">
          <div class="summary-label">累積投入本金</div>
          <div class="summary-value">
            {{ formatCurrency(result.summary.totalInvested) }} 元
          </div>
        </div>
        <div class="summary-box">
          <div class="summary-label">預估總報酬</div>
          <div class="summary-value profit">
            {{ formatCurrency(result.summary.cumulativeReturn) }} 元
            <span class="percentage">({{ result.summary.returnRate.toFixed(2) }}%)</span>
          </div>
        </div>
        <div class="summary-box">
          <div class="summary-label">預估年均股息收入</div>
          <div class="summary-value dividend">
            {{ formatCurrency(result.summary.estimatedAnnualDividend) }} 元
            <span class="monthly">(月領 {{ formatCurrency(result.summary.estimatedMonthlyDividend) }} 元)</span>
          </div>
        </div>
      </div>

      <!-- 年度成長表 -->
      <div class="yearly-table-container">
        <h3>年度成長預測</h3>
        <table class="yearly-table">
          <thead>
            <tr>
              <th>年度</th>
              <th>當年投入</th>
              <th>累積本金</th>
              <th>投資市值</th>
              <th>累積報酬</th>
              <th>報酬率</th>
              <th>年度股息</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="year in result.yearlyData" :key="year.year">
              <td>{{ year.year }}</td>
              <td>{{ formatCurrency(year.yearInvestment) }}</td>
              <td>{{ formatCurrency(year.totalInvested) }}</td>
              <td>{{ formatCurrency(year.currentValue) }}</td>
              <td class="profit">{{ formatCurrency(year.cumulativeReturn) }}</td>
              <td>{{ year.returnRate.toFixed(2) }}%</td>
              <td class="dividend">{{ formatCurrency(year.annualDividend) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ETF_INFO,
  calculateCurrentValue,
  calculatePortfolioValue,
  calculatePortfolioProjection,
  formatCurrency as formatCurr,
} from '../utils/etf.js';

export default {
  name: 'ETFCalculator',
  data() {
    return {
      // 當前持倉 - 使用者預設值
      holdings: [
        {
          code: '0050',
          shares: 1760,
          price: 65.44,
        },
        {
          code: '0056',
          shares: 137,
          price: 36.64,
        },
      ],
      // 投資階段設定
      stages: [
        {
          startMonth: 1,
          endMonth: 4,
          monthlyAmount: 10000,
          allocation: {
            '0050': 70, // 70%
            '0056': 30, // 30%
          },
        },
        {
          startMonth: 5,
          endMonth: 36,
          monthlyAmount: 15000,
          allocation: {
            '0050': 70,
            '0056': 30,
          },
        },
      ],
      totalYears: 3, // 預測 3 年
      customReturns: {
        '0050': 7.0,
        '0056': 6.5,
      },
      reinvestDividend: true,
      result: null,
      currentPortfolio: { totalValue: 0, breakdown: [] },
    };
  },
  computed: {
    totalMonths() {
      return this.totalYears * 12;
    },
  },
  mounted() {
    this.calculate();
  },
  methods: {
    getETFInfo(code) {
      return ETF_INFO[code] || {};
    },
    calculateHoldingValue(holding) {
      return calculateCurrentValue(holding.code, holding.shares, holding.price);
    },
    formatCurrency(amount) {
      return formatCurr(amount, 0);
    },
    addStage() {
      const lastStage = this.stages[this.stages.length - 1];
      this.stages.push({
        startMonth: lastStage.endMonth + 1,
        endMonth: this.totalMonths,
        monthlyAmount: lastStage.monthlyAmount,
        allocation: { ...lastStage.allocation },
      });
      this.calculate();
    },
    removeStage(index) {
      if (this.stages.length > 1) {
        this.stages.splice(index, 1);
        this.calculate();
      }
    },
    setTotalYears(years) {
      this.totalYears = years;
      // 自動將最後一個階段的結束月份設為預測期間的總月數
      if (this.stages.length > 0) {
        this.stages[this.stages.length - 1].endMonth = this.totalMonths;
      }
      this.calculate();
    },
    calculate() {
      try {
        // 計算當前投資組合
        this.currentPortfolio = calculatePortfolioValue(this.holdings);

        // 轉換自訂報酬率為小數
        const customReturnsDecimal = {};
        Object.keys(this.customReturns).forEach(code => {
          customReturnsDecimal[code] = this.customReturns[code] / 100;
        });

        // 計算投資預測
        this.result = calculatePortfolioProjection({
          holdings: this.holdings,
          stages: this.stages,
          totalMonths: this.totalMonths,
          customReturns: customReturnsDecimal,
        });
      } catch (error) {
        console.error('計算錯誤:', error);
      }
    },
  },
};
</script>

<style scoped>
.etf-calculator {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.calculator-header {
  text-align: center;
  margin-bottom: 30px;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.holdings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.holding-item {
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.holding-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.etf-code {
  font-weight: 600;
  font-size: 1.1rem;
  color: #667eea;
}

.etf-name {
  color: #666;
  font-size: 0.9rem;
}

.holding-detail {
  margin-bottom: 12px;
}

.holding-detail label {
  display: block;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 4px;
}

.input-field {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
}

.holding-value {
  font-weight: 600;
  color: #667eea;
  text-align: right;
}

.portfolio-summary {
  padding-top: 16px;
  border-top: 2px solid #f0f0f0;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
}

.summary-item .label {
  font-weight: 500;
  color: #666;
}

.summary-item .value {
  font-weight: 700;
  color: #667eea;
  font-size: 1.3rem;
}

.stages-container {
  margin-bottom: 20px;
}

.stage-item {
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 16px;
}

.stage-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #555;
}

.stage-fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-bottom: 8px;
}

.field {
  margin-bottom: 16px;
}

.field label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: #555;
  margin-bottom: 8px;
}

.btn-remove {
  padding: 8px 16px;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-remove:hover {
  background-color: #cc0000;
}

.btn-add {
  padding: 10px 20px;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  width: 100%;
}

.btn-add:hover {
  background-color: #5568d3;
}

.period-buttons {
  display: flex;
  gap: 12px;
}

.period-btn {
  flex: 1;
  padding: 10px 16px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.period-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.period-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
}

.returns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.return-item {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
}

.return-item label {
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
  color: #555;
}

.return-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.return-input .input-field {
  flex: 1;
}

.return-input .unit {
  font-weight: 600;
  color: #666;
}

.result-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
}

.summary-box {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.summary-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
}

.summary-value.highlight {
  color: #667eea;
  font-size: 1.8rem;
}

.summary-value.profit {
  color: #28a745;
}

.summary-value.dividend {
  color: #fd7e14;
}

.percentage,
.monthly {
  display: block;
  font-size: 0.8rem;
  font-weight: 400;
  color: #888;
  margin-top: 4px;
}

.yearly-table-container {
  margin-top: 30px;
}

.yearly-table-container h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.yearly-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.yearly-table th,
.yearly-table td {
  padding: 12px;
  text-align: right;
  border-bottom: 1px solid #e0e0e0;
}

.yearly-table th {
  background-color: #667eea;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
}

.yearly-table th:first-child,
.yearly-table td:first-child {
  text-align: center;
}

.yearly-table tbody tr:hover {
  background-color: #f8f9fa;
}

.yearly-table td.profit {
  color: #28a745;
  font-weight: 600;
}

.yearly-table td.dividend {
  color: #fd7e14;
  font-weight: 600;
}

@media (max-width: 768px) {
  .etf-calculator {
    padding: 16px;
  }

  .title {
    font-size: 1.5rem;
  }

  .holdings-grid,
  .summary-grid,
  .returns-grid {
    grid-template-columns: 1fr;
  }

  .stage-fields {
    grid-template-columns: 1fr;
  }

  .yearly-table {
    font-size: 0.85rem;
  }

  .yearly-table th,
  .yearly-table td {
    padding: 8px 4px;
  }
}
</style>
