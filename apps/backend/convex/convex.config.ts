import actionRetrier from "@convex-dev/action-retrier/convex.config";
import workpool from "@convex-dev/workpool/convex.config";
import stackAuthComponent from "@stackframe/stack/convex.config";
import { defineApp } from "convex/server";

const app = defineApp();

app.use(stackAuthComponent);

// Main workpool for all async operations with priority levels
app.use(workpool, { name: "mainWorkpool" });

// Action retrier for resilient external API calls
app.use(actionRetrier);

export default app;
