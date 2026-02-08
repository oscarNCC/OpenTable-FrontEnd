# OpenTable Frontend

Monorepo for the OpenTable restaurant apps: customer ordering, POS (point of sale), and admin. Built with React, TypeScript, Vite, and Turbo.

## Structure

```
OpenTable-FrontEnd/
├── apps/
│   ├── web          # 單一 SPA：登入後依角色進 admin / pos / client
│   ├── client-web   # Customer ordering (dine-in / table)
│   ├── pos-web      # POS: view & edit customer orders
│   └── admin-web    # Admin: dashboard, restaurants, auth
├── packages/
│   ├── shared-types # Shared TypeScript types (e.g. CollectDataReq, Table)
│   ├── analytics    # Turnover, profit, popular dishes
│   ├── ui           # Shared UI components (Button, Card, Dialog, etc.)
│   ├── config       # Tailwind and shared config
│   └── store        # Shared state (e.g. restaurants)
└── docs/            # API spec, metrics
```

## Apps

| App | Purpose |
|-----|---------|
| **web** | 單一入口：登入頁 → 依角色導向 admin / pos / client。預設 `npm run dev` 啟動此 app。 |
| **client-web** | Customers place orders (menu, table, submit). Sends orders to the backend. |
| **pos-web** | Staff view customer orders, edit details (table, items, status, notes), and use quick actions. |
| **admin-web** | Admin dashboard, restaurant management, auth, and data preview. |

## Tech stack

- **React 19** + **TypeScript**
- **Vite** for dev and build
- **Tailwind CSS** for styling
- **Turbo** for monorepo tasks

## Prerequisites

- Node.js 20.19+ or 22.12+ (see Vite requirements)
- npm 10.x (or pnpm; workspace is configured for npm)

## Scripts

From the repo root:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start **web** (unified SPA with login) — 預設 |
| `npm run dev:web` | Start web |
| `npm run dev:pos` | Start pos-web |
| `npm run dev:client` | Start client-web |
| `npm run dev:admin` | Start admin-web |
| `npm run build` | Build all apps and packages (Turbo) |
| `npm run lint` | Lint all workspaces |

## Backend

**client-web** and **pos-web** call a backend API for orders:

- **POST** `/api/data/collect` — submit order
- **GET** `/api/data/history` — list orders (query: `restaurantId`, `from`, `to`, `tableId`)
- **GET** `/api/data/orders/:id` — get one order
- **PATCH** `/api/data/orders/:id` — update order (e.g. status, items)

Set the API base URL with `VITE_API_URL` (e.g. in `.env.development`). Default is `http://localhost:3001`. See each app’s `.env.development.example` if present.

## How to test (登入與角色導向)

1. **後端**：在 `OpenTable-BackEnd` 設定 `.env`（含 `DATABASE_URL`、`JWT_SECRET`），執行 `npm run db:migrate`、`npm run db:seed`，再 `npm run dev`。
2. **前端**：在專案根目錄執行 `npm run dev`，瀏覽器打開 http://localhost:5173。
3. **登入**：會進入 `/login`，使用測試帳號：**admin** `admin@example.com` / **staff** `staff@example.com` / **client** `client@example.com`，密碼皆為 `password123`，登入後會分別導向 `/admin`、`/pos`、`/client`。
4. 登出後會回到 `/login`，可換帳號再測不同角色。

## Docs

- [docs/api-spec.md](docs/api-spec.md) — API contract (collect, history, analytics, me)
- [docs/metrics.md](docs/metrics.md) — Metrics notes

## License

See [LICENSE](LICENSE).
