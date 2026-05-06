import { httpAction } from "../_generated/server";
import { internal } from "../_generated/api";
import type { FunctionReference } from "convex/server";
import { Webhook } from "svix";

type StackWebhookEvent = {
  type: string;
  data?: unknown;
};

function asObject(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }
  return value as Record<string, unknown>;
}

function asString(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

export const stackWebhookHandler = httpAction(async (ctx, request) => {
  const payload = await request.text();
  const webhookSecret = process.env.STACK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error("Missing STACK_WEBHOOK_SECRET in environment variables");
  }

  const svix_id = request.headers.get("svix-id");
  const svix_timestamp = request.headers.get("svix-timestamp");
  const svix_signature = request.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing Svix headers", { status: 400 });
  }

  const wh = new Webhook(webhookSecret);
  const internalApi = internal as unknown as {
    "core/users": {
      upsertFromStackWebhook: FunctionReference<"mutation", "internal">;
      deleteFromStackWebhook: FunctionReference<"mutation", "internal">;
    };
  };

  try {
    const evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as StackWebhookEvent;

    console.log(`Webhook received: ${evt.type}`);

    switch (evt.type) {
      case "user.created":
      case "user.updated": {
        const data = asObject(evt.data);
        if (!data) {
          return new Response("Invalid webhook payload", { status: 400 });
        }

        const stackId = asString(data.id);
        if (!stackId) {
          return new Response("Missing user id", { status: 400 });
        }

        const name = asString(data.display_name) ?? "Unknown";
        const email = asString(data.primary_email) ?? "";
        const imageUrl = asString(data.profile_image_url);

        await ctx.runMutation(
          internalApi["core/users"].upsertFromStackWebhook,
          {
            stackId,
            name,
            email,
            imageUrl,
          },
        );
        break;
      }

      case "user.deleted": {
        const data = asObject(evt.data);
        const stackId = data ? asString(data.id) : undefined;
        if (!stackId) {
          break;
        }

        await ctx.runMutation(
          internalApi["core/users"].deleteFromStackWebhook,
          {
            stackId,
          },
        );
        break;
      }

      default:
        break;
    }

    return new Response("ok", { status: 200 });
  } catch (err) {
    console.error("Invalid Stack webhook signature or payload:", err);
    return new Response("Invalid signature", { status: 400 });
  }
});
