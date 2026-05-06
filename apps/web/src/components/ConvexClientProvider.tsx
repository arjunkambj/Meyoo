"use client";

import type React from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache/provider";
import { stackClientApp } from "../stack/client";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
convex.setAuth(stackClientApp.getConvexClientAuth({}));

export default function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexProvider client={convex}>
      <ConvexQueryCacheProvider>{children}</ConvexQueryCacheProvider>
    </ConvexProvider>
  );
}
