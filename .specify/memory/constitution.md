# HomeCalc - 開發憲章

## 開發原則

### 簡潔優先
- 使用原生技術，避免過度工程
- 最少依賴原則
- 優先使用原生 HTML5、CSS3 和 JavaScript ES6+
- 避免引入非必要的框架或函式庫

### 程式碼品質
- 清晰易讀，使用有意義的變數和函式命名
- 一致的格式化（使用 Prettier 或類似工具）
- 關注點分離：UI、邏輯、資料分離
- 適當的註解，特別是複雜計算邏輯
- 遵循 DRY（Don't Repeat Yourself）原則

### 使用者體驗
- 響應式設計，支援桌面和行動裝置
- 即時計算回饋，無需按下「計算」按鈕
- 錯誤提示清楚明確
- 直覺的操作介面
- 快速載入時間

### 測試驗證
- 手動測試所有計算情境
- 邊界值測試（0、負數、極大值）
- 多裝置測試（手機、平板、桌面）
- 跨瀏覽器測試
- 數值準確性驗證

### 效能要求
- 頁面載入時間 < 1 秒
- 計算回應時間 < 100ms
- 流暢的動畫（60fps）
- 最小化重繪和重排

### 安全性
- 輸入驗證，防止 XSS 攻擊
- 數值範圍檢查，防止溢位
- 不儲存敏感資料在本地

### 可維護性
- 模組化架構
- 清楚的檔案結構
- 版本控制最佳實踐
- 完整的文檔

## 技術限制

### 技術棧
- **前端框架**：Vue.js 3（Composition API）
- **UI 框架**：可選用輕量級 UI 庫（如 Element Plus、Naive UI）
- **圖表視覺化**：Chart.js 或 ECharts
- **樣式**：CSS3、Flexbox/Grid，或 Tailwind CSS
- **資料儲存**：LocalStorage（如需持久化）
- **建置工具**：Vite（快速開發和建置）
- **狀態管理**：Vue 3 Composition API（小型專案無需 Pinia/Vuex）

### 瀏覽器支援
- Chrome（最新版本 -2）
- Firefox（最新版本 -2）
- Safari（最新版本 -2）
- Edge（最新版本 -2）
- 不支援 IE11 及以下版本

### 相容性要求
- 支援觸控操作
- 支援鍵盤操作
- 基本的無障礙支援（ARIA 標籤）

### 檔案大小限制
- 生產環境 bundle 大小 < 500KB（gzip 壓縮後）
- 首屏載入資源 < 200KB
- 圖片資源使用 WebP 格式，單張 < 50KB
- 按需載入圖表庫（lazy load）

## 程式碼規範

### Vue Component（Composition API）
```vue
<script setup>
import { ref, computed } from 'vue';

// 使用 const/let，不使用 var
const principal = ref(16102679);
const monthlyPayment = ref(70000);

// 計算屬性：駝峰式命名
const totalMonths = computed(() => {
  // 房貸計算邏輯
  return calculateMortgage(principal.value, monthlyPayment.value);
});

// 函式命名：動詞開頭，駝峰式
function calculateMortgage(p, payment) {
  // 計算邏輯
  return result;
}
</script>

<template>
  <div class="mortgage-calculator">
    <h1>房貸試算</h1>
    <input v-model.number="principal" type="number" />
  </div>
</template>

<style scoped>
.mortgage-calculator {
  /* 樣式 */
}
</style>
```

### CSS 命名規範
```css
/* 使用 BEM 命名法或語意化命名 */
.calculator__button {
  /* 樣式 */
}

.calculator__button--primary {
  /* 修飾樣式 */
}

/* 或使用 Tailwind CSS utility classes */
```

### 元件命名
- 檔案名稱：大駝峰式 `MortgageCalculator.vue`
- 元件名稱：大駝峰式 `<MortgageCalculator />`
- Props：駝峰式 `initialValue`
- Events：kebab-case `@update-value`

## 檢查清單

### 合併前必須：
- [ ] 功能測試完成（所有計算正確）
- [ ] 響應式驗證（手機、平板、桌面）
- [ ] 瀏覽器測試（Chrome、Firefox、Safari、Edge）
- [ ] 程式碼審查（符合規範）
- [ ] 無 console 錯誤或警告
- [ ] 效能測試通過
- [ ] 使用者體驗流暢
- [ ] 文檔已更新

### 發布前必須：
- [ ] 版本號更新
- [ ] CHANGELOG 更新
- [ ] 生產環境測試
- [ ] 備份舊版本
- [ ] 使用者通知準備

## 變更管理

### 功能新增
1. 先更新 specification.md
2. 討論技術實作方案
3. 實作並測試
4. 更新文檔
5. 合併到主分支

### 錯誤修復
1. 記錄問題（issue）
2. 建立修復分支
3. 修復並測試
4. 合併到主分支

### 技術債務
- 定期回顧和重構
- 保持程式碼品質
- 避免累積技術債

## 文檔要求

### 必要文檔
- README.md：專案介紹和使用說明
- CHANGELOG.md：版本變更記錄
- Constitution.md：本文件
- Specification.md：產品規格

### 程式碼註解
- 複雜邏輯必須註解
- 公開 API 必須有 JSDoc
- 重要常數需說明用途

## 開發流程

### 分支策略
- `main`：穩定版本
- `claude/feature-*`：功能開發
- `claude/fix-*`：錯誤修復

### 提交訊息格式
```
<type>: <subject>

<body>

<footer>
```

Type:
- feat: 新功能
- fix: 錯誤修復
- docs: 文檔更新
- style: 格式調整
- refactor: 重構
- test: 測試
- chore: 維護

範例：
```
feat: 新增房貸計算功能

- 支援本息平均攤還
- 支援本金平均攤還
- 顯示每月還款金額

Closes #123
```

## 品質標準

### 程式碼品質
- 無 ESLint 錯誤
- 函式長度 < 50 行
- 檔案長度 < 500 行
- 圈複雜度 < 10

### 測試覆蓋率
- 核心計算邏輯：100%
- UI 互動：手動測試

### 效能指標
- Lighthouse 分數 > 90
- First Contentful Paint < 1s
- Time to Interactive < 2s

## 授權與版權

### 授權
- 專案採用 MIT License
- 第三方資源需標註來源

### 版權
- Copyright (c) 2025 HomeCalc Contributors
- 保留所有權利

---

**版本**：1.0
**最後更新**：2025-11-14
**維護者**：HomeCalc 開發團隊
