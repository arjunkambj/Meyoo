"use client";

import { Avatar, Button, Chip, Skeleton, Table, toast, Tooltip } from "@heroui/react";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { Icon } from "@iconify/react";
import React, { useCallback, useState } from "react";
import { useUser } from "@/hooks";
import { getStockStatusConfig } from "@/libs/utils/dashboard-formatters";
import { getCurrencySymbol, formatNumber } from "@/libs/utils/format";
import {
  DATA_TABLE_GROUP_ROW_BORDER_CLASS,
  DATA_TABLE_ROW_BASE_BG,
  DATA_TABLE_ROW_STRIPE_BG,
  DATA_TABLE_ROW_STRIPE_CHILD_BG,
  DATA_TABLE_TABLE_CLASS,
} from "@/components/shared/table/DataTableCard";
import { cn } from "@/libs/utils";

const TableBody = Table.Body;
const TableCell = Table.Cell;
const TableColumn = Table.Column;
const TableHeader = Table.Header;
const TableRow = Table.Row;

export interface ProductVariant {
  id: string;
  sku: string;
  title: string;
  price: number;
  stock: number;
  available: number;
  unitsSold?: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  image?: string;
  category: string;
  vendor: string;
  stock: number;
  available: number;
  reorderPoint: number;
  stockStatus: "healthy" | "low" | "critical" | "out";
  price: number;
  cost: number;
  margin: number;
  unitsSold?: number;
  lastSold?: string;
  variants?: ProductVariant[];
  variantCount?: number;
  abcCategory: "A" | "B" | "C";
}

const formatVariantLabel = (product: Product): string => {
  const variantCount =
    typeof product.variantCount === "number"
      ? product.variantCount
      : Array.isArray(product.variants) && product.variants.length > 0
        ? product.variants.length
        : 1;

  return `${variantCount} variant${variantCount === 1 ? "" : "s"}`;
};

interface ProductsTableProps {
  products: Product[];
  loading?: boolean;
  pagination?: {
    page: number;
    setPage: (page: number) => void;
    total: number;
    pageSize?: number;
    totalPages?: number;
  };
}

const columns = [
  { name: "Product", uid: "product" },
  { name: "Category", uid: "category" },
  { name: "Stock", uid: "stock" },
  { name: "Status", uid: "status" },
  { name: "Price", uid: "price" },
  { name: "COGS", uid: "cogs" },
  { name: "Margin", uid: "margin" },
  { name: "Units Sold", uid: "unitsSold" },
  { name: "Actions", uid: "actions" },
];

export const ProductsTable = React.memo(function ProductsTable({
  products,
  loading,
  pagination,
}: ProductsTableProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const { primaryCurrency } = useUser();
  const currencySymbol = getCurrencySymbol(primaryCurrency);

  const renderCell = useCallback(
    (item: Product, columnKey: React.Key) => {
      switch (columnKey) {
        case "product": {
          const variantLabel = formatVariantLabel(item);
          return (
            <div className="flex items-center gap-3">
              <Avatar size="sm">
                <Avatar.Image src={item.image} />
                <Avatar.Fallback>{item.name.substring(0, 2).toUpperCase()}</Avatar.Fallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs text-muted">{variantLabel}</p>
              </div>
            </div>
          );
        }

        case "category":
          return <span className="text-sm">{item.category}</span>;

        case "stock":
          return <p className="text-sm font-medium">{item.available}</p>;

        case "status": {
          const statusConfig = getStockStatusConfig(item.stockStatus);

          return (
            <Chip color={statusConfig.color} size="sm" variant="soft">
              {statusConfig.label}
            </Chip>
          );
        }

        case "price":
          return (
            <p className="text-sm font-medium">
              {currencySymbol}
              {item.price.toFixed(2)}
            </p>
          );

        case "cogs":
          return (
            <div>
              <p className="text-sm font-medium">
                {currencySymbol}
                {item.cost.toFixed(2)}
              </p>
              <p className="text-xs text-muted">
                Total: {currencySymbol}
                {(item.cost * item.stock).toFixed(2)}
              </p>
            </div>
          );

        case "margin":
          return (
            <Chip
              color={
                item.margin > 30
                  ? "success"
                  : item.margin > 15
                    ? "warning"
                    : "danger"
              }
              size="sm"
            >
              {item.margin.toFixed(1)}%
            </Chip>
          );

        case "unitsSold":
          return (
            <div className="text-sm font-medium">
              {formatNumber(item.unitsSold ?? 0)}
            </div>
          );

        case "actions":
          return (
            <div className="flex items-center gap-1">
              <Tooltip>
                <Tooltip.Trigger>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="tertiary"
                    onPress={() => {
                      toast.info("Working on this feature", { description: "Stock ordering will be available soon", timeout: 3000 });
                    }}
                  >
                    <Icon icon="solar:cart-large-2-bold-duotone" width={16} />
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Content>Order Stock</Tooltip.Content>
              </Tooltip>
            </div>
          );

        default:
          return null;
      }
    },
    [currencySymbol]
  );

  const paginationContent =
    !loading && pagination && products.length > 0 ? (
      <div className="flex justify-center pt-2">
        <PaginationControls
          page={pagination.page}
          size="sm"
          total={
            pagination.totalPages ??
            Math.max(
              pagination.page,
              Math.max(
                1,
                Math.ceil(
                  Math.max(pagination.total, 0) /
                    Math.max(pagination.pageSize ?? 50, 1)
                )
              )
            )
          }
          onChange={pagination.setPage}
        />
      </div>
    ) : null;

  return (
    <div className="space-y-4">
      {loading ? (
        <div className={DATA_TABLE_TABLE_CLASS}>
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={`inventory-loading-${index}`}
                className="h-8 w-full rounded-lg"
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          <Table className={DATA_TABLE_TABLE_CLASS}>
            <Table.ScrollContainer>
              <Table.Content aria-label="Products table">
                <TableHeader columns={columns}>
                  {(column: { uid?: string; name?: string; key?: string; label?: string }) => (
                    <TableColumn id={column.uid} isRowHeader={column.uid === "product"}>
                      {column.name}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody>
              {products.length === 0 ? (
                <TableRow id="empty">
                  <TableCell colSpan={columns.length}>
                    <div className="py-10 text-center">
                      <Icon
                        className="mx-auto mb-4 text-muted"
                        icon="solar:box-outline"
                        width={48}
                      />
                      <p className="text-muted">
                        No products found. Products will sync from Shopify.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                products.flatMap((item, idx) => {
                  const isOpen = expanded.has(item.id);
                  const stripe = idx % 2 === 1;
                  const avgPrice =
                    Array.isArray(item.variants) && item.variants.length > 0
                      ? item.variants.reduce(
                          (sum, v) => sum + (Number(v.price ?? 0) || 0),
                          0
                        ) / item.variants.length
                      : item.price;

                  const header = (
                    <TableRow
                      key={`p-h-${item.id}`}
                      id={`p-h-${item.id}`}
                      className={cn(
                        stripe
                          ? DATA_TABLE_ROW_STRIPE_BG
                          : DATA_TABLE_ROW_BASE_BG,
                        DATA_TABLE_GROUP_ROW_BORDER_CLASS
                      )}
                    >
                      <TableCell>
                        <div className="min-w-0 flex items-center gap-3 py-1">
                          <button
                            type="button"
                            className="flex-none text-muted transition hover:text-muted"
                            onClick={() => {
                              setExpanded((prev) => {
                                const next = new Set(prev);
                                if (next.has(item.id)) next.delete(item.id);
                                else next.add(item.id);
                                return next;
                              });
                            }}                           >
                            <Icon
                              icon={
                                isOpen
                                  ? "solar:alt-arrow-up-bold"
                                  : "solar:alt-arrow-down-bold"
                              }
                              width={18}
                            />
                          </button>
                          <Avatar size="sm" className="flex-none rounded-md">
                            <Avatar.Image src={item.image} />
                            <Avatar.Fallback>{item.name.substring(0, 2).toUpperCase()}</Avatar.Fallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-muted">
                              {item.name}
                            </p>
                            <p className="truncate text-xs text-muted">
                              {formatVariantLabel(item)}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{item.category}</span>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium">{item.available}</p>
                      </TableCell>
                      <TableCell>{renderCell(item, "status")}</TableCell>
                      <TableCell>
                        <p className="text-sm font-medium">
                          {currencySymbol}
                          {avgPrice.toFixed(2)}
                        </p>
                      </TableCell>
                      <TableCell>{renderCell(item, "cogs")}</TableCell>
                      <TableCell>{renderCell(item, "margin")}</TableCell>
                      <TableCell>{renderCell(item, "unitsSold")}</TableCell>
                      <TableCell>{renderCell(item, "actions")}</TableCell>
                    </TableRow>
                  );

                  if (!isOpen || !item.variants || item.variants.length === 0) {
                    return [header];
                  }

                  const children = item.variants.map((v) => (
                    <TableRow
                      key={`v-${v.id}`}
                      id={`v-${v.id}`}
                      className={cn(
                        "pointer-events-none",
                        DATA_TABLE_ROW_BASE_BG,
                        stripe && DATA_TABLE_ROW_STRIPE_CHILD_BG
                      )}
                    >
                      <TableCell>
                        <div className="min-w-0">
                          <div className="truncate text-sm text-muted">
                            {v.title || "Variant"}
                          </div>
                          <div className="truncate text-xs text-muted">
                            {v.sku || ""}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted">
                          {item.category}
                        </span>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium">{v.available}</p>
                      </TableCell>
                      <TableCell>{renderCell(item, "status")}</TableCell>
                      <TableCell>
                        <p className="text-sm font-medium">
                          {currencySymbol}
                          {Number(v.price || 0).toFixed(2)}
                        </p>
                      </TableCell>
                      <TableCell>—</TableCell>
                      <TableCell>—</TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">
                          {formatNumber(v.unitsSold ?? 0)}
                        </div>
                      </TableCell>
                      <TableCell>—</TableCell>
                    </TableRow>
                  ));

                  return [header, ...children];
                })
              )}
                </TableBody>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
          {paginationContent}
        </>
      )}
    </div>
  );
});
