# skatespot.app

A Node.js + React SPA for sharing skate spots on a map. GraphQL API (Apollo Server), MongoDB, Google OAuth, and Mapbox.

## Prerequisites

- Node.js 18+ (20 LTS recommended)
- Docker (for local MongoDB)
- Google OAuth Web client ID
- Mapbox access token

## Local development

### 1. Environment

```bash
cp .env.example .env
cp client/.env.example client/.env
```

Fill in root `.env` (`MONGO_URI`, `OAUTH_CLIENT_ID`, `JWT_SECRET`, `PORT`) and `client/.env` (`VITE_*` values). `OAUTH_CLIENT_ID` must match `VITE_GOOGLE_CLIENT_ID`.

Sign in with **username or email** plus password, or **Google**. Sign up requires **username, email, and password** (8+ characters).

### 2. MongoDB

```bash
npm run db:up
```

### 3. API server (terminal 1)

```bash
npm install
npm run dev
```

GraphQL: http://localhost:4000/graphql

### 4. Client (terminal 2)

```bash
cd client
npm install
npm run dev
```

App: http://localhost:3000

## Scripts

| Location | Command | Description |
|----------|---------|-------------|
| root | `npm run db:up` | Start MongoDB container |
| root | `npm run db:down` | Stop MongoDB container |
| root | `npm run db:seed` | Seed random Calgary skate spots |
| root | `npm run db:seed -- --reset` | Clear pins and re-seed |
| root | `npm run db:seed -- --count=40` | Seed N spots (default 25) |
| root | `npm run db:seed -- --fix-images` | Update all pins to default image |
| root | `npm run dev` | API with nodemon |
| root | `npm test` | Backend tests |
| client | `npm run dev` | Vite dev server |
| client | `npm run build` | Production build |
| client | `npm test` | Client tests |

## Smoke testing

See [docs/SMOKE_CHECKLIST.md](docs/SMOKE_CHECKLIST.md).

## Screenshots

User Experience / Creating a Pin / Commenting:
![Splash](https://i.imgur.com/6nZLWJ6.gif)

New Spot Creation / UI:
![UI](https://i.imgur.com/8vezS8M.png)

Viewing existing spots / Map pop up:
![View](https://i.imgur.com/C6n21LX.png)
