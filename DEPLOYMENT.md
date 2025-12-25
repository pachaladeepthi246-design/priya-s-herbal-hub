# Deployment Guide (Vercel & Coolify) 🔧

This document explains how to deploy the site to **Vercel** and **Coolify**, and lists required environment variables.

---

## Required environment variables

Place these in your hosting provider's environment settings (do NOT commit to Git):

- VITE_SUPABASE_URL — e.g. `https://your-supabase-url.supabase.co`
- VITE_SUPABASE_PUBLISHABLE_KEY — Supabase public anon key (safe to expose in browser)
- RAZORPAY_KEY_ID — (server-only) required by Supabase function that creates Razorpay orders
- RAZORPAY_KEY_SECRET — (server-only) required by Supabase function that creates Razorpay orders
- SUPABASE_SERVICE_ROLE_KEY — (server-only) only for server/edge functions; keep secret


---

## Vercel (recommended for static site)

1. Import the GitHub repo into Vercel.
2. Build settings:
   - Framework preset: `Other` or `Vite` (if available)
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Add environment variables in the Project Settings. For client envs, use the same name (must begin with `VITE_` to be available in the browser).
4. Deploy. If the site shows 404s or broken assets, check that the output directory is `dist` and `index.html` exists after build.

Common pitfalls:
- Missing VITE_* variables cause runtime failures for Supabase usage (client may appear blank).
- If you use a custom domain, ensure DNS is configured and the domain is assigned in Vercel settings.

---

## Coolify

Coolify supports several deployment strategies (Dockerfile, buildpacks). For a simple SSG/static site:

1. Create a new app in Coolify and connect your repository.
2. Use a build command: `npm ci && npm run build` and set a publish directory `dist/`.
3. Add environment variables under the app settings (server-only secrets are available during build if set as env vars).
4. If you need edge/serverless functions (Supabase functions), configure them separately in Supabase and set those secrets there (Coolify does not manage Supabase functions by default).

---

## Supabase functions and server secrets

- The repository includes Supabase Edge Functions in `/supabase/functions` which use `Deno.env.get(...)` to read server secrets like `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
- Add those secrets in your Supabase project dashboard (not as `VITE_` variables). Keep them private.

---

## Troubleshooting production page not loading

- First, check build logs in Vercel/Coolify. If `npm run build` fails, fix errors locally and try again.
- If build succeeds but the site is blank or JS errors occur, check browser console for missing env variables or network calls failing (401/403). Missing `VITE_` variables are a common root cause.
- For 404s on SPA routes, ensure your hosting is configured to serve `index.html` for unknown routes (Vercel handles this by default; other hosts may need redirects / rewrites to `index.html`).

If you give me access to deployment logs or error messages (or allow me to create a branch/PR and test), I can investigate the production runtime errors and fix them.

---

CI / GitHub Actions (recommended)

- I added a GitHub Actions workflow `/.github/workflows/ci.yml` that runs on PRs and pushes to `main` / `feat/**` and does the following:
  - `npm ci && npm run build`
  - `npm run lint` (non-blocking)
  - Uploads built `dist/` as an artifact for debugging
  - Optionally deploys to Vercel when `VERCEL_TOKEN` and `VERCEL_PROJECT_ID` secrets are set in the repo (see below)

- I also added `/.github/workflows/docker-publish.yml` which will build and push a Docker image to GHCR if `GHCR_TOKEN` is provided (useful if you want to deploy to Coolify from an image registry). This workflow can be run manually via GitHub UI.

Vercel configuration

- `vercel.json` is included in the repo and configures Vercel's static build to use `dist/` and rewrites all routes to `index.html` so the SPA works correctly.

Required GitHub repository secrets (for automatic deploys):

- `VERCEL_TOKEN` — your Vercel personal token
- `VERCEL_ORG_ID` — (optional) Vercel org id
- `VERCEL_PROJECT_ID` — Vercel project id
- `GHCR_TOKEN` — (optional) GitHub Container Registry token (to push images)

How to set the secrets:
1. Go to your GitHub repository > Settings > Secrets & variables > Actions > New repository secret
2. Add `VERCEL_TOKEN`, `VERCEL_PROJECT_ID` (and `VERCEL_ORG_ID` if you want), or `GHCR_TOKEN` if you use the Docker publish workflow.

Coolify notes

- You can either let Coolify build the Dockerfile from the repo (recommended) or use a pre-built image pushed to GHCR and point Coolify at that image.
- The `Dockerfile` and `nginx.conf` in the repo work for SPA routing and static serving.

---

If you'd like, I can:
- Create a GitHub Action that deploys to Coolify automatically after a successful push to `main` (requires credentials / registry or Coolify API access),
- Help you add the required repository secrets, or
- Run a manual deploy for you if you invite me as a collaborator or share logs.

