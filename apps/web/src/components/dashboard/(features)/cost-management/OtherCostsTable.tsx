"use client";

import { Button, Calendar, Chip, Input, ListBox, Modal, Popover, Select, Skeleton, Table, toast, useOverlayState } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import type { GenericId as Id } from "convex/values";
import {
  useCreateExpense,
  useDeleteExpense as useDeleteOtherCost,
  useExpenses as useOtherCosts,
  useUpdateExpense,
} from "@/hooks";
import { useUserContext } from "@/contexts/UserContext";
import { createLogger } from "@/libs/logging";
import { getCurrencySymbol } from "@/libs/utils/format";
import { TableSkeleton } from "@/components/shared/skeletons";
import {
  DATA_TABLE_SIMPLE_ROW_STRIPE_CLASS,
  DATA_TABLE_TABLE_CLASS,
} from "@/components/shared/table/DataTableCard";
import {
  getLocalTimeZone,
  parseDate,
  today,
  type CalendarDate,
} from "@internationalized/date";

const logger = createLogger("OtherCostsTable");

const TableBody = Table.Body;
const TableCell = Table.Cell;
const TableColumn = Table.Column;
const TableHeader = Table.Header;
const TableRow = Table.Row;

// Type definitions based on the costs schema
interface Cost {
  _id: Id<"globalCosts">;
  organizationId: string;
  userId: Id<"users">;
  type: "shipping" | "payment" | "operational";
  name: string;
  description?: string;
  calculation:
    | "fixed"
    | "percentage"
    | "per_unit"
    | "tiered"
    | "weight_based"
    | "formula";
  value: number;
  frequency?:
    | "one_time"
    | "per_order"
    | "per_item"
    | "daily"
    | "weekly"
    | "monthly"
    | "quarterly"
    | "yearly"
    | "percentage";
  isActive: boolean;
  isDefault: boolean;
  effectiveFrom: number;
  effectiveTo?: number;
  createdAt?: number;
  updatedAt?: number;
  // Additional UI-specific properties
  expenseType?: string;
  amount?: number;
  paymentStatus?: "paid" | "pending" | "overdue";
  status?: string;
}

interface FormData {
  _id?: Id<"globalCosts">;
  name: string;
  // description, category, expenseType removed from UI
  amount: number;
  value?: number;
  frequency: CostFrequency;
  effectiveFrom?: string;
  effectiveTo?: string;
  paymentStatus?: "paid" | "pending" | "overdue";
  vendorName?: string;
  isActive?: boolean;
}
const columns = [
  { name: "Name", uid: "name" },
  { name: "Amount", uid: "amount" },
  { name: "Frequency", uid: "frequency" },
  { name: "Actions", uid: "actions" },
];

type CostFrequency = NonNullable<Cost["frequency"]>;
type CostFrequencyKey =
  | "ONE_TIME"
  | "PER_ORDER"
  | "PER_ITEM"
  | "DAILY"
  | "WEEKLY"
  | "MONTHLY"
  | "QUARTERLY"
  | "YEARLY"
  | "PERCENTAGE";

// Expense types removed from UI

const frequencies: Array<{ key: CostFrequency; label: string }> = [
  { key: "monthly", label: "Monthly" },
  { key: "weekly", label: "Weekly" },
  { key: "one_time", label: "One Time" },
];

const FREQUENCY_VALUE_TO_KEY: Record<CostFrequency, CostFrequencyKey> = {
  one_time: "ONE_TIME",
  per_order: "PER_ORDER",
  per_item: "PER_ITEM",
  daily: "DAILY",
  weekly: "WEEKLY",
  monthly: "MONTHLY",
  quarterly: "QUARTERLY",
  yearly: "YEARLY",
  percentage: "PERCENTAGE",
};

// Payment status options removed from Other Expenses

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const calendarDateToString = (date: CalendarDate): string => {
  return `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
};

const getEffectiveFromCalendarValue = (value?: string): CalendarDate => {
  if (value) {
    try {
      return parseDate(value);
    } catch {
      // fall through to today
    }
  }

  return today(getLocalTimeZone());
};

const formatEffectiveFromLabel = (value?: string): string => {
  if (!value) {
    return "Select date";
  }

  const jsDate = new Date(value);

  if (Number.isNaN(jsDate.getTime())) {
    return value;
  }

  return dateFormatter.format(jsDate);
};

export default function OtherCostsTable() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    amount: 0,
    frequency: "monthly",
  });
  const overlay = useOverlayState();
  const isOpen = overlay.isOpen;
  const onOpen = overlay.open;
  const onOpenChange = overlay.setOpen;
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEffectiveFromOpen, setIsEffectiveFromOpen] = useState(false);

  const { primaryCurrency } = useUserContext();
  const currency = primaryCurrency;
  const { expenses: allOtherCosts, loading: expensesLoading } = useOtherCosts();
  const otherCosts = allOtherCosts as Cost[] | undefined;
  const addCompleteExpense = useCreateExpense();
  const deleteOtherCost = useDeleteOtherCost();
  const updateExpense = useUpdateExpense();
  const isLoading = Boolean(expensesLoading);

  // Categories are not used in this simplified UI

  const handleEdit = (item: Cost) => {
    setFormData({
      _id: item._id,
      name: item.name,
      amount: item.value || 0,
      value: item.value,
      frequency: item.frequency || "monthly",
      effectiveFrom: item.effectiveFrom
        ? new Date(item.effectiveFrom).toISOString().split("T")[0]
        : undefined,
      effectiveTo: item.effectiveTo
        ? new Date(item.effectiveTo).toISOString().split("T")[0]
        : undefined,
      isActive: typeof item.isActive === "boolean" ? item.isActive : true,
    });
    onOpen();
  };

  const handleAdd = async () => {
    setFormData({
      name: "",
      amount: 0,
      frequency: "monthly",
      effectiveFrom: new Date().toISOString().split("T")[0],
      isActive: true,
    });
    onOpen();
  };

  const handleSave = async () => {
    try {
      if (formData._id) {
        // Update existing expense
        const frequencyKey = formData.frequency
          ? FREQUENCY_VALUE_TO_KEY[formData.frequency]
          : undefined;
        const result = await updateExpense({
          costId: formData._id,
          name: formData.name,
          value:
            typeof formData.amount === "number"
              ? formData.amount
              : formData.value || 0,
          frequency: frequencyKey,
          isActive: formData.isActive,
        });

        if (result.success) {
          toast("Operating cost updated", { timeout: 3000 });
          onOpenChange(false);
        } else {
          toast.danger("Failed to update cost", { description: result.error || "Please try again", timeout: 5000 });
        }
      } else {
        // For new expense, use addCompleteExpense
        const newFrequency = FREQUENCY_VALUE_TO_KEY[formData.frequency];
        await addCompleteExpense({
          type: "OPERATIONAL",
          name: formData.name,
          value: formData.amount,
          calculation: "FIXED",
          effectiveFrom: formData.effectiveFrom
            ? new Date(formData.effectiveFrom).toISOString()
            : new Date().toISOString(),
          frequency: newFrequency,
        });
        toast("Operating cost added successfully", { timeout: 3000 });
        onOpenChange(false);
      }
    } catch (_error) {
      logger.error("Error saving expense:", _error);
      toast.danger("Failed to save cost", { description: _error instanceof Error ? _error.message : "Unknown error", timeout: 5000 });
    }
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      await deleteOtherCost(itemToDelete as Id<"globalCosts">);
      toast("Operating cost deleted", { timeout: 3000 });
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (_error) {
      toast.danger("Failed to delete", { timeout: 3000 });
    } finally {
      setIsDeleting(false);
    }
  };

  const effectiveFromCalendarValue = useMemo(
    () => getEffectiveFromCalendarValue(formData.effectiveFrom),
    [formData.effectiveFrom]
  );

  const renderCell = (item: Cost, columnKey: React.Key) => {
    switch (columnKey) {
      case "name":
        return <p className="font-medium">{item.name}</p>;

      // expenseType column removed

      case "amount":
        return (
          <span>
            {getCurrencySymbol(currency)}
            {(item.value || 0).toFixed(2)}
          </span>
        );

      case "frequency": {
        const effectiveFreq = item.frequency || "monthly";
        const freq =
          frequencies.find((f) => f.key === effectiveFreq) ||
          frequencies.find((f) => f.key === "monthly");

        return (
          <Chip size="sm" variant="soft">
            {freq?.label || "Monthly"}
          </Chip>
        );
      }

      // status column removed

      case "actions":
        return (
          <div className="flex gap-2">
            <Button
              isIconOnly
              size="sm"
              variant="tertiary"
              onPress={() => handleEdit(item)}
            >
              <Icon icon="solar:pen-linear" width={16} />
            </Button>
            <Button
              isIconOnly
             
              size="sm"
              variant="tertiary"
              onPress={() => handleDeleteClick(item._id as string)}
            >
              <Icon icon="solar:trash-bin-trash-bold-duotone" width={16} />
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  const topContent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Operating Costs</h2>
        <Button variant="primary"
         
         
          isDisabled={isLoading}
          onPress={handleAdd}
        >
          Add Operating Cost
        </Button>
      </div>
      {isLoading ? <Skeleton className="h-10 w-64 rounded-lg" /> : null}
    </div>
  );

  return (
    <>
      <div className="space-y-4">
        {topContent}
        {isLoading ? (
          <div className={DATA_TABLE_TABLE_CLASS}>
            <TableSkeleton
              rows={6}
              columns={4}
              showHeader={false}
              showPagination={false}
              className="border border-surface-tertiary/60"
            />
          </div>
        ) : (
          <Table className={DATA_TABLE_TABLE_CLASS}>
            <Table.ScrollContainer>
              <Table.Content aria-label="Operating costs table">
                <TableHeader columns={columns}>
                  {(column: { uid?: string; name?: string; key?: string; label?: string }) => (
                    <TableColumn id={column.uid} isRowHeader={column.uid === "name"}>
                      {column.name}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody items={(otherCosts || []) as Cost[]}>
                  {(item: Cost) => (
                    <TableRow
                      key={item._id as string}
                      id={item._id as string}
                      className={DATA_TABLE_SIMPLE_ROW_STRIPE_CLASS}
                    >
                      {(columnKey: unknown) => (
                        <TableCell>{renderCell(item, String(columnKey))}</TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        )}
      </div>

      <Modal>
        <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
          <Modal.Container scroll="inside" size="lg">
            <Modal.Dialog>
          {({ close }) => (
            <>
              <Modal.Header className="flex flex-col dark:bg-surface-secondary gap-1 border-b border-surface-tertiary pb-3">
                <h2 className="text-lg font-semibold">
                  {formData._id ? "Edit Operating Cost" : "Add Operating Cost"}
                </h2>
                <p className="text-sm text-muted">
                  Track operational costs for better P&L visibility
                </p>
              </Modal.Header>
              <Modal.Body className="bg-surface-secondary gap-6 py-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    required
                                                            placeholder="e.g., Office Rent, Software Subscription"
                    value={formData.name || ""}
                    onChange={(event) => { const value = event.currentTarget.value;
                      setFormData({ ...formData, name: value })
                    }}
                  />
                </div>

                {/* Amount + Frequency/Apply To aligned in one row */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    required
                                                                                step="0.01"
                    type="number"
                    value={formData.amount.toString()}
                    onChange={(event) => { const value = event.currentTarget.value;
                      setFormData({
                        ...formData,
                        amount: parseFloat(value) || 0,
                      })
                    }}
                  />

                  <Select
                    value={formData.frequency}
                    onChange={(key) => {
                      const nextFrequency = key as CostFrequency | null;
                      if (!nextFrequency) return;
                      setFormData((prev) => ({
                        ...prev,
                        frequency: nextFrequency,
                      }));
                    }}
                  >
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {frequencies.map((freq) => (
                          <ListBox.Item
                            key={freq.key}
                            id={freq.key}
                            textValue={freq.label}
                          >
                            {freq.label}
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-muted">
                      Effective From
                    </span>
                    <Popover
                      isOpen={isEffectiveFromOpen}
                      onOpenChange={setIsEffectiveFromOpen}
                    >
                      <Button
                        className="w-full justify-between text-left"
                        variant="outline"
                      >
                        <span className="flex items-center gap-2">
                          <Icon icon="solar:calendar-linear" width={16} />
                          {formatEffectiveFromLabel(formData.effectiveFrom)}
                        </span>
                        <Icon icon="solar:alt-arrow-down-bold" width={14} />
                      </Button>
                      <Popover.Content>
                        <Popover.Dialog className="p-2">
                        <Calendar                           className="w-full"
                          value={effectiveFromCalendarValue}
                          onChange={(date: CalendarDate | null) => {
                            if (!date) return;
                            setFormData((prev) => ({
                              ...prev,
                              effectiveFrom: calendarDateToString(date),
                            }));
                            setIsEffectiveFromOpen(false);
                          }}
                        />
                        </Popover.Dialog>
                      </Popover.Content>
                    </Popover>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer className="dark:bg-surface-secondary">
                <Button variant="tertiary" onPress={close}>
                  Cancel
                </Button>
                <Button variant="primary"
                 
                  isDisabled={!formData.name || !formData.amount}
                  onPress={handleSave}
                >
                  {formData._id ? "Update" : "Add"}
                </Button>
              </Modal.Footer>
            </>
          )}
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        cancelText="Cancel"
        confirmColor="danger"
        confirmText="Delete"
        icon="solar:trash-bin-bold-duotone"
        iconColor="text-danger"
        isLoading={isDeleting}
        isOpen={deleteModalOpen}
        message="Are you sure you want to delete this operating cost? This action cannot be undone."
        title="Delete Operating Cost"
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
