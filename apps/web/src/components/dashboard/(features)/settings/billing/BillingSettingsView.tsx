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
        <Card.Content className="px-5 py-5">
          <PlanOverview />
        </Card.Content>
      </Card>

      {/* Billing History */}
      <Card className="rounded-2xl border border-surface-tertiary shadow-none bg-surface-secondary">
        <Card.Content className="p-0">
          <InvoicesList />
        </Card.Content>
      </Card>

      {/* Available Plans (Pricing) - Moved below invoices */}
      <div>
        <AvailablePlans />
      </div>
    </div>
  );
}
