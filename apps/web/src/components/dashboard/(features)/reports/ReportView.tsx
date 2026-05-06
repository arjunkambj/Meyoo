"use client";

import { Card } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function ReportView() {
  return (
    <div className="flex flex-col space-y-6 pb-20">
      <div className="h-2" />
      <div className="h-full w-full">
        <Card className="w-full px-4 py-3 bg-surface-secondary border border-surface-tertiary/50 rounded-2xl">
          <Card.Content>
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-warning/10 text-warning">
                  <Icon icon="solar:chart-square-bold" width={24} />
                </div>
                <div>
                  <p className="text-md font-semibold">Coming Soon</p>
                  <p className="text-sm text-foreground">
                    Custom report builder in development
                  </p>
                </div>
              </div>
              <p className="text-foreground">Report builder coming soon.</p>
              <ul className="list-disc list-inside space-y-2 text-foreground">
                <li>Custom reports</li>
                <li>Scheduled delivery</li>
                <li>Export to PDF, Excel, CSV</li>
                <li>Team sharing</li>
              </ul>
              <div className="mt-6 p-4 bg-surface-secondary rounded-xl">
                <p className="text-sm text-foreground flex items-center gap-2">
                  <Icon icon="solar:info-circle-bold" width={16} />
                  Available Q4 2025.
                </p>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
