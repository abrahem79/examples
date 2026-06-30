---
name: testing-fga-demo
description: Test the FGA (Fine-Grained Authorization) demo pages end-to-end. Use when verifying FGA UI changes, audit trail filtering, user state persistence, or SSR hydration fixes.
---

# Testing the FGA Demo

## Overview

The FGA demo is a Nuxt 4 app deployed on Netlify. It demonstrates Fine-Grained Authorization patterns including RBAC, FGAC, collaboration, and organization-level access control.

## Key Pages

- `/fga` — Main FGA overview with Check API, Query API, Permission Matrix, Role Manager
- `/fga/rbac` — Role-Based Access Control demo
- `/fga/fgac` — Fine-Grained Access Control demo
- `/fga/collaboration` — Document collaboration & sharing demo
- `/fga/organization` — Organization-level access control demo

## Common Test Scenarios

### 1. Audit Trail Filtering (Role Manager > Audit Trail tab)

Path: `/fga` > scroll to "Advanced FGA Tools" > click "Role Manager" > click "Audit Trail" tab.

The audit trail has a filter dropdown with options: All Events, Access Granted, Access Denied, Role Changes.

**Known pitfall:** The `<option>` values must match the `event.type` field names in the mock data (e.g. `access_granted`, `access_denied`, `role_change`). If filter options use shortened names (e.g. `granted`, `denied`), the filter comparison `event.type === auditFilter.value` will fail and show 0 results.

Expected counts:
- All Events: 4 (Alice GRANTED, Charlie DENIED, Bob CHANGED, Diana GRANTED)
- Access Granted: 2 (Alice Johnson, Diana Prince)
- Access Denied: 1 (Charlie Brown)
- Role Changes: 1 (Bob Smith)

### 2. User State Persistence Across Pages

Path: `/fga` > "Current Demo User" panel > Switch User dropdown > select a non-default user (e.g. Bob Smith) > navigate to `/fga/collaboration`.

**Known pitfall:** The `useFGA` composable must use `useState` (Nuxt shared state) instead of `ref` (Vue local state) for `currentUser`. Using `ref` creates a fresh instance each time `useFGA()` is called, so the selected user resets on navigation.

Assertion: The collaboration page should show "Acting as: [selected user]" with the dropdown reflecting the same user.

### 3. SSR Hydration Mismatch

Path: `/fga` > Role Manager > Permissions tab > "Cross-department access" stat.

**Known pitfall:** Using `Math.random()` in computed properties that render during SSR causes hydration mismatches because the server and client produce different random values. Replace with deterministic values.

Assertion: No Vue "Hydration ... mismatch" warnings in the browser console. The cross-department access value should be a stable constant (currently 5).

**Testing note:** The Permissions tab content only renders client-side when the tab is selected, so the hydration mismatch might not always be reproducible at runtime. The fix is best validated by code inspection (ensuring no non-deterministic values in SSR-rendered computed properties) combined with checking the browser console for warnings.

## Environment Setup

- The app uses Nuxt 4 with `npm install` for dependencies
- Build: `npx nuxt build`
- Dev server: `npx nuxt dev`
- Deploy previews are on Netlify at `deploy-preview-{PR_NUMBER}--loquacious-puffpuff-25fd69.netlify.app`

## Testing Tips

- Use the Netlify deploy preview URL for testing PRs rather than running locally, as it better reflects production SSR behavior
- The "Advanced FGA Tools" section (Permission Matrix, Role Manager) is below the fold on `/fga` — scroll down to find it
- The Role Manager has 4 tabs: Roles, Users, Permissions, Audit Trail
- When testing user persistence, always start from a fresh page load of `/fga` to ensure you're testing from the default state (Alice Johnson)
- For hydration mismatch testing, open the browser console before or immediately after page load — hydration warnings appear during initial render
- Mock data is defined in `app/composables/useFGA.ts` — check there for expected user names, roles, and event types

## Devin Secrets Needed

None required — the FGA demo uses mock data and doesn't need API keys or authentication.
