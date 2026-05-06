import type { NextRequest } from "next/server";

import { stackServerApp } from "@/stack/server";

export async function stackConvexToken(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser({ tokenStore: request });
    const token = user ? (await user.getAuthJson()).accessToken : null;
    return token ?? null;
  } catch {
    return null;
  }
}
