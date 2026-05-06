"use client";
import { Button, Chip, Skeleton } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";

import { useInvoices, useDeleteInvoice } from "@/hooks";
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
    <div>
      {/* Compact Header */}
      <div className="px-4 py-3 border-b border-surface-tertiary">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-muted">
            Billing History
          </h3>
          <span className="text-xs text-muted">
            {totalCount > 0 &&
              `${totalCount}${hasMore ? "+" : ""} transaction${
                totalCount !== 1 ? "s" : ""
              }`}
          </span>
        </div>
      </div>

      {/* Compact Table Header */}
      <div className="px-4 py-2 border-b border-surface-tertiary bg-surface">
        <div className="grid grid-cols-12 gap-3 text-xs font-medium text-muted">
          <div className="col-span-3">Invoice</div>
          <div className="col-span-3">Date</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Actions</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-divider">
        {loading ? (
          <div className="space-y-1.5">
            {[0, 1].map((index) => (
              <div
                key={index}
                className={`px-4 py-2.5 ${
                  index % 2 === 0
                    ? "bg-surface/40 dark:bg-surface/10"
                    : "bg-transparent dark:bg-transparent"
                }`}
              >
                <div className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-3 space-y-1">
                    <Skeleton className="h-3 w-24 rounded-full" />
                    <Skeleton className="h-3 w-32 rounded-full" />
                  </div>
                  <div className="col-span-3">
                    <Skeleton className="h-3 w-20 rounded-full" />
                  </div>
                  <div className="col-span-2">
                    <Skeleton className="h-3 w-16 rounded-full" />
                  </div>
                  <div className="col-span-2">
                    <Skeleton className="h-4 w-16 rounded-full" />
                  </div>
                  <div className="col-span-2">
                    <Skeleton className="h-7 w-7 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : invoices.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <Icon
              className="mx-auto mb-2 text-muted"
              icon="solar:document-text-bold-duotone"
              width={32}
            />
            <p className="text-xs text-muted">No billing history yet</p>
            <p className="text-xs text-muted mt-0.5">
              Transactions will appear here
            </p>
          </div>
        ) : (
          invoices.map(
            (
              invoice: {
              id: string;
              invoiceNumber: string;
              description: string;
              issuedAt: number;
              amount: number;
              currency: string;
              status: string;
            },
              index,
            ) => (
              <div
                key={invoice.id}
                className={`px-4 py-2.5 transition-colors ${
                  index % 2 === 0
                    ? "bg-surface/40 dark:bg-surface/10"
                    : "bg-transparent dark:bg-transparent"
                } hover:bg-surface/60 dark:hover:bg-surface/20`}
              >
                <div className="grid grid-cols-12 gap-3 items-center">
                  {/* Invoice ID */}
                  <div className="col-span-3">
                    <p className="text-xs font-semibold text-muted truncate">
                      {invoice.invoiceNumber}
                    </p>
                    <p className="text-xs text-muted truncate">
                      {invoice.description}
                    </p>
                  </div>

                  {/* Date */}
                  <div className="col-span-3">
                    <p className="text-xs text-muted">
                      {new Date(invoice.issuedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="col-span-2">
                    <p className="text-xs font-semibold text-muted">
                      {formatAmount(invoice.amount, invoice.currency)}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <Chip
                      color={getStatusColor(invoice.status)}
                      size="sm"
                                            variant="soft"
                                          >
                      {invoice.status.charAt(0).toUpperCase() +
                        invoice.status.slice(1)}
                    </Chip>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2">
                    <Button
                      size="sm"
                      variant="tertiary"
                     
                      isIconOnly
                      isPending={deletingId === invoice.id}
                      isDisabled={deletingId === invoice.id}
                      onPress={() => handleDelete(invoice.id)}
                    >
                      <Icon icon="solar:trash-bin-trash-bold-duotone" width={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ),
          )
        )}
      </div>

      {/* Compact Footer */}
      {hasMore && (
        <div className="px-4 py-2 border-t border-surface-tertiary">
          <Button
           
           
            size="sm"
            variant="tertiary"
            className="w-full h-7 text-xs"
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
