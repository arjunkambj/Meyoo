import { getConvexProvidersConfig } from "@stackframe/stack";

const STACK_PROJECT_ID = process.env.STACK_PROJECT_ID;

if (!STACK_PROJECT_ID) {
  throw new Error("Missing STACK_PROJECT_ID for Convex Stack Auth config");
}

export default {
  providers: getConvexProvidersConfig({
    projectId: STACK_PROJECT_ID,
  }),
};
