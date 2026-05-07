"use client";
import { Button, Chip, Skeleton } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";

import { useInvoices, useDeleteInvoice } from "@/hooks";

const columns = [
  { name: "Invoice", uid: "invoice" },
  { name: "Date", uid: "date" },
  { name: "Amount", uid: "amount" },
  { name: "Status", uid: "status" },
  { name: "Actions", uid: "actions" },
];

const tableShellClass =
  "overflow-hidden rounded-2xl border bg-surface shadow-none";
const headerCellClass =
  "border-b bg-surface-secondary px-3 py-3 text-xs font-medium text-foreground";
const bodyCellClass = "border-b px-3 py-2";

export default function InvoicesList() {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const pageSize = 5;
  const {
    invoices,
    totalCount,
    loading,
    hasMore,
    loadMore,
    loadingMore,
  } = useInvoices(pageSize);
  const deleteInvoice = useDeleteInvoice();

  const handleDelete = async (invoiceId: string) => {
    setDeletingId(invoiceId);
    try {
      await deleteInvoice(invoiceId);
    } finally {
      setDeletingId(null);
    }
  };

  // Format amount for display
  const formatAmount = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">
            Billing History
          </h3>
          <span className="text-xs text-foreground">
            {totalCount > 0 &&
              `${totalCount}${hasMore ? "+" : ""} transaction${
                totalCount !== 1 ? "s" : ""
              }`}
          </span>
        </div>
      </div>

      <div className={tableShellClass}>
        <div className="relative w-full max-w-full overflow-x-auto">
          <table
            aria-label="Billing history table"
            className="w-full min-w-fit border-separate border-spacing-0 text-sm shadow-none"
          >
            <thead className="bg-surface-secondary">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.uid}
                    scope="col"
                    className={
                      column.uid === "invoice"
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
              {loading ? (
                Array.from({ length: 2 }).map((_, index) => (
                  <tr
                    key={`invoice-loading-${index}`}
                    className="[&:last-child>*]:border-b-0"
                  >
                    <th scope="row" className={`${bodyCellClass} text-left`}>
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-24 rounded-full" />
                        <Skeleton className="h-3 w-32 rounded-full" />
                      </div>
                    </th>
                    <td className={bodyCellClass}>
                      <Skeleton className="h-3 w-20 rounded-full" />
                    </td>
                    <td className={bodyCellClass}>
                      <Skeleton className="h-3 w-16 rounded-full" />
                    </td>
                    <td className={bodyCellClass}>
                      <Skeleton className="h-4 w-16 rounded-full" />
                    </td>
                    <td className={bodyCellClass}>
                      <Skeleton className="h-7 w-7 rounded-md" />
                    </td>
                  </tr>
                ))
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="border-b px-3 py-2">
                    <div className="py-10 text-center">
                      <Icon
                        className="mx-auto mb-4 text-foreground"
                        icon="solar:document-text-bold-duotone"
                        width={48}
                      />
                      <p className="text-foreground">No billing history yet</p>
                      <p className="text-sm text-foreground">
                        Transactions will appear here
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                invoices.map((invoice: {
                  id: string;
                  invoiceNumber: string;
                  description: string;
                  issuedAt: number;
                  amount: number;
                  currency: string;
                  status: string;
                }) => (
                  <tr
                    key={invoice.id}
                    className="transition-all duration-200 hover:bg-surface [&:last-child>*]:border-b-0"
                  >
                    <th scope="row" className={`${bodyCellClass} text-left`}>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {invoice.invoiceNumber}
                        </p>
                        <p className="truncate text-xs text-foreground">
                          {invoice.description}
                        </p>
                      </div>
                    </th>
                    <td className={bodyCellClass}>
                      <p className="text-sm text-foreground">
                        {new Date(invoice.issuedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </td>
                    <td className={bodyCellClass}>
                      <p className="text-sm font-medium text-foreground">
                        {formatAmount(invoice.amount, invoice.currency)}
                      </p>
                    </td>
                    <td className={bodyCellClass}>
                      <Chip
                        color={getStatusColor(invoice.status)}
                        size="sm"
                        variant="soft"
                      >
                        {invoice.status.charAt(0).toUpperCase() +
                          invoice.status.slice(1)}
                      </Chip>
                    </td>
                    <td className={bodyCellClass}>
                      <Button
                        isIconOnly
                        isDisabled={deletingId === invoice.id}
                        isPending={deletingId === invoice.id}
                        size="sm"
                        variant="tertiary"
                        onPress={() => handleDelete(invoice.id)}
                      >
                        <Icon
                          icon="solar:trash-bin-trash-bold-duotone"
                          width={16}
                        />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <Button
            className="h-8 text-xs"
            size="sm"
            variant="tertiary"
            isDisabled={loadingMore}
            isPending={loadingMore}
            onPress={() => loadMore()}
          >
            {loadingMore ? "Loading" : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
