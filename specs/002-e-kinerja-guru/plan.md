# Implementation Plan: [FEATURE]

**Branch**: `002-e-kinerja-guru` | **Date**: 2026-05-08 | **Spec**: [spec.md](./spec.md)
**Status**: Planning Complete

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Building "E-KINERJA GURU" for SD N 1 Pancor, a web-based teacher administration and evaluation system. Implementation focuses on multi-role dashboards (Admin, Principal, Teacher) using Next.js 16 with 'use cache' for performance, Prisma V7 with Neon for serverless data management, Better Auth for secure role-based access, and Uploadthing v7 for document storage.


## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript / Next.js 16 (May 2026)
**Primary Dependencies**: Next.js 16, shadcn/ui, Framer Motion, Better Auth, Uploadthing v7, Prisma V7
**Storage**: Neon Postgres (DATABASE_URL)
**Testing**: Not specified in spec (Assumption: default Next.js testing)
**Target Platform**: Web / Bun Runtime
**Project Type**: web-app
**Performance Goals**: Maximum caching using "use cache" components, revalidateTag, and updateTag.
**Constraints**: No comments in code, install with bun, Uploadthing Token (no app_id), proxy.ts usage (no middleware).
**Scale/Scope**: ~8-10 teacher documents, multi-role auth, semester-based archives.


## Constitution Check

- [x] **GA-001**: Stack compliance (Next.js 16, Prisma V7, Neon, Better Auth, Uploadthing v7).
- [x] **GA-002**: Runtime compliance (Bun).
- [x] **GA-003**: Coding style (No comments in code).
- [x] **GA-004**: Architecture (Cache Components, revalidateTag, proxy.ts).
- [x] **GA-005**: Auth adapter (Prisma Adapter for Better Auth).


## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/                   # App Router
├── admin/             # Admin paths
├── principal/         # Principal paths
├── teacher/           # Teacher paths
├── api/               # API handlers (Uploadthing, Better Auth)
├── layout.tsx         # Root layout
└── page.tsx           # Entry/Login

components/            # UI Components
├── ui/                # Shadcn primitives
├── dashboard/         # Role-specific dashboard widgets
└── forms/             # Upload and evaluation forms

lib/                   # Utilities
├── prisma.ts          # Client initialization (Neon adapter)
├── auth.ts            # Better Auth configuration
└── utils.ts           # Framer motion & helper functions

proxy.ts               # Next.js 16 Proxy logic (Routing/Auth)
prisma/                # Database schema
```

**Structure Decision**: Standard Next.js 16 App Router structure with localized role-based routing. All logic resides in the root project.


## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
