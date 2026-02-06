# 指標定義

## 返桌率（Turnover Rate）

- **計算**：給定時間段內，每張枱平均被使用次數。
- **公式**：`總使用次數 / 枱數`
- **實作**：`packages/analytics` 內 `calcTurnoverRate(records, tables, slot)`

## 平均盈利（Avg Profit）

- **計算**：所有收集記錄的 `profit` 平均值。
- **實作**：`calcAvgProfit(records)`

## 熱門菜（依人數）

- **計算**：依「一人」與「多人」分組，各組內依 `menuItemId` 加總數量排序。
- **實作**：`calcPopularDishesByPartySize(records)` 回傳 `{ solo, group }`。
