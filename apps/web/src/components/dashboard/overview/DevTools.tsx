"use client";

import { Button, Chip, Input, Modal, Radio, RadioGroup, useOverlayState } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { useDevTools, useIntegrationStatus, useIsOnboarded, useUser } from "@/hooks";

import { ConfirmationDialog } from "./ConfimationDialog";

export function DevTools() {
  const router = useRouter();
  const {
    resetEverything,
    disconnectShopify,
    disconnectMeta,
    recalculateAnalytics: recalcAnalytics,
    deleteAnalyticsMetrics: deleteAnalytics,
    isLoading: globalLoading,
    error,
  } = useDevTools();

  const [buttonLoading, setButtonLoading] = useState<Record<string, boolean>>({});
  const [recalcMessage, setRecalcMessage] = useState<string | null>(null);
  const [recalcError, setRecalcError] = useState<string | null>(null);
  const [deleteMetricsMessage, setDeleteMetricsMessage] = useState<string | null>(null);
  const [deleteMetricsError, setDeleteMetricsError] = useState<string | null>(null);
  const { user } = useUser();
  const { hasShopify, hasMeta } = useIntegrationStatus();
  const isOnboarded = useIsOnboarded();

  const recalcOverlay = useOverlayState();
  const isRecalcOpen = recalcOverlay.isOpen;
  const openRecalc = recalcOverlay.open;
  const closeRecalc = recalcOverlay.close;
  const onRecalcOpenChange = recalcOverlay.setOpen;
  const [range, setRange] = useState<"all" | "60" | "30" | "custom">("60");
  const [customDays, setCustomDays] = useState("60");
  const resolvedDaysBack = useMemo(() => {
    switch (range) {
      case "all":
        return 3650;
      case "60":
        return 60;
      case "30":
        return 30;
      case "custom": {
        const parsed = Number(customDays);
        if (!Number.isFinite(parsed) || parsed <= 0) {
          return 1;
        }
        return Math.floor(parsed);
      }
      default:
        return 60;
    }
  }, [range, customDays]);

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    action: () => void;
    title: string;
    description: string;
  }>({
    isOpen: false,
    action: () => {},
    title: "",
    description: "",
  });

  const handleRecalcConfirm = async () => {
    setButtonLoading((prev) => ({ ...prev, ["recalc-analytics"]: true }));
    setRecalcMessage(null);
    setRecalcError(null);
    try {
      const result = await recalcAnalytics(resolvedDaysBack);
      setRecalcMessage(result.message ?? `Rebuilt ${result.updated} daily metrics.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to recalculate analytics";
      setRecalcError(msg);
    } finally {
      setButtonLoading((prev) => ({ ...prev, ["recalc-analytics"]: false }));
      closeRecalc();
    }
  };

  if (!user) {
    return (
      <div className="bg-surface-secondary dark:bg-surface rounded-2xl border border-surface-tertiary/50 p-6">
        <p className="text-sm text-muted">Loading user authentication...</p>
      </div>
    );
  }

  const handleConfirm = (
    action: () => Promise<void>,
    title: string,
    description: string,
    loadingKey: string,
  ) => {
    setConfirmDialog({
      isOpen: true,
      title,
      description,
      action: async () => {
        setButtonLoading((prev) => ({ ...prev, [loadingKey]: true }));
        try {
          await action();
        } finally {
          setButtonLoading((prev) => ({ ...prev, [loadingKey]: false }));
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  return (
    <div className="bg-surface-secondary dark:bg-surface rounded-2xl border border-surface-tertiary/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Icon
              className="text-warning-500"
              icon="heroicons:wrench-screwdriver-20-solid"
              width={20}
            />
            Developer Tools
          </h3>
          <p className="text-sm text-muted">Dangerous operations for development only</p>
        </div>
        <Chip color="warning" size="sm" variant="soft">
          Dev Only
        </Chip>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          className="justify-start"
         
          isDisabled={!isOnboarded}
          isPending={buttonLoading["recalc-analytics"]}
          size="lg"
         
          variant="primary"
          onPress={() => {
            setRecalcMessage(null);
            setRecalcError(null);
            openRecalc();
          }}
        >
          Recalculate Analytics
        </Button>

        <Button
          className="justify-start"
         
          isDisabled={!isOnboarded}
          isPending={buttonLoading["delete-metrics"]}
          size="lg"
         
          variant="primary"
          onPress={() =>
            handleConfirm(
              async () => {
                setDeleteMetricsMessage(null);
                setDeleteMetricsError(null);
                try {
                  const result = await deleteAnalytics();
                  setDeleteMetricsMessage(
                    `Deleted ${result.deleted} analytics snapshots (${Object.entries(result.tables)
                      .map(([table, count]) => `${table}: ${count}`)
                      .join(", ")}).`,
                  );
                } catch (err) {
                  const msg =
                    err instanceof Error ? err.message : "Failed to delete analytics metrics";
                  setDeleteMetricsError(msg);
                }
              },
              "Delete Precomputed Analytics",
              "This will remove all precomputed analytics snapshots for the organization.",
              "delete-metrics",
            )
          }
        >
          Delete Precomputed Analytics
        </Button>

        <Button
          className="justify-start"
         
          isDisabled={!isOnboarded}
          isPending={buttonLoading["reset-all"]}
          size="lg"
         
          variant="primary"
          onPress={() =>
            handleConfirm(
              async () => {
                await resetEverything();
                router.push("/onboarding");
              },
              "Reset Everything",
              "This will delete all organization data and restore a fresh state.",
              "reset-all",
            )
          }
        >
          Reset Everything
        </Button>

        <Button
          className="justify-start bg-emerald-600 text-white"
          isDisabled={!hasShopify}
          isPending={buttonLoading["disconnect-shopify"]}
          size="lg"
         
          variant="primary"
          onPress={() =>
            handleConfirm(
              disconnectShopify,
              "Disconnect Shopify",
              "This will delete all Shopify data and connections.",
              "disconnect-shopify",
            )
          }
        >
          {hasShopify ? "Disconnect Shopify" : "Shopify Not Connected"}
        </Button>

        <Button
          className="justify-start bg-blue-600 text-white"
          isDisabled={!hasMeta}
          isPending={buttonLoading["disconnect-meta"]}
          size="lg"
         
          variant="primary"
          onPress={() =>
            handleConfirm(
              disconnectMeta,
              "Disconnect Meta",
              "This will delete all Meta data and connections.",
              "disconnect-meta",
            )
          }
        >
          {hasMeta ? "Disconnect Meta" : "Meta Not Connected"}
        </Button>
      </div>

      <div className="mt-4 space-y-2 text-xs">
        {recalcMessage && <p className="text-success-500">{recalcMessage}</p>}
        {recalcError && <p className="text-danger">{recalcError}</p>}
        {deleteMetricsMessage && <p className="text-warning-500">{deleteMetricsMessage}</p>}
        {deleteMetricsError && <p className="text-danger">{deleteMetricsError}</p>}
        {error && <p className="text-danger">{error}</p>}
        {globalLoading && !Object.values(buttonLoading).some(Boolean) && (
          <p className="text-muted">Running requested operation…</p>
        )}
      </div>

      <ConfirmationDialog
        confirmText="Confirm"
                isOpen={confirmDialog.isOpen}
        description={confirmDialog.description}
        title={confirmDialog.title}
        variant="danger"
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.action}
      />

      <Modal>
        <Modal.Backdrop isOpen={isRecalcOpen} onOpenChange={onRecalcOpenChange}>
          <Modal.Container placement="center">
            <Modal.Dialog>
          {({ close }) => (
            <>
              <Modal.Header className="flex flex-col gap-1">
                Recalculate Analytics
              </Modal.Header>
              <Modal.Body className="space-y-4">
                <RadioGroup
                                    orientation="vertical"
                  value={range}
                  onChange={(value) => setRange(value as typeof range)}
                >
                  <Radio value="60">Last 60 days</Radio>
                  <Radio value="30">Last 30 days</Radio>
                  <Radio value="all">All history</Radio>
                  <Radio value="custom">Custom</Radio>
                </RadioGroup>
                {range === "custom" && (
                  <Input
                                        placeholder="e.g. 7"
                    type="number"
                    value={customDays}
                    onChange={(event) => setCustomDays(event.currentTarget.value)}
                  />
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="tertiary" onPress={close}>
                  Cancel
                </Button>
                <Button variant="primary"
                 
                  isDisabled={buttonLoading["recalc-analytics"]}
                  onPress={handleRecalcConfirm}
                >
                  Recalculate
                </Button>
              </Modal.Footer>
            </>
          )}
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
