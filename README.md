# OpenTable Frontend

Monorepo for the OpenTable restaurant apps: customer ordering, POS (point of sale), and admin. Built with React, TypeScript, Vite, and Turbo.

### APP

#### Client Web (Client Website)

![Client Web](git_pic/client-web.png)
![Pizza Options](git_pic/client-web-pizza_option.png)

## Apps

| App | Purpose |
|-----|---------|
| **web** | Single Entry: Login page → redirects to admin / pos / client based on role. Default `npm run dev` starts this app. |
| **client-web** | Customers place orders (menu, table, submit). Sends orders to the backend. |
| **pos-web** | Staff view customer orders, edit details (table, items, status, notes), and use quick actions. |
| **admin-web** | Admin dashboard, restaurant management, auth, and data preview. |

## Tech stack

- **React 19** + **TypeScript**
- **Vite** for dev and build
- **Tailwind CSS** for styling
- **Turbo** for monorepo tasks

## Scripts

From the repo root:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start **web** (unified SPA with login) — Default |
| `npm run dev:web` | Start web |
| `npm run dev:pos` | Start pos-web |
| `npm run dev:client` | Start client-web |
| `npm run dev:admin` | Start admin-web |
| `npm run build` | Build all apps and packages (Turbo) |
| `npm run lint` | Lint all workspaces |

## How to test (Login & Role Redirection)

1. **Backend**: Configure `.env` (including `DATABASE_URL`, `JWT_SECRET`) in `OpenTable-BackEnd`, run `npm run db:migrate`, `npm run db:seed`, then `npm run dev`.
2. **Frontend**: Run `npm run dev` in the project root, open http://localhost:5173 in browser.
3. **Login**: Go to `/login`, use test accounts:
    - **admin**: `admin@example.com` / `password123` -> redirects to `/admin`
    - **staff**: `staff@example.com` / `password123` -> redirects to `/pos`
    - **client**: `client@example.com` / `password123` -> redirects to `/client`
4. Logout to return to `/login`.

## Backend API

**client-web** and **pos-web** call a backend API for orders.
Set the API base URL with `VITE_API_URL` (e.g. in `.env.development`). Default is `http://localhost:3001`.
