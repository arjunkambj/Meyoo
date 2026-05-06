import { httpRouter } from "convex/server";

import { syncGoogle, syncMeta, syncShopify } from "./httpSync";
import {
  customerDataRequest,
  customerRedact,
  shopRedact,
} from "./webhooks/gdpr";
import { stackWebhookHandler } from "./webhooks/stack";
import { shopifyWebhook, shopifyWebhookHealth } from "./webhooks/shopify";

const http = httpRouter();

// Shopify webhook routes
http.route({
  path: "/webhook/shopify",
  method: "POST",
  handler: shopifyWebhook,
});

http.route({
  path: "/webhook/shopify",
  method: "GET",
  handler: shopifyWebhookHealth,
});

// GDPR webhook routes
http.route({
  path: "/gdpr/customers/redact",
  method: "POST",
  handler: customerRedact,
});

http.route({
  path: "/gdpr/customers/data_request",
  method: "POST",
  handler: customerDataRequest,
});

http.route({
  path: "/gdpr/shop/redact",
  method: "POST",
  handler: shopRedact,
});

// Sync HTTP endpoints
http.route({
  path: "/sync/shopify",
  method: "POST",
  handler: syncShopify,
});

http.route({
  path: "/sync/meta",
  method: "POST",
  handler: syncMeta,
});

http.route({
  path: "/sync/google",
  method: "POST",
  handler: syncGoogle,
});

// Stack webhook routes
http.route({
  path: "/webhook/stack",
  method: "POST",
  handler: stackWebhookHandler,
});

export default http;
