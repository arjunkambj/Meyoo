"use client";

import { Chip, Skeleton } from "@heroui/react";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { Icon } from "@iconify/react";
import React, { useCallback } from "react";

import { FulfillmentStatusBadge } from "@/components/shared/badges/StatusBadge";
import { useUser } from "@/hooks";
import { formatCurrencyPrecise } from "@/libs/utils/dashboard-formatters";
import type { AnalyticsOrder } from "@repo/types";

interface OrdersTableProps {
  orders: AnalyticsOrder[];
  pagination?: {
    page: number;
    setPage: (page: number) => void;
    total: number;
    pageSize: number;
    estimatedTotal?: number;
  };
  loading?: boolean;
}

const columns = [
  { name: "Order", uid: "order" },
  { name: "Customer Email", uid: "customerEmail" },
  { name: "Fulfillment", uid: "status" },
  { name: "Revenue", uid: "revenue" },
  { name: "Payment", uid: "payment" },
  { name: "Ship To", uid: "location" },
];

const tableShellClass =
  "overflow-hidden rounded-2xl border bg-surface shadow-none";
const headerCellClass =
  "border-b bg-surface-secondary px-3 py-3 text-xs font-medium text-foreground";
const bodyCellClass = "border-b px-3 py-2";
const firstBodyCellClass = "border-b px-3 py-2";

export const OrdersTable = React.memo(function OrdersTable({
  orders,
  pagination,
  loading,
}: OrdersTableProps) {
  const { primaryCurrency } = useUser();

  const renderCell = useCallback(
    (item: AnalyticsOrder, columnKey: React.Key) => {
      const formatCurrency = (value: number) =>
        formatCurrencyPrecise(value, primaryCurrency);

      switch (columnKey) {
        case "order":
          return (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                #{item.orderNumber}
              </p>
              {item.tags && item.tags.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.tags.map((tag) => (
                    <Chip key={tag} color="default" size="sm">
                      {tag}
                    </Chip>
                  ))}
                </div>
              ) : null}
            </div>
          );

        case "customerEmail": {
          const email =
            typeof item.customer.email === "string" &&
            item.customer.email.trim().length > 0
              ? item.customer.email
              : "Guest Checkout";
          return (
            <div className="min-w-0 truncate text-sm text-foreground">
              {email}
            </div>
          );
        }

        case "status":
          return (
            <FulfillmentStatusBadge
              size="sm"
              status={item.fulfillmentStatus || "unfulfilled"}
              variant="primary"
            />
          );

        case "revenue":
          return (
            <div>
              <p className="font-medium">{formatCurrency(item.totalPrice)}</p>
              <p className="text-xs text-foreground">{item.items} items</p>
            </div>
          );

        case "payment":
          return (
            <Chip
              color={
                item.financialStatus === "paid"
                  ? "success"
                  : item.financialStatus === "pending"
                    ? "warning"
                    : "default"
              }
              size="sm"
              variant="soft"
            >
              {item.financialStatus === "paid"
                ? "Paid"
                : item.financialStatus === "pending"
                  ? "COD"
                  : item.financialStatus}
            </Chip>
          );

        case "location":
          return (
            <div className="text-sm">
              <p>{item.shippingAddress.city}</p>
              <p className="text-xs text-foreground">
                {item.shippingAddress.country}
              </p>
            </div>
          );

        default:
          return null;
      }
    },
    [primaryCurrency],
  );

  const paginationNode =
    !loading && pagination && orders.length > 0 ? (
      <div className="flex justify-center py-3">
        <PaginationControls
          page={pagination.page}
          size="sm"
          total={Math.max(
            1,
            Math.ceil(
              (pagination.estimatedTotal ?? pagination.total) /
                Math.max(1, pagination.pageSize),
            ),
          )}
          onChange={pagination.setPage}
        />
      </div>
    ) : null;

  return (
    <div className="space-y-4">
      {loading ? (
        <div className={tableShellClass}>
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={`orders-loading-${index}`}
                className="h-8 w-full rounded-lg"
              />
            ))}
          </div>
        </div>
      ) : (
        <div className={tableShellClass}>
          <div className="relative w-full max-w-full overflow-x-auto">
            <table
              aria-label="Orders table"
              className="w-full min-w-fit border-separate border-spacing-0 text-sm shadow-none"
            >
              <thead className="bg-surface-secondary">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.uid}
                      scope="col"
                      className={
                        column.uid === "order"
                          ? `${headerCellClass} text-left`
                          : `${headerCellClass} border-l text-left`
                      }
                    >
                      {column.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="border-b px-3 py-2">
                      <div className="py-10 text-center">
                        <Icon
                          className="mx-auto mb-4 text-foreground"
                          icon="solar:cart-large-minimalistic-outline"
                          width={48}
                        />
                        <p className="text-foreground">
                          No orders found. Orders will sync from Shopify.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  orders.map((item) => {
                    return (
                      <tr
                        key={item.id}
                        className="transition-all duration-200 hover:bg-surface [&:last-child>*]:border-b-0"
                      >
                        {columns.map((column) => {
                          const isRowHeader = column.uid === "order";
                          const Cell = isRowHeader ? "th" : "td";

                          return (
                            <Cell
                              key={column.uid}
                              scope={isRowHeader ? "row" : undefined}
                              className={
                                isRowHeader
                                  ? `${firstBodyCellClass} text-left`
                                  : bodyCellClass
                              }
                            >
                              {renderCell(item, column.uid)}
                            </Cell>
                          );
                        })}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {paginationNode}
    </div>
  );
});
