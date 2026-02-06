# API Spec（預留）

前端目前使用 mock，之後接 Node API 時可依此規格實作。

## 資料收集

- **POST** `/api/data/collect`
- Body: `CollectDataReq`
- Response: `{ success: boolean }`

## 歷史記錄

- **GET** `/api/data/history`
- Response: `CollectDataReq[]`

## 指標

- **GET** `/api/analytics`
- Query: `restaurantId?`, `from?`, `to?`
- Response: `{ turnoverRate: number, avgProfit: number, popularByPartySize: { solo, group } }`

## 當前用戶

- **GET** `/api/me`
- Response: `User`（含 `restaurants`）
