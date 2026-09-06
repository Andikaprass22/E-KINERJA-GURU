# Research: E-KINERJA GURU (May 2026)

## Next.js 16 Best Practices

### Dynamic Caching with "use cache"
- **Decision**: Implement 'use cache' directive for data-heavy components (Dashboard analytics, Semester lists).
- **Rationale**: Replaces `force-static` and `unstable_cache`. Allows granular caching of async functions/components.
- **Implementation**:
  ```tsx
  async function TeacherStats() {
    'use cache'
    cacheTag('stats')
    const stats = await getStats()
    return <StatsUI data={stats} />
  }
  ```

### Cache Invalidation Logic
- **Decision**: Use `updateTag` for immediate UI feedback in Server Actions, and `revalidateTag` for background/webhook invalidations.
- **Rationale**: `updateTag` ensures the next request sees fresh data (read-your-own-writes), while `revalidateTag` defaults to stale-while-revalidate (SWR).
- **Comparison**:
  - `updateTag`: Server Actions only. Fresh data immediately.
  - `revalidateTag`: Any context. background fetch (SWR).

### Middleware Migration (`proxy.ts`)
- **Decision**: Rename `middleware.ts` to `proxy.ts`.
- **Rationale**: Official Next.js 16 convention to clarify network boundaries.
- **Note**: `edge` runtime is NOT supported in `proxy.ts` (it uses Node.js runtime).
  ```ts
  // proxy.ts
  export function proxy(request: Request) {
    // Auth checks & routing logic
  }
  ```

## Prisma V7 & Neon Postgres

### Connection Pooling & Serverless
- **Decision**: Use `@prisma/adapter-neon` with WebSocket support.
- **Rationale**: Optimized for serverless environments (Vercel/Neon).
- **Critical Config**: Set `PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK="true"` in `.env` to prevent P1002 timeouts on Neon direct connections.

### Schema Management
- **Decision**: Define core entities (User, Semester, Submission) first, then merge Better Auth models.
- **Better Auth Sync**: Use `bun x auth@latest generate` to automatically append auth models to `schema.prisma`.

## Better Auth Architecture

### Prisma Adapter
- **Decision**: Use the Better Auth Prisma Adapter.
- **Rationale**: Deep integration with our existing data model and type-safety.
- **Setup**:
  ```ts
  export const auth = betterAuth({
    database: prismaAdapter(prisma, {
      provider: "postgresql",
    }),
    // plugins...
  })
  ```

## Uploadthing v7 (Token-Only)

### Configuration
- **Decision**: Use `UPLOADTHING_TOKEN` environment variable.
- **Rationale**: v7 deprecates local API calls for presigned URLs by encoding App ID and Region into the Token itself.
- **Integration**:
  ```ts
  export const { GET, POST } = createRouteHandler({
    router: uploadRouter,
    config: {
      token: process.env.UPLOADTHING_TOKEN,
    },
  });
  ```

## Technical Summary Table

| Feature | Solution (May 2026) | Tool/Command |
|---|---|---|
| **Auth Schema** | Better Auth CLI Auto-gen | `bun x auth@latest generate` |
| **Data Fetching** | Segmented Caching | `use cache` + `cacheTag` |
| **Invalidation** | Synchronous Invalidation | `updateTag` |
| **File Storage** | Token-based CDN | Uploadthing v7 |
| **Edge Logic** | Node.js Proxy | `proxy.ts` |
| **DB Performance** | Neon WebSocket Adapter | `@prisma/adapter-neon` |

## Alternatives Considered
- **Middleware.ts (Edge)**: Rejected in favor of `proxy.ts` for Next.js 16 compliance, despite losing edge-runtime benefits for standard routing logic.
- **Drizzle ORM**: Rejected because Prisma V7 (May 2026) has caught up in serverless performance with the Neon adapter and provides better DX for this specific multi-role project.
