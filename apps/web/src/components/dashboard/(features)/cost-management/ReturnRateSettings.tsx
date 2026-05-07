"use client";

import { Button, Input, Skeleton, toast } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";

import { useManualReturnRate, useSetManualReturnRate } from "@/hooks";

const sanitizePercentage = (value: string) => {
  if (!value) return "";
  const cleaned = value.replace(/[^0-9.]/g, "");
  if (cleaned === ".") return "0.";
  const parts = cleaned.split(".");
  const head = parts.shift() || "";
  const decimals = parts.join("");
  return decimals.length > 0 ? `${head}.${decimals}` : head;
};

export default function ReturnRateSettings() {
  const { manualReturnRate, loading } = useManualReturnRate();
  const setManualReturnRate = useSetManualReturnRate();

  const [rateInput, setRateInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!manualReturnRate) {
      setRateInput("");
      return;
    }

    if (
      manualReturnRate.isActive &&
      typeof manualReturnRate.ratePercent === "number"
    ) {
      setRateInput(String(manualReturnRate.ratePercent));
    } else {
      setRateInput("");
    }
  }, [manualReturnRate, loading]);

  const parsedRate = useMemo(() => {
    if (rateInput.trim() === "") return undefined;
    const numeric = Number(rateInput);
    if (Number.isNaN(numeric)) return undefined;
    return Math.max(0, Math.min(100, numeric));
  }, [rateInput]);

  const hasInvalidInput = rateInput.trim() !== "" && parsedRate === undefined;

  const saveDisabled = saving || hasInvalidInput;

  const handleSave = async () => {
    if (saveDisabled) return;
    setSaving(true);
    try {
      await setManualReturnRate({ ratePercent: parsedRate });
      toast.success("Return rate updated", { timeout: 2400 });
    } catch (_error) {
      toast.danger("Failed to update", { timeout: 2600 });
    } finally {
      setSaving(false);
    }
  };

  const topContent = (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold">RTO & Return Rate Override</h2>
      <Button
        variant="primary"
        className="font-semibold"
        isPending={saving}
        isDisabled={saveDisabled || loading}
        onPress={handleSave}
      >
        Save Return Rate
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {topContent}
        <div className="space-y-6 max-w-2xl">
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {topContent}
      <div className="space-y-6 max-w-2xl">
        <div>
          <p className="text-sm text-foreground">
            Use this percentage to estimate revenue lost to undetected
            returns/RTO. Leave the field empty to disable the manual adjustment.
          </p>
        </div>

        <div className="grid gap-4 sm:max-w-md">
          <Input
            variant="secondary"
            placeholder="e.g. 5"
            type="number"
            inputMode="decimal"
            min={0}
            max={100}
            step="0.1"
            value={rateInput}
            onChange={(event) => {
              const value = event.currentTarget.value;
              setRateInput(sanitizePercentage(value));
            }}
          />
          <span className="text-xs text-foreground">
            Leave empty and save to clear the manual override.
          </span>
        </div>
      </div>
    </div>
  );
}
