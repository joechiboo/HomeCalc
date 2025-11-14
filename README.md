# HomeCalc 🏠💰

> 簡潔、直覺的購屋財務計劃工具

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-brightgreen.svg)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg)](https://vitejs.dev/)

HomeCalc 是一個專為購屋者設計的財務試算工具，幫助您清楚了解房貸還款狀況，做出最佳的財務決策。

## ✨ 特色功能

- 🧮 **精確房貸試算** - 本息平均攤還計算，與銀行試算一致
- 📊 **視覺化圖表** - 本金/利息趨勢、還款進度一目了然
- 🔄 **方案比較** - 同時比較多種還款方案，找出最佳選擇
- 📱 **響應式設計** - 支援桌面、平板、手機各種裝置
- 🔒 **隱私保護** - 所有計算在本地完成，不傳送資料到伺服器
- ⚡ **即時回饋** - 輸入改變立即顯示結果，無需等待

## 🚀 快速開始

### 線上試用
訪問 [https://homecalc.vercel.app](https://homecalc.vercel.app)（待部署）

### 本地開發

#### 環境需求
- Node.js 18.0+
- npm 9.0+ 或 pnpm 8.0+

#### 安裝步驟

```bash
# 克隆專案
git clone https://github.com/yourusername/HomeCalc.git
cd HomeCalc

# 安裝依賴
npm install
# 或使用 pnpm
pnpm install

# 啟動開發伺服器
npm run dev

# 瀏覽器開啟 http://localhost:5173
```

#### 建置生產版本

```bash
# 建置
npm run build

# 預覽建置結果
npm run preview
```

## 📖 使用說明

### 基本試算

1. **輸入房貸資訊**
   - 房貸本金餘額（預設：16,102,679 元）
   - 年利率（預設：2.19%）
   - 每月還款金額（預設：70,000 元）

2. **查看結果**
   - 還款期限（24 年 11 個月）
   - 總利息支出（約 479 萬元）
   - 每月還款組成（本金/利息）

3. **方案比較**
   - 點擊「新增方案」按鈕
   - 調整不同的還款金額
   - 查看節省的利息和時間

### 進階功能

#### 分階段還款試算
適用於「先處理其他貸款，再提高房貸月付」的情境：

```
範例：
第一階段：4 個月 × 70,000 元（呼吸器貸款期間）
第二階段：247 個月 × 80,000 元（繳清後）
→ 總期限：20 年 11 個月，節省約 81 萬利息
```

#### 快速方案選擇
內建三種常見方案：
- 💰 **最低還款**（64,432 元）：期限最長，利息最多
- ⚖️ **穩健還款**（70,000 元）：平衡型選擇
- 🚀 **積極還款**（80,000 元）：提早還清，節省利息

## 🛠️ 技術架構

### 技術棧
- **前端框架**：[Vue.js 3](https://vuejs.org/) (Composition API)
- **建置工具**：[Vite](https://vitejs.dev/)
- **圖表視覺化**：[Chart.js](https://www.chartjs.org/)
- **UI 元件**：[Naive UI](https://www.naiveui.com/)（待選定）
- **樣式**：Tailwind CSS（待選定）

### 專案結構
```
HomeCalc/
├── src/
│   ├── components/          # Vue 元件
│   │   ├── MortgageCalculator.vue
│   │   ├── ComparisonTable.vue
│   │   └── PaymentChart.vue
│   ├── composables/         # 組合式函數
│   │   └── useMortgageCalculator.js
│   ├── utils/               # 工具函數
│   │   └── mortgage.js
│   └── App.vue
├── .specify/                # 規格驅動開發文件
│   └── memory/
│       ├── constitution.md  # 開發憲章
│       └── specification.md # 產品規格
└── README.md
```

## 📐 核心計算公式

### 本息平均攤還
```javascript
// 計算還款期數 n
n = -log(1 - P × r / A) / log(1 + r)

// 其中：
// P = 本金餘額
// r = 月利率（年利率 ÷ 12）
// A = 每月還款金額
```

### 每期利息與本金
```javascript
// 第 i 期利息
利息 = 剩餘本金 × 月利率

// 第 i 期本金償還
本金償還 = 每月還款 - 利息
```

## 🗺️ 開發路線圖

### ✅ 階段 1：MVP（進行中）
- [x] 專案建置與架構設計
- [x] SDD 文件撰寫
- [ ] 房貸計算邏輯實作
- [ ] 基本 UI 介面
- [ ] 響應式設計

### 🔄 階段 2：視覺化與比較
- [ ] 圖表整合（Chart.js）
- [ ] 方案比較功能
- [ ] 完整還款明細表
- [ ] 本地儲存功能

### 📅 階段 3：進階功能
- [ ] 分階段還款試算
- [ ] 匯出功能（PDF、分享連結）
- [ ] 使用者偏好設定

### 🔮 未來規劃
- [ ] 購屋前規劃（頭期款追蹤）
- [ ] 購屋後管理（繳款提醒）
- [ ] 寬限期試算
- [ ] 本金平均攤還

詳細規劃請參考 [.specify/memory/specification.md](.specify/memory/specification.md)

## 🤝 貢獻指南

### 開發流程
1. Fork 本專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

### 提交訊息格式
遵循 [Conventional Commits](https://www.conventionalcommits.org/)：
```
feat: 新增功能
fix: 修復錯誤
docs: 文檔更新
style: 格式調整
refactor: 重構
test: 測試
chore: 維護
```

### 程式碼規範
- 遵循 [.specify/memory/constitution.md](.specify/memory/constitution.md) 開發憲章
- 使用 ESLint + Prettier 格式化
- 函式長度 < 50 行
- 重要邏輯必須註解

## 📄 授權

本專案採用 [MIT License](LICENSE)

## 🙏 致謝

- 感謝 [Vue.js](https://vuejs.org/) 團隊提供優秀的框架
- 感謝 [Chart.js](https://www.chartjs.org/) 提供視覺化解決方案
- 感謝所有貢獻者與使用者的回饋

## 📞 聯絡方式

- 問題回報：[GitHub Issues](https://github.com/yourusername/HomeCalc/issues)
- 功能建議：[GitHub Discussions](https://github.com/yourusername/HomeCalc/discussions)

---

**使用 HomeCalc，讓購屋財務規劃變得簡單！** 🏠✨
