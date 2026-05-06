"use client";

import { Button, Input, Modal, Skeleton, Table, toast, useOverlayState } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";
// Delete flow removed; only edit/set single shipping cost
import type { GenericId as Id } from "convex/values";
import {
  useShippingCosts,
  useCreateShippingCost,
  useUpdateExpense,
} from "@/hooks";
import { useUserContext } from "@/contexts/UserContext";
import { getCurrencySymbol } from "@/libs/utils/format";
import { TableSkeleton } from "@/components/shared/skeletons";

const TableBody = Table.Body;
const TableCell = Table.Cell;
const TableColumn = Table.Column;
const TableHeader = Table.Header;
const TableRow = Table.Row;
import {
  DATA_TABLE_SIMPLE_ROW_STRIPE_CLASS,
  DATA_TABLE_TABLE_CLASS,
} from "@/components/shared/table/DataTableCard";

const columns = [
  { name: "Shipping Method", uid: "name" },
  { name: "Actions", uid: "actions" },
];

// Simplified: single flat shipping amount

interface ShippingFormData {
  _id?: Id<"globalCosts">;
  name?: string;
  baseRate?: number;
}

interface ShippingCostItem {
  _id: Id<"globalCosts">;
  name: string;
  type: "shipping";
  baseRate?: number;
  value?: number;
}

export default function ShippingCostTable() {
  const [formData, setFormData] = useState<ShippingFormData>({});
  const overlay = useOverlayState();
  const isOpen = overlay.isOpen;
  const onOpen = overlay.open;
  const onOpenChange = overlay.setOpen;

  const { primaryCurrency } = useUserContext();
  const currency = primaryCurrency;
  const { shippingCosts: allShippingCosts, loading } = useShippingCosts();
  const baseCosts = (allShippingCosts || []) as ShippingCostItem[];
  const shippingCosts: ShippingCostItem[] = baseCosts.slice(0, 1);
  const createShippingCost = useCreateShippingCost();
  const updateExpense = useUpdateExpense();

  const handleEdit = (item: ShippingCostItem) => {
    setFormData({
      _id: item._id,
      name: item.name,
      baseRate: typeof item.value === "number" ? item.value : item.baseRate,
    });
    onOpen();
  };

  const handleAdd = () => {
    setFormData({
      name: "",
      baseRate: 0,
    });
    onOpen();
  };

  const handleSave = async () => {
    try {
      if (formData._id) {
        // Update existing shipping cost
        await updateExpense({
          costId: formData._id,
          name: formData.name || "Shipping",
          value: formData.baseRate || 0,
        });
      } else {
        // Create new shipping cost (or update first one if it exists)
        const existingCost = baseCosts[0];
        if (existingCost) {
          await updateExpense({
            costId: existingCost._id,
            name: formData.name || "Shipping",
            value: formData.baseRate || 0,
          });
        } else {
          await createShippingCost({
            name: formData.name || "Shipping",
            value: formData.baseRate || 0,
            calculation: "FIXED",
          });
        }
      }
      toast(formData._id ? "Shipping rate updated" : "Shipping rate set", { timeout: 3000 });
      onOpenChange(false);
    } catch (_error) {
      toast.danger("Failed to save", { timeout: 3000 });
    }
  };

  // Weight tiers and delete flow removed for simplified single-price shipping

  const renderCell = (item: ShippingCostItem, columnKey: React.Key) => {
    switch (columnKey) {
      case "name":
        return (
          <div className="flex flex-col">
            <span className="font-medium">{item.name}</span>
            <span className="text-xs text-muted">
              {typeof item.value === "number"
                ? `Rate: ${getCurrencySymbol(currency)}${item.value.toFixed(2)}`
                : typeof item.baseRate === "number"
                  ? `Rate: ${getCurrencySymbol(currency)}${item.baseRate.toFixed(2)}`
                  : "No rate set"}
            </span>
          </div>
        );

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
          </div>
        );

      default:
        return null;
    }
  };

  const topContent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Shipping Rates</h2>
        {shippingCosts.length === 0 ? (
          <Button variant="primary"
           
           
            isDisabled={loading}
            onPress={handleAdd}
          >
            Set Shipping Rate
          </Button>
        ) : null}
      </div>
      {loading ? <Skeleton className="h-10 w-64 rounded-lg" /> : null}
    </div>
  );

  return (
    <>
      <div className="space-y-4">
        {topContent}
        {loading ? (
          <div className={DATA_TABLE_TABLE_CLASS}>
            <TableSkeleton
              rows={3}
              columns={2}
              showHeader={false}
              showPagination={false}
              className="border border-surface-tertiary/60"
            />
          </div>
        ) : (
          <Table className={DATA_TABLE_TABLE_CLASS}>
            <Table.ScrollContainer>
              <Table.Content aria-label="Shipping costs table">
                <TableHeader columns={columns}>
                  {(column: { uid?: string; name?: string; key?: string; label?: string }) => (
                    <TableColumn id={column.uid} isRowHeader={column.uid === "name"}>
                      {column.name}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody items={shippingCosts || []}>
                  {(item: ShippingCostItem) => (
                    <TableRow
                      key={item._id}
                      id={item._id}
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
          <Modal.Container size="lg">
            <Modal.Dialog>
          {({ close }) => (
            <>
              <Modal.Header className="dark:bg-surface-secondary mb-3">
                {formData._id ? "Edit Shipping Rate" : "Set Shipping Rate"}
              </Modal.Header>
              <Modal.Body className="dark:bg-surface-secondary gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    required
                                                            value={formData.name || ""}
                    onChange={(event) => { const value = event.currentTarget.value;
                      setFormData({ ...formData, name: value })
                    }}
                  />
                  <Input
                    required
                                                                                type="number"
                    value={formData.baseRate?.toString() || ""}
                    onChange={(event) => { const value = event.currentTarget.value;
                      setFormData({
                        ...formData,
                        baseRate: parseFloat(value) || 0,
                      })
                    }}
                  />
                </div>
              </Modal.Body>
              <Modal.Footer className="dark:bg-surface-secondary">
                <Button variant="tertiary" onPress={close}>
                  Cancel
                </Button>
                <Button variant="primary"
                 
                  isDisabled={!formData.name}
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
    </>
  );
}
