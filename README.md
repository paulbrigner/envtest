# Next.js Env Test (Amplify Runtime)

This is an extremely simple Next.js app to test how environment variables behave in AWS Amplify Hosting at build-time and at runtime (SSR).

## Overview
- Client build-time: `NEXT_PUBLIC_*` variables are injected at build time and available in the browser. Changing these requires a new build/redeploy.
- Server runtime: Any env var is available on the server via `process.env` during SSR/API execution. Changing these does not require a rebuild; SSR/API sees updates immediately after you update Amplify environment variables.

The app shows three sections:
- Build-time (Client): reads `process.env.NEXT_PUBLIC_*` directly in the page.
- Server runtime (SSR): reads `process.env` in `getServerSideProps`.
- Server runtime via API: fetches selected env vars from `/api/env` to demonstrate true runtime resolution.

## Local Development
1. Copy `.env.example` to `.env` and adjust values as needed.
2. Install and run:
   - `npm install`
   - `npm run dev`
3. Open http://localhost:3000 and observe values. Note: locally, client `NEXT_PUBLIC_*` values update only after you restart the dev server or rebuild when changed.

## Deploy on Amplify Hosting
- Connect this repo and use a Node build image with default Next.js settings.
- Set environment variables in Amplify:
  - Build-time (client): `NEXT_PUBLIC_PUBLIC_KEY`, `NEXT_PUBLIC_ALLOWED_RUNTIME_KEYS`.
  - Runtime (server): e.g. `RUNTIME_FOO`, `SERVER_SECRET`, and `ALLOWED_RUNTIME_KEYS` (controls API whitelist).

Recommended example settings:
- `NEXT_PUBLIC_PUBLIC_KEY=hello-from-build`
- `NEXT_PUBLIC_ALLOWED_RUNTIME_KEYS=RUNTIME_FOO,SERVER_SECRET`
- `RUNTIME_FOO=bar`
- `SERVER_SECRET=super-secret-value`
- `ALLOWED_RUNTIME_KEYS=RUNTIME_FOO,SERVER_SECRET`

After deployment:
- Updating `RUNTIME_FOO` or `SERVER_SECRET` should reflect immediately in the SSR section and the `/api/env` section without a rebuild.
- Updating `NEXT_PUBLIC_PUBLIC_KEY` requires a rebuild to be visible in the browser.

## Security Notes
- `/api/env` only returns keys listed in `ALLOWED_RUNTIME_KEYS`. Do not include secrets you don’t want exposed to clients.
- The UI masks `SERVER_SECRET` in the SSR section. Treat this project as a testing tool only.

## Files
- `pages/index.js`: Renders values; reads server vars in `getServerSideProps`, client vars directly, and runtime vars via `/api/env`.
- `pages/api/env.js`: Returns a whitelist of env vars from `process.env` at runtime.
- `.env.example`: Sample configuration.

## Scripts
- `npm run dev`: Start Next.js dev server.
- `npm run build`: Build for production.
- `npm run start`: Start production server.

