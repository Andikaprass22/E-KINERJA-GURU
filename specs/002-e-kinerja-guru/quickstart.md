# Quickstart: E-KINERJA GURU Implementation (May 2026)

## 1. Prerequisites
- **Bun** installed
- **Neon** project created
- **Uploadthing** project created (Token ready)

## 2. Environment Setup
Create `.env` based on `.env.example`:
```bash
DATABASE_URL="postgres://..."
PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK="true"
UPLOADTHING_TOKEN="..."
BETTER_AUTH_SECRET="..."
BETTER_AUTH_URL="http://localhost:3000"
```

## 3. Project Initialization
```bash
# Install dependencies
bun install

# Initialize Prisma (if not yet done)
bun x prisma init

# Apply Auth Models
bun x auth@latest generate

# Generate Prisma Client
bun x prisma generate
```

## 4. Coding Standards (Strict)
- **No Comments**: Delete all comments before committing.
- **Caching**: Use `'use cache'` at the top of server components fetching data.
- **Invalidation**: Use `updateTag('stats')` in server actions.
- **Proxy**: Routing logic must reside in `proxy.ts` (Edge Runtime is Forbidden).

## 5. Development Workflow
1. Start dev server: `bun dev`
2. Sync DB: `bun x prisma db push`
3. Access Dashboard: `http://localhost:3000`
