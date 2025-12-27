# Next.js 16 Turbopack + Bun CommonJS Wrapper Bug Reproduction

Minimal reproduction for a bug where Bun fails with "Expected CommonJS module to have a function wrapper" during Next.js 16 Turbopack builds with the pages router.

## Issue

When building a Next.js 16 application with:
- Pages router (not app router)
- Turbopack (default in Next.js 16)
- @effect/schema dependency
- `bun run --bun build`

The build fails during the "Collecting page data" (SSG) phase with:

```
TypeError: Expected CommonJS module to have a function wrapper. If you weren't messing around with Bun's internals, this is a bug in Bun
```

## Steps to Reproduce

1. Install dependencies:
   ```bash
   bun install
   ```

2. Build with Bun runtime:
   ```bash
   bun run --bun build
   ```

## Expected Behavior

The build should complete successfully.

## Actual Behavior

Build fails with:
```
Error: Failed to load chunk server/chunks/ssr/node_modules_@effect_schema_dist_esm_Schema_*.js from runtime for chunk server/pages/index.js
    at loadRuntimeChunkPath (.next/server/chunks/ssr/[turbopack]_runtime.js:636:19)
    ...
  [cause]: TypeError: Expected CommonJS module to have a function wrapper. If you weren't messing around with Bun's internals, this is a bug in Bun
```

## Workaround

Use Node.js instead of Bun for the build:
```bash
node --run build
```

Or use the app router instead of pages router.

## Environment

- Bun: 1.3.5
- Next.js: 16.0.10
- @effect/schema: 0.75.5
- effect: 3.19.13
- OS: Ubuntu 24.04

## Notes

- This issue does NOT occur with the app router
- This issue does NOT occur when using Node.js runtime
- The issue is specific to the pages router + Turbopack + Bun combination
