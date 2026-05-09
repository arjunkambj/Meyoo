import type { NextRequest } from "next/server";

import { stackServerApp } from "@/stack/server";

export async function stackConvexToken(request: NextRequest) {
  const token = await stackServerApp.getConvexHttpClientAuth({
    tokenStore: request,
  });

  return token === "" ? null : token;
}
