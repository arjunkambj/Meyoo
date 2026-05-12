import { v } from "convex/values";
import {
  paginationOptsValidator,
  paginationResultValidator,
} from "convex/server";
import { query } from "../_generated/server";
import type { QueryCtx } from "../_generated/server";
import type { Doc, Id } from "../_generated/dataModel";
import { findShopifyStoreByDomain, normalizeShopDomain } from "../utils/shop";
import { verifyShopProvisionSignature } from "../utils/crypto";
import { getUserAndOrg } from "../utils/auth";

const variantPageItemFields = {
  _id: v.id("shopifyProductVariants"),
  _creationTime: v.number(),
  organizationId: v.id("organizations"),
  productId: v.id("shopifyProducts"),
  shopifyId: v.string(),
  shopifyProductId: v.string(),
  sku: v.optional(v.string()),
  barcode: v.optional(v.string()),
  title: v.string(),
  position: v.number(),
  price: v.number(),
  compareAtPrice: v.optional(v.number()),
  inventoryQuantity: v.optional(v.number()),
  inventoryPolicy: v.optional(v.string()),
  inventoryManagement: v.optional(v.string()),
  weight: v.optional(v.number()),
  weightUnit: v.optional(v.string()),
  option1: v.optional(v.string()),
  option2: v.optional(v.string()),
  option3: v.optional(v.string()),
  available: v.optional(v.boolean()),
  cogsPerUnit: v.optional(v.number()),
  inventoryItemId: v.optional(v.string()),
  taxable: v.optional(v.boolean()),
  taxPercent: v.optional(v.number()),
  taxRate: v.optional(v.number()),
  handlingPerUnit: v.optional(v.number()),
  grossMargin: v.optional(v.number()),
  grossProfit: v.optional(v.number()),
  shopifyCreatedAt: v.number(),
  shopifyUpdatedAt: v.number(),
  productName: v.string(),
  productHandle: v.optional(v.string()),
  productVendor: v.optional(v.string()),
  productType: v.optional(v.string()),
  productStatus: v.string(),
  productImage: v.optional(v.string()),
};

const variantPageItem = v.object(variantPageItemFields);

const normalizedSearch = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed.slice(0, 128) : undefined;
};

const variantCostPayload = (
  variant: Doc<"shopifyProductVariants">,
  cost?: Doc<"variantCosts"> | null,
) => {
  const {
    productTitle,
    productHandle,
    productVendor,
    productType,
    productStatus,
    productImage,
    searchText: _searchText,
    ...variantFields
  } = variant;
  const cogsPerUnit = cost?.cogsPerUnit;
  const handlingPerUnit = cost?.handlingPerUnit;
  const taxPercent = cost?.taxPercent;
  const totalCost = (cogsPerUnit ?? 0) + (handlingPerUnit ?? 0);
  const grossProfit = variant.price - totalCost;

  return {
    ...variantFields,
    cogsPerUnit,
    handlingPerUnit,
    taxPercent,
    taxRate: taxPercent,
    grossProfit,
    grossMargin: variant.price > 0 ? (grossProfit / variant.price) * 100 : 0,
    productName: productTitle,
    productHandle,
    productVendor,
    productType,
    productStatus,
    productImage,
  };
};

const variantCostsForPage = async (
  ctx: QueryCtx,
  organizationId: Id<"organizations">,
  variants: Doc<"shopifyProductVariants">[],
) => {
  const costs = await Promise.all(
    variants.map((variant) =>
      ctx.db
        .query("variantCosts")
        .withIndex("by_org_variant", (q) =>
          q.eq("organizationId", organizationId).eq("variantId", variant._id),
        )
        .first(),
    ),
  );

  return new Map(
    variants.map((variant, index) => [variant._id, costs[index] ?? null]),
  );
};

export const getStore = query({
  args: {},
  returns: v.union(v.null(), v.any()),
  handler: async (ctx) => {
    const auth = await getUserAndOrg(ctx);
    if (!auth) return null;
    const orgId = auth.orgId;

    return await ctx.db
      .query("shopifyStores")
      .withIndex("by_organization_and_active", (q) =>
        q.eq("organizationId", orgId).eq("isActive", true),
      )
      .first();
  },
});

export const getProducts = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(
    v.object({
      _id: v.id("shopifyProducts"),
      _creationTime: v.number(),
      organizationId: v.string(),
      storeId: v.id("shopifyStores"),
      shopifyId: v.string(),
      title: v.string(),
      handle: v.optional(v.string()),
      vendor: v.optional(v.string()),
      productType: v.optional(v.string()),
      status: v.optional(v.string()),
      featuredImage: v.optional(v.string()),
      tags: v.optional(v.array(v.string())),
      totalInventory: v.optional(v.number()),
      totalVariants: v.number(),
      shopifyCreatedAt: v.number(),
      shopifyUpdatedAt: v.number(),
      publishedAt: v.optional(v.number()),
      syncedAt: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    const auth = await getUserAndOrg(ctx);
    if (!auth) return [];
    const orgId = auth.orgId;

    return await ctx.db
      .query("shopifyProducts")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .take(args.limit || 100);
  },
});

export const getProductVariantsPaginated = query({
  args: {
    paginationOpts: paginationOptsValidator,
    searchTerm: v.optional(v.string()),
  },
  returns: paginationResultValidator(variantPageItem),
  handler: async (ctx, args) => {
    const auth = await getUserAndOrg(ctx);
    if (!auth) {
      return {
        page: [],
        isDone: true,
        continueCursor: args.paginationOpts.cursor ?? "",
      };
    }

    const orgId = auth.orgId;
    const search = normalizedSearch(args.searchTerm);
    const paginationOpts = {
      ...args.paginationOpts,
      maximumRowsRead: Math.max(args.paginationOpts.numItems + 100, 1_200),
      maximumBytesRead: 4_000_000,
    };

    const result = search
      ? await ctx.db
          .query("shopifyProductVariants")
          .withSearchIndex("search_text", (q) =>
            q.search("searchText", search).eq("organizationId", orgId),
          )
          .paginate(paginationOpts)
      : await ctx.db
          .query("shopifyProductVariants")
          .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
          .order("desc")
          .paginate(paginationOpts);

    const costs = await variantCostsForPage(ctx, orgId, result.page);

    return {
      ...result,
      page: result.page.map((variant) =>
        variantCostPayload(variant, costs.get(variant._id)),
      ),
    };
  },
});

export const getProductVariants = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(v.object(variantPageItemFields)),
  handler: async (ctx, args) => {
    const auth = await getUserAndOrg(ctx);
    if (!auth) return [];
    const orgId = auth.orgId;

    // Get variants
    const variants = await ctx.db
      .query("shopifyProductVariants")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .take(args.limit || 100);

    const costs = await variantCostsForPage(ctx, orgId, variants);
    return variants.map((variant) =>
      variantCostPayload(variant, costs.get(variant._id)),
    );
  },
});

/**
 * Public version of getStoreByDomain for session management
 */
export const getPublicStoreByDomain = query({
  args: {
    shopDomain: v.string(),
    nonce: v.optional(v.string()),
    sig: v.optional(v.string()),
  },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("shopifyStores"),
      organizationId: v.id("organizations"),
      shopDomain: v.string(),
      storeName: v.string(),
      accessToken: v.optional(v.string()),
      scope: v.string(),
      isActive: v.boolean(),
      webhooksRegistered: v.optional(v.boolean()),
    }),
  ),
  handler: async (ctx, args) => {
    // Get the store by shop domain - no auth required for session management
    const domain = normalizeShopDomain(args.shopDomain);
    const store = await findShopifyStoreByDomain(ctx.db, domain);

    if (!store) return null;

    let accessToken: string | undefined;
    if (args.nonce && args.sig) {
      const ok = await verifyShopProvisionSignature(
        domain,
        args.nonce,
        args.sig,
      );
      if (ok) {
        accessToken = store.accessToken;
      }
    }

    return {
      _id: store._id,
      organizationId: store.organizationId as Id<"organizations">,
      shopDomain: store.shopDomain,
      storeName: store.storeName,
      accessToken,
      scope: store.scope || "",
      isActive: store.isActive,
      webhooksRegistered: store.webhooksRegistered,
    };
  },
});

/**
 * Public version of getActiveStoreInternal for session management
 */
export const getPublicActiveStore = query({
  args: { organizationId: v.string() },
  returns: v.union(v.null(), v.any()),
  handler: async (ctx, args) => {
    // Get the active store for the organization - no auth required for session management
    const store = await ctx.db
      .query("shopifyStores")
      .withIndex("by_organization_and_active", (q) =>
        q
          .eq("organizationId", args.organizationId as Id<"organizations">)
          .eq("isActive", true),
      )
      .first();

    return store || null;
  },
});
