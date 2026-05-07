"use client";
import { Card } from "@heroui/react";
import AvailablePlans from "./AvailablePlans";
import InvoicesList from "./InvoicesList";
import PlanOverview from "./PlanOverview";

export default function BillingSettingsView() {
  return (
    <div className="space-y-6 pb-8">
      {/* Current Plan - Moved to top */}
      <Card className="rounded-2xl border border-surface-tertiary shadow-none bg-surface-secondary">
        <Card.Content className="px-2 py-1">
          <PlanOverview />
        </Card.Content>
      </Card>

      <AvailablePlans />

      <InvoicesList />
    </div>
  );
}
