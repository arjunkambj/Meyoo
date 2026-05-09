---
name: stack-auth-convex
description: Use when integrating Stack Auth with Convex, especially for Convex auth.config.ts, convex.config.ts, getPartialUser in Convex queries/mutations, Stack user access in Next.js route handlers, and Convex fetchQuery/fetchMutation auth tokens.
---

# Stack Auth Convex

## Core Model

Keep the three Convex auth pieces separate:

1. `convex/auth.config.ts` tells Convex which Stack Auth JWT issuers to trust.
2. `convex.setAuth(...)` or `{ token }` on `fetchQuery`/`fetchMutation` sends the current Stack Auth JWT to Convex.
3. `stackServerApp.getPartialUser({ from: "convex", ctx })` reads the authenticated Convex identity inside Convex functions.

Do not pass Stack Auth tokens in Convex query or mutation args. Args are business data; auth belongs in Convex auth.

Use the right user shape:

- **Partial user**: `getPartialUser({ from: "convex", ctx })`. Use in Convex queries and mutations for identity, ownership, and simple auth gates. It comes from Convex JWT claims and has no team data.
- **Full user**: `getUser(...)`. Use when code needs Stack Auth-backed data such as `selectedTeam`, `listTeams()`, team profiles, metadata updates, or other server user methods. Prefer Next.js route handlers or Convex actions for full-user work.

## Required Convex Setup

Use the package matching the app: `@stackframe/stack` for Next.js, `@stackframe/react` for React, `@stackframe/js` for vanilla JS.

Import `getConvexProvidersConfig` from the Stack package that matches the app:

- `@stackframe/stack` for Next.js
- `@stackframe/react` for React
- `@stackframe/js` for vanilla JS

The Stack packages export Convex component subpaths:

- `@stackframe/stack/convex.config`
- equivalent subpaths exist for `@stackframe/react` and `@stackframe/js`

Set the same Stack Auth environment variables in both the app runtime and the Convex deployment environment. At minimum Convex needs the project ID and, for server-side Stack calls from Convex actions, the secret server key.

```ts
// convex/auth.config.ts
import { getConvexProvidersConfig } from "@stackframe/stack";

export default {
  providers: getConvexProvidersConfig({
    projectId: process.env.STACK_PROJECT_ID!,
  }),
};
```

```ts
// convex/convex.config.ts
import stackAuthComponent from "@stackframe/stack/convex.config";
import { defineApp } from "convex/server";

const app = defineApp();
app.use(stackAuthComponent);

export default app;
```

`convex.config.ts` registers the Stack Auth Convex component. It does not send the user token and does not replace `auth.config.ts`.

## Stack App Imports In Monorepos

Keep Stack app construction in a small shared module that can be imported by both Next.js and Convex code.

```ts
// stack/client.ts
import { StackClientApp } from "@stackframe/stack";

export const stackClientApp = new StackClientApp({
  tokenStore: "nextjs-cookie",
});
```

```ts
// stack/server.ts
import { StackServerApp } from "@stackframe/stack";
import { stackClientApp } from "./client";

export const stackServerApp = new StackServerApp({
  inheritsFrom: stackClientApp,
});
```

In a Turborepo, do not import `stackServerApp` from a Next.js route, page, layout, or any module with Next-only side effects. Import from a neutral shared module instead:

```ts
// convex/myFunctions.ts
import { stackServerApp } from "../stack/server";
```

If the Convex code lives in a separate workspace package that does not depend on Next.js, prefer creating a Convex-safe Stack module there with `@stackframe/js` instead of importing from the Next app package. If the Convex directory is inside a Next.js app, importing `StackServerApp` from `@stackframe/stack` matches the repo example.

## Browser Convex Client

For a React client, set auth once when creating the Convex client:

```tsx
"use client";

import { stackClientApp } from "@/stack/client";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
convex.setAuth(stackClientApp.getConvexClientAuth({}));

export function ConvexClientProvider(props: { children: React.ReactNode }) {
  return <ConvexProvider client={convex}>{props.children}</ConvexProvider>;
}
```

`getConvexClientAuth({})` is valid when the Stack app already has a default token store, for example `tokenStore: "nextjs-cookie"`.

## Convex Queries

Use `getPartialUser` in queries. It returns token identity data only and may be `null`.

```ts
// convex/myFunctions.ts
import { query } from "./_generated/server";
import { stackServerApp } from "../stack/server";

export const getUserInfo = query({
  args: {},
  handler: async (ctx) => {
    const user = await stackServerApp.getPartialUser({ from: "convex", ctx });

    if (user == null) {
      return { signedIn: false };
    }

    return {
      signedIn: true,
      user: {
        id: user.id,
        displayName: user.displayName,
        primaryEmail: user.primaryEmail,
        primaryEmailVerified: user.primaryEmailVerified,
        isAnonymous: user.isAnonymous,
        isMultiFactorRequired: user.isMultiFactorRequired,
        isRestricted: user.isRestricted,
        restrictedReason: user.restrictedReason,
      },
    };
  },
});
```

`getPartialUser({ from: "convex", ctx })` returns:

```ts
{
  id: string;
  displayName: string | null;
  primaryEmail: string | null;
  primaryEmailVerified: boolean;
  isAnonymous: boolean;
  isMultiFactorRequired: boolean;
  isRestricted: boolean;
  restrictedReason: string | null;
}
```

It does not include `teamId`, `selectedTeamId`, `selectedTeam`, or team lists.

If a query must be team-scoped, pass the requested `teamId` as a normal arg, then validate membership in a layer that can load the full user, or maintain a Convex-side membership table. Do not assume the selected team is present in the JWT identity.

## Convex Mutations

Use auth from `ctx`, not `userId` from client args:

```ts
import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { stackServerApp } from "../stack/server";

export const createNote = mutation({
  args: {
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await stackServerApp.getPartialUser({ from: "convex", ctx });

    if (user == null) {
      throw new Error("User must be signed in to create a note.");
    }

    return await ctx.db.insert("notes", {
      text: args.text,
      ownerUserId: user.id,
    });
  },
});
```

Use `getPartialUser` for authorization gates and ownership fields in queries/mutations. If full Stack Auth data or team data is needed, use a Next.js route handler or a Convex action.

## Convex Actions For Full Stack User

Actions can call external services. Use them when the Convex function needs the full Stack user object, team data, or needs to write Stack Auth metadata. Full users expose team APIs such as `user.selectedTeam` and `await user.listTeams()`.

```ts
"use node";

import { action } from "./_generated/server";
import { stackServerApp } from "../stack/server";

export const getFullStackUser = action({
  args: {},
  handler: async (ctx) => {
    const partialUser = await stackServerApp.getPartialUser({ from: "convex", ctx });

    if (partialUser == null) {
      return null;
    }

    const user = await stackServerApp.getUser(partialUser.id);

    if (user == null) {
      throw new Error("Convex identity referenced a Stack Auth user that does not exist.");
    }

    const teams = await user.listTeams();

    return {
      id: user.id,
      primaryEmail: user.primaryEmail,
      displayName: user.displayName,
      selectedTeamId: user.selectedTeam?.id ?? null,
      teams: teams.map((team) => ({
        id: team.id,
        displayName: team.displayName,
      })),
    };
  },
});
```

## Next.js Route Handlers

In a Next.js API route, get the current Stack user from the request and pass the Convex JWT as the third argument to `fetchQuery` or `fetchMutation`.

Next.js route handlers are the cleanest place to combine full Stack Auth user/team data with Convex queries or mutations:

```ts
const user = await stackServerApp.getUser({ tokenStore: request });

if (user == null) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

const teams = await user.listTeams();
```

```ts
// app/api/user-info/route.ts
import { api } from "@/convex/_generated/api";
import { stackServerApp } from "@/stack/server";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = await stackServerApp.getConvexHttpClientAuth({
    tokenStore: request,
  });

  if (token === "") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await stackServerApp.getUser({ tokenStore: request });

  if (user == null) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const teams = await user.listTeams();

  const convexUserInfo = await fetchQuery(
    api.myFunctions.getUserInfo,
    {},
    { token },
  );

  return NextResponse.json(
    {
      stackUser: {
        id: user.id,
        primaryEmail: user.primaryEmail,
        displayName: user.displayName,
        selectedTeamId: user.selectedTeam?.id ?? null,
        teams: teams.map((team) => ({
          id: team.id,
          displayName: team.displayName,
        })),
      },
      convexUserInfo,
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}

export async function POST(request: NextRequest) {
  const token = await stackServerApp.getConvexHttpClientAuth({
    tokenStore: request,
  });

  if (token === "") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (typeof body !== "object" || body == null || !("text" in body)) {
    return NextResponse.json({ error: "Missing text" }, { status: 400 });
  }

  const text = Reflect.get(body, "text");

  if (typeof text !== "string") {
    return NextResponse.json({ error: "text must be a string" }, { status: 400 });
  }

  const noteId = await fetchMutation(
    api.myFunctions.createNote,
    { text },
    { token },
  );

  return NextResponse.json(
    { noteId },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
```

`fetchQuery(api.fn, {}, { token })` means:

- First arg: Convex function reference.
- Second arg: Convex query/mutation args. `{}` is normal for no args.
- Third arg: Next.js Convex options. Put the Stack Auth JWT here as `{ token }`.

Use the same third-argument pattern for actions:

```ts
import { fetchAction } from "convex/nextjs";

const result = await fetchAction(
  api.myActions.getFullStackUser,
  {},
  { token },
);
```

For server-rendered React that should hydrate into a reactive client component, use `preloadQuery(..., args, { token })` and pass the result to `usePreloadedQuery`. For route handlers and one-off server reads, prefer `fetchQuery`.

## ConvexHttpClient Alternative

`fetchQuery`, `fetchMutation`, and `fetchAction` from `convex/nextjs` are usually the simplest path in Next.js Server Components, Server Actions, and Route Handlers.

Use `ConvexHttpClient` directly when code already needs a client instance or is outside the `convex/nextjs` helper path:

```ts
import { api } from "@/convex/_generated/api";
import { stackServerApp } from "@/stack/server";
import { ConvexHttpClient } from "convex/browser";

const token = await stackServerApp.getConvexHttpClientAuth({
  tokenStore: request,
});

if (token === "") {
  throw new Error("User must be signed in before calling Convex.");
}

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
convex.setAuth(token);

const result = await convex.query(api.myFunctions.getUserInfo, {});
```

The Stack CLI intentionally does not auto-wire `ConvexHttpClient`; review those call sites manually.

## Common Mistakes

- Do not pass `{ token }` as the second argument to `fetchQuery`; that sends it to the Convex function as business args.
- Do not expect `getPartialUser` to include teams. It only maps Convex JWT identity claims. Use full `getUser(...)` for `selectedTeam` and `listTeams()`.
- Do not trust `userId` or `teamId` sent by the browser. Read the user from `ctx.auth` or from the Next.js request, then validate team membership before writing team-owned data.
- Do not import Stack app instances from Next.js route/page/layout modules into Convex functions. Use a neutral shared `stack/server.ts` module or a workspace package.
- Do not silently continue when `token === ""` or `user == null`; return 401 or throw.
- Add `Cache-Control: private, no-store` to authenticated route handler responses.
