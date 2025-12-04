/**
 * ETF 投資試算工具
 * 計算定期定額投資的複利成長與預測
 */

/**
 * 熱門 ETF 資訊
 */
export const ETF_INFO = {
  '0050': {
    code: '0050',
    name: '元大台灣50',
    fullName: '元大台灣卓越50證券投資信託基金',
    trackingIndex: '台灣50指數',
    avgReturn: 0.07, // 年化報酬率 7%
    dividendYield: 0.03, // 殖利率 3%
    dividendFrequency: 2, // 配息次數/年
    expenseRatio: 0.0032, // 內扣費用 0.32%
    defaultPrice: 62.20, // 預設股價（2024/12 更新）
  },
  '0056': {
    code: '0056',
    name: '元大高股息',
    fullName: '元大台灣高股息證券投資信託基金',
    trackingIndex: '台灣高股息指數',
    avgReturn: 0.065, // 年化報酬率 6.5%
    dividendYield: 0.055, // 殖利率 5.5%
    dividendFrequency: 4, // 配息次數/年（季配）
    expenseRatio: 0.0074, // 內扣費用 0.74%
    defaultPrice: 36.40, // 預設股價（2024/12 更新）
  },
  '0061': {
    code: '0061',
    name: '元大寶滬深',
    fullName: '元大標智滬深300證券投資信託基金',
    trackingIndex: '滬深300指數',
    avgReturn: 0.08, // 年化報酬率 8%
    dividendYield: 0.02, // 殖利率 2%
    dividendFrequency: 1, // 配息次數/年
    expenseRatio: 0.0099, // 內扣費用 0.99%
    defaultPrice: 19, // 預設股價
  },
  '00878': {
    code: '00878',
    name: '國泰永續高股息',
    fullName: '國泰台灣ESG永續高股息ETF基金',
    trackingIndex: 'MSCI臺灣ESG永續高股息精選30指數',
    avgReturn: 0.075, // 年化報酬率 7.5%
    dividendYield: 0.05, // 殖利率 5%
    dividendFrequency: 4, // 配息次數/年（季配）
    expenseRatio: 0.0054, // 內扣費用 0.54%
    defaultPrice: 23, // 預設股價
  },
  '00919': {
    code: '00919',
    name: '群益台灣精選高息',
    fullName: '群益台灣精選高息ETF基金',
    trackingIndex: '臺灣指數公司特選高息50指數',
    avgReturn: 0.07, // 年化報酬率 7%
    dividendYield: 0.06, // 殖利率 6%
    dividendFrequency: 12, // 配息次數/年（月配）
    expenseRatio: 0.0054, // 內扣費用 0.54%
    defaultPrice: 18, // 預設股價
  },
};

/**
 * 計算單筆 ETF 當前市值
 * @param {string} etfCode - ETF 代碼
 * @param {number} shares - 持有股數
 * @param {number} currentPrice - 當前股價（可選，使用預設值）
 * @returns {number} 當前市值
 */
export function calculateCurrentValue(etfCode, shares, currentPrice = null) {
  const etf = ETF_INFO[etfCode];
  if (!etf) throw new Error(`Unknown ETF code: ${etfCode}`);

  const price = currentPrice || etf.defaultPrice;
  return shares * price;
}

/**
 * 計算投資組合當前總市值
 * @param {Array} holdings - 持倉陣列 [{code, shares, price?}, ...]
 * @returns {Object} {totalValue, breakdown: [{code, value, percentage}, ...]}
 */
export function calculatePortfolioValue(holdings) {
  const breakdown = holdings.map(holding => {
    const value = calculateCurrentValue(holding.code, holding.shares, holding.price);
    return {
      code: holding.code,
      name: ETF_INFO[holding.code].name,
      shares: holding.shares,
      value,
      percentage: 0, // 稍後計算
    };
  });

  const totalValue = breakdown.reduce((sum, item) => sum + item.value, 0);

  // 計算各 ETF 佔比
  breakdown.forEach(item => {
    item.percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
  });

  return {
    totalValue,
    breakdown,
  };
}

/**
 * 計算定期定額投資預測（支援階段性投資）
 * @param {Object} params - 投資參數
 * @param {Array} params.stages - 投資階段 [{startMonth, endMonth, monthlyAmount}, ...]
 * @param {number} params.totalMonths - 總投資月數
 * @param {number} params.initialInvestment - 初始投資金額
 * @param {number} params.annualReturn - 年化報酬率（小數）
 * @param {boolean} params.reinvestDividend - 是否股息再投入
 * @param {number} params.dividendYield - 股息殖利率（小數）
 * @returns {Object} 投資預測結果
 */
export function calculateInvestmentProjection(params) {
  const {
    stages = [],
    totalMonths,
    initialInvestment = 0,
    annualReturn,
    reinvestDividend = true,
    dividendYield = 0,
  } = params;

  const monthlyReturn = annualReturn / 12; // 月報酬率
  const monthlyDividend = reinvestDividend ? (dividendYield / 12) : 0; // 月股息（如果再投入）
  const effectiveMonthlyReturn = monthlyReturn + monthlyDividend; // 有效月報酬率

  let currentValue = initialInvestment;
  let totalInvested = initialInvestment;
  const monthlyData = [];

  // 建立月度投資金額查找
  const monthlyAmountMap = new Map();
  stages.forEach(stage => {
    for (let month = stage.startMonth; month <= stage.endMonth && month <= totalMonths; month++) {
      monthlyAmountMap.set(month, stage.monthlyAmount);
    }
  });

  for (let month = 1; month <= totalMonths; month++) {
    // 本月投入金額
    const monthlyInvestment = monthlyAmountMap.get(month) || 0;

    // 先計算上個月資產的成長
    currentValue = currentValue * (1 + effectiveMonthlyReturn);

    // 再加入本月投入
    currentValue += monthlyInvestment;
    totalInvested += monthlyInvestment;

    // 計算累積報酬
    const cumulativeReturn = currentValue - totalInvested;
    const returnRate = totalInvested > 0 ? (cumulativeReturn / totalInvested) * 100 : 0;

    // 計算年度股息（簡化計算，基於當前市值）
    const annualDividend = currentValue * dividendYield;

    monthlyData.push({
      month,
      year: Math.floor((month - 1) / 12) + 1,
      monthInYear: ((month - 1) % 12) + 1,
      monthlyInvestment,
      totalInvested,
      currentValue,
      cumulativeReturn,
      returnRate,
      annualDividend: month % 12 === 0 ? annualDividend : 0, // 只在年底顯示年度股息
    });
  }

  // 計算最終摘要
  const finalData = monthlyData[monthlyData.length - 1];
  const avgAnnualReturn = totalMonths > 0
    ? Math.pow(finalData.currentValue / initialInvestment, 12 / totalMonths) - 1
    : 0;

  return {
    summary: {
      totalMonths,
      totalInvested: finalData.totalInvested,
      finalValue: finalData.currentValue,
      cumulativeReturn: finalData.cumulativeReturn,
      returnRate: finalData.returnRate,
      avgAnnualReturn: avgAnnualReturn * 100,
      estimatedAnnualDividend: finalData.currentValue * dividendYield,
    },
    monthlyData,
    yearlyData: aggregateYearlyData(monthlyData),
  };
}

/**
 * 將月度數據聚合為年度數據
 * @param {Array} monthlyData - 月度數據陣列
 * @returns {Array} 年度數據陣列
 */
function aggregateYearlyData(monthlyData) {
  const yearlyData = [];
  const years = Math.ceil(monthlyData.length / 12);

  for (let year = 1; year <= years; year++) {
    const yearEndMonth = Math.min(year * 12, monthlyData.length);
    const yearEndData = monthlyData[yearEndMonth - 1];

    // 計算該年度投入總額
    const yearStartMonth = (year - 1) * 12 + 1;
    const yearInvestment = monthlyData
      .slice(yearStartMonth - 1, yearEndMonth)
      .reduce((sum, data) => sum + data.monthlyInvestment, 0);

    yearlyData.push({
      year,
      yearInvestment,
      totalInvested: yearEndData.totalInvested,
      currentValue: yearEndData.currentValue,
      cumulativeReturn: yearEndData.cumulativeReturn,
      returnRate: yearEndData.returnRate,
      annualDividend: yearEndData.annualDividend,
    });
  }

  return yearlyData;
}

/**
 * 計算多 ETF 組合投資預測
 * @param {Object} params - 投資參數
 * @param {Array} params.holdings - 當前持倉 [{code, shares, price?}, ...]
 * @param {Array} params.stages - 投資階段 [{startMonth, endMonth, monthlyAmount, allocation: {code: percentage}}, ...]
 * @param {number} params.totalMonths - 總投資月數
 * @param {Object} params.customReturns - 自訂報酬率 {code: returnRate}（可選）
 * @returns {Object} 組合投資預測結果
 */
export function calculatePortfolioProjection(params) {
  const {
    holdings = [],
    stages = [],
    totalMonths,
    customReturns = {},
  } = params;

  // 計算當前投資組合價值
  const currentPortfolio = calculatePortfolioValue(holdings);

  // 為每個 ETF 計算投資預測
  const etfProjections = {};
  holdings.forEach(holding => {
    const etf = ETF_INFO[holding.code];
    const annualReturn = customReturns[holding.code] || etf.avgReturn;

    // 轉換階段投資為該 ETF 的投資金額
    const etfStages = stages.map(stage => {
      const allocation = stage.allocation?.[holding.code] || 0;
      return {
        startMonth: stage.startMonth,
        endMonth: stage.endMonth,
        monthlyAmount: stage.monthlyAmount * (allocation / 100),
      };
    });

    etfProjections[holding.code] = calculateInvestmentProjection({
      stages: etfStages,
      totalMonths,
      initialInvestment: calculateCurrentValue(holding.code, holding.shares, holding.price),
      annualReturn,
      reinvestDividend: true,
      dividendYield: etf.dividendYield,
    });
  });

  // 聚合所有 ETF 的數據
  const aggregatedMonthlyData = [];
  const aggregatedYearlyData = [];

  for (let month = 1; month <= totalMonths; month++) {
    let monthlyInvestment = 0;
    let totalInvested = 0;
    let currentValue = 0;
    let cumulativeReturn = 0;

    Object.values(etfProjections).forEach(projection => {
      const data = projection.monthlyData[month - 1];
      monthlyInvestment += data.monthlyInvestment;
      totalInvested += data.totalInvested;
      currentValue += data.currentValue;
      cumulativeReturn += data.cumulativeReturn;
    });

    const returnRate = totalInvested > 0 ? (cumulativeReturn / totalInvested) * 100 : 0;

    aggregatedMonthlyData.push({
      month,
      year: Math.floor((month - 1) / 12) + 1,
      monthInYear: ((month - 1) % 12) + 1,
      monthlyInvestment,
      totalInvested,
      currentValue,
      cumulativeReturn,
      returnRate,
    });
  }

  // 聚合年度數據
  const years = Math.ceil(totalMonths / 12);
  for (let year = 1; year <= years; year++) {
    const yearEndMonth = Math.min(year * 12, totalMonths);
    const yearEndData = aggregatedMonthlyData[yearEndMonth - 1];

    const yearStartMonth = (year - 1) * 12 + 1;
    const yearInvestment = aggregatedMonthlyData
      .slice(yearStartMonth - 1, yearEndMonth)
      .reduce((sum, data) => sum + data.monthlyInvestment, 0);

    // 計算年度股息總和
    let annualDividend = 0;
    Object.entries(etfProjections).forEach(([code, projection]) => {
      const etf = ETF_INFO[code];
      const yearEndValue = projection.monthlyData[yearEndMonth - 1].currentValue;
      annualDividend += yearEndValue * etf.dividendYield;
    });

    aggregatedYearlyData.push({
      year,
      yearInvestment,
      totalInvested: yearEndData.totalInvested,
      currentValue: yearEndData.currentValue,
      cumulativeReturn: yearEndData.cumulativeReturn,
      returnRate: yearEndData.returnRate,
      annualDividend,
    });
  }

  const finalData = aggregatedMonthlyData[aggregatedMonthlyData.length - 1];
  const initialTotal = currentPortfolio.totalValue;
  const avgAnnualReturn = totalMonths > 0 && initialTotal > 0
    ? Math.pow(finalData.currentValue / initialTotal, 12 / totalMonths) - 1
    : 0;

  // 計算總年度股息
  const estimatedAnnualDividend = Object.entries(etfProjections).reduce((sum, [code, projection]) => {
    const etf = ETF_INFO[code];
    return sum + projection.summary.finalValue * etf.dividendYield;
  }, 0);

  return {
    currentPortfolio,
    summary: {
      totalMonths,
      initialValue: initialTotal,
      totalInvested: finalData.totalInvested,
      finalValue: finalData.currentValue,
      cumulativeReturn: finalData.cumulativeReturn,
      returnRate: finalData.returnRate,
      avgAnnualReturn: avgAnnualReturn * 100,
      estimatedAnnualDividend,
      estimatedMonthlyDividend: estimatedAnnualDividend / 12,
    },
    monthlyData: aggregatedMonthlyData,
    yearlyData: aggregatedYearlyData,
    etfProjections,
  };
}

/**
 * 格式化金額（千分位）
 * @param {number} amount - 金額
 * @param {number} decimals - 小數位數
 * @returns {string} 格式化後的字串
 */
export function formatCurrency(amount, decimals = 0) {
  return amount.toLocaleString('zh-TW', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * 格式化百分比
 * @param {number} percentage - 百分比數值
 * @param {number} decimals - 小數位數
 * @returns {string} 格式化後的字串
 */
export function formatPercentage(percentage, decimals = 2) {
  return `${percentage.toFixed(decimals)}%`;
}
