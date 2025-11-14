/**
 * 房貸計算工具函式
 * 提供本息平均攤還的各種計算功能
 */

/**
 * 計算還款期數（月）
 * @param {number} principal - 本金餘額
 * @param {number} annualRate - 年利率（%）
 * @param {number} monthlyPayment - 每月還款金額
 * @returns {number} 還款期數（月）
 */
export function calculateMonths(principal, annualRate, monthlyPayment) {
  const monthlyRate = annualRate / 100 / 12;

  // 特殊情況處理
  if (monthlyRate === 0) {
    return principal / monthlyPayment;
  }

  // 公式: n = -log(1 - P × r / A) / log(1 + r)
  const n = -Math.log(1 - (principal * monthlyRate / monthlyPayment)) / Math.log(1 + monthlyRate);

  return n;
}

/**
 * 將月數轉換為年月格式
 * @param {number} totalMonths - 總月數
 * @returns {{ years: number, months: number }} 年月物件
 */
export function convertToYearsMonths(totalMonths) {
  const years = Math.floor(totalMonths / 12);
  const months = Math.ceil(totalMonths % 12);

  return { years, months };
}

/**
 * 計算每月還款明細
 * @param {number} principal - 本金餘額
 * @param {number} annualRate - 年利率（%）
 * @param {number} monthlyPayment - 每月還款金額
 * @param {number} periods - 期數（預設：全部）
 * @returns {Array} 還款明細陣列
 */
export function calculatePaymentSchedule(principal, annualRate, monthlyPayment, periods = null) {
  const monthlyRate = annualRate / 100 / 12;
  const schedule = [];
  let remaining = principal;

  const totalPeriods = periods || Math.ceil(calculateMonths(principal, annualRate, monthlyPayment));

  for (let i = 1; i <= totalPeriods; i++) {
    const interest = remaining * monthlyRate;
    const principalPayment = monthlyPayment - interest;
    remaining -= principalPayment;

    // 最後一期可能剩餘本金為負數，需要調整
    if (remaining < 0) {
      remaining = 0;
    }

    schedule.push({
      period: i,
      interest: Math.round(interest),
      principal: Math.round(principalPayment),
      remaining: Math.round(remaining),
      payment: Math.round(monthlyPayment)
    });

    // 如果本金已還清，提前結束
    if (remaining <= 0) {
      break;
    }
  }

  return schedule;
}

/**
 * 計算總還款金額和總利息
 * @param {number} principal - 本金餘額
 * @param {number} annualRate - 年利率（%）
 * @param {number} monthlyPayment - 每月還款金額
 * @returns {{ totalPayment: number, totalInterest: number }} 總還款和總利息
 */
export function calculateTotals(principal, annualRate, monthlyPayment) {
  const totalMonths = calculateMonths(principal, annualRate, monthlyPayment);
  const totalPayment = monthlyPayment * totalMonths;
  const totalInterest = totalPayment - principal;

  return {
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest)
  };
}

/**
 * 完整計算房貸資訊
 * @param {number} principal - 本金餘額
 * @param {number} annualRate - 年利率（%）
 * @param {number} monthlyPayment - 每月還款金額
 * @returns {Object} 完整的房貸計算結果
 */
export function calculateMortgage(principal, annualRate, monthlyPayment) {
  const totalMonths = calculateMonths(principal, annualRate, monthlyPayment);
  const { years, months } = convertToYearsMonths(totalMonths);
  const { totalPayment, totalInterest } = calculateTotals(principal, annualRate, monthlyPayment);
  const schedule = calculatePaymentSchedule(principal, annualRate, monthlyPayment, 3); // 只取前3期

  return {
    totalMonths: Math.round(totalMonths),
    years,
    months,
    totalPayment,
    totalInterest,
    schedule,
    interestRate: (totalInterest / totalPayment * 100).toFixed(1) // 利息佔比
  };
}

/**
 * 比較兩個方案
 * @param {Object} plan1 - 方案1 { principal, annualRate, monthlyPayment }
 * @param {Object} plan2 - 方案2 { principal, annualRate, monthlyPayment }
 * @returns {Object} 比較結果
 */
export function comparePlans(plan1, plan2) {
  const result1 = calculateMortgage(plan1.principal, plan1.annualRate, plan1.monthlyPayment);
  const result2 = calculateMortgage(plan2.principal, plan2.annualRate, plan2.monthlyPayment);

  return {
    plan1: result1,
    plan2: result2,
    monthsSaved: result1.totalMonths - result2.totalMonths,
    yearsSaved: ((result1.totalMonths - result2.totalMonths) / 12).toFixed(1),
    interestSaved: result1.totalInterest - result2.totalInterest,
    monthlyDiff: plan2.monthlyPayment - plan1.monthlyPayment
  };
}

/**
 * 格式化金額（加上千分位逗號）
 * @param {number} amount - 金額
 * @returns {string} 格式化後的字串
 */
export function formatCurrency(amount) {
  return Math.round(amount).toLocaleString('zh-TW');
}
