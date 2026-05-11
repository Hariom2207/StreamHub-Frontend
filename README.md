# StreamHub - Frontend

The frontend for StreamHub, a video streaming app I'm building to learn full stack development. Tried to keep it close to how YouTube feels but built everything from scratch.

---

## What's in it

- Browse and watch videos
- Login / register
- Like, comment, subscribe
- Watch history
- Channel pages
- Dark mode
- Works on mobile too

---

## Stack

- React 18 + Vite
- TailwindCSS
- TanStack Query for server state
- Zustand for auth state
- React Router v6
- Axios with interceptors for auto token refresh

---

## Folder structure

```
src/
├── components/     reusable UI pieces
├── pages/          route-level components
├── queries/        react query hooks
├── services/       all api calls live here
├── stores/         zustand stores
├── constants/      api routes + query keys
├── lib/            axios instance + config
└── utils/          formatters etc
```

---

## Running locally

Make sure the backend is running first.

```bash
git clone https://github.com/hariom2207/streamhub-frontend.git
cd streamhub-frontend
npm install
cp .env.example .env
# add your backend URL in .env
npm run dev
```

---

## Environment variables

```
VITE_API_URL=http://localhost:8000/api/v1
```

---

## A few things I figured out while building

- Why you need a service layer instead of calling APIs directly in components
- How token refresh interceptors work in axios
- How TanStack Query makes loading/error states so much easier
- Zustand is way simpler than Redux for this kind of app

---

## Backend

The API repo is here → [streamhub-backend](https://github.com/hariom2207/streamhub-backend)