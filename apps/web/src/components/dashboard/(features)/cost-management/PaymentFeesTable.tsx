"use client";

import {
  Button,
  Input,
  Modal,
  Skeleton,
  Table,
  toast,
  useOverlayState,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { useCreateTransactionFee, useTransactionFees } from "@/hooks";
import { TableSkeleton } from "@/components/shared/skeletons";

const TableBody = Table.Body;
const TableCell = Table.Cell;
const TableColumn = Table.Column;
const TableHeader = Table.Header;
const TableRow = Table.Row;
import {
  DATA_TABLE_SIMPLE_ROW_STRIPE_CLASS,
  DATA_TABLE_SHELL_CLASS,
  DATA_TABLE_TABLE_CLASS,
} from "@/components/shared/table/DataTableCard";
// Local types to avoid tight coupling to domain Cost
type TransactionCost = {
  _id?: string;
  name?: string;
  description?: string;
  calculation?: string;
  value?: number;
  isActive?: boolean;
  effectiveFrom?: number;
};
// Note: using loose runtime typing from Convex, but state uses TransactionCost

const columns = [
  { name: "Name", uid: "name" },
  { name: "Processing Fee", uid: "fees" },
  { name: "Actions", uid: "actions" },
];

// Simplified: a single provider name and a single percentage fee

type PaymentFormData = Partial<TransactionCost>;

export default function PaymentFeesTable() {
  const [formData, setFormData] = useState<PaymentFormData>({});
  const overlay = useOverlayState();
  const isOpen = overlay.isOpen;
  const onOpen = overlay.open;
  const onOpenChange = overlay.setOpen;
  // Delete disabled: single processing fee only

  const { fees: allTransactionCosts, loading } = useTransactionFees();
  const transactionCosts = (
    allTransactionCosts as TransactionCost[] | undefined
  )?.slice(0, 1);
  const upsertTransactionCost = useCreateTransactionFee();

  const handleEdit = (item: TransactionCost) => {
    setFormData({
      ...item,
      value: item.value ?? 0,
    });
    onOpen();
  };

  const handleAdd = () => {
    setFormData({ name: "Stripe", value: 2.9 });
    onOpen();
  };

  const handleSave = async () => {
    try {
      await upsertTransactionCost({
        name: formData.name || "",
        value: formData.value || 0,
        calculation: "PERCENTAGE",
        description: formData.description,
      });
      toast(formData._id ? "Payment fee updated" : "Payment fee added", {
        timeout: 3000,
      });
      onOpenChange(false);
    } catch (_error) {
      toast.danger("Failed to save", { timeout: 3000 });
    }
  };

  // Delete flow removed in simplified UI

  const renderCell = (item: TransactionCost, columnKey: React.Key) => {
    switch (columnKey) {
      case "name":
        return (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {item.name || "Payment Processor"}
            </p>
            {item.description ? (
              <p className="truncate text-xs text-foreground">
                {item.description}
              </p>
            ) : null}
          </div>
        );

      case "fees": {
        const percentageFee =
          item.calculation?.toLowerCase() === "percentage"
            ? item.value
            : undefined;
        return (
          <span className="font-medium">
            {percentageFee != null ? `${percentageFee}%` : "-"}
          </span>
        );
      }

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
        <h2 className="text-xl font-semibold">Payment Processing Fee</h2>
        {(transactionCosts?.length || 0) === 0 ? (
          <Button variant="primary" isDisabled={loading} onPress={handleAdd}>
            Set Fee
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
          <div className={DATA_TABLE_SHELL_CLASS}>
            <TableSkeleton
              rows={3}
              columns={3}
              showHeader={false}
              showPagination={false}
            />
          </div>
        ) : (
          <Table className={DATA_TABLE_TABLE_CLASS}>
            <Table.ScrollContainer>
              <Table.Content aria-label="Payment fees table">
                <TableHeader columns={columns}>
                  {(column: {
                    uid?: string;
                    name?: string;
                    key?: string;
                    label?: string;
                  }) => (
                    <TableColumn
                      id={column.uid}
                      isRowHeader={column.uid === "name"}
                    >
                      {column.name}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody>
                  {((transactionCosts as TransactionCost[]) || []).length ===
                  0 ? (
                    <TableRow id="empty">
                      <TableCell colSpan={columns.length}>
                        <div className="py-10 text-center">
                          <Icon
                            className="mx-auto mb-4 text-foreground"
                            icon="solar:card-transfer-outline"
                            width={48}
                          />
                          <p className="text-foreground">
                            No payment fees found.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    ((transactionCosts as TransactionCost[]) || []).map(
                      (item) => (
                        <TableRow
                          key={item._id}
                          id={item._id}
                          className={DATA_TABLE_SIMPLE_ROW_STRIPE_CLASS}
                        >
                          {columns.map((column) => (
                            <TableCell key={column.uid}>
                              {renderCell(item, column.uid)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ),
                    )
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
                  <Modal.Header className="">
                    {formData._id ? "Edit Payment Fee" : "Set Payment Fee"}
                  </Modal.Header>
                  <Modal.Body className="gap-6">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        variant="secondary"
                        required
                        value={formData.name || ""}
                        onChange={(event) => {
                          const value = event.currentTarget.value;
                          setFormData({ ...formData, name: value });
                        }}
                      />
                      <Input
                        variant="secondary"
                        required
                        step="0.01"
                        type="number"
                        value={
                          formData.value != null
                            ? formData.value.toString()
                            : ""
                        }
                        onChange={(event) => {
                          const value = event.currentTarget.value;
                          setFormData({
                            ...formData,
                            value: parseFloat(value) || 0,
                          });
                        }}
                      />
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="">
                    <Button variant="tertiary" onPress={close}>
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      isDisabled={
                        !formData.name || !((formData.value ?? 0) > 0)
                      }
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
