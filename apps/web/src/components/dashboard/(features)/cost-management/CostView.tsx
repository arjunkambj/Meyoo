"use client";
import { Tabs } from "@heroui/react";
import { Icon } from "@iconify/react";
import OtherCostsTable from "./OtherCostsTable";
import PaymentFeesTable from "./PaymentFeesTable";
import ProductCostTable from "./ProductCostTable";
import ShippingCostTable from "./ShippingCostTable";
import ReturnRateSettings from "./ReturnRateSettings";

export default function CostView() {
  return (
    <div className="flex flex-col space-y-6 pb-20">
      {/* Header */}
      <div className="h-2" />

      {/* Tabs Section */}
      <div>
        <Tabs variant="primary">
          <Tabs.ListContainer>
            <Tabs.List aria-label="Cost management sections">
              <Tabs.Tab id="products">
              <div className="flex items-center gap-2">
                <Icon icon="solar:box-bold-duotone" width={18} />
                <span>Products</span>
              </div>
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="shipping">
              <div className="flex items-center gap-2">
                <Icon icon="solar:delivery-bold-duotone" width={18} />
                <span>Shipping</span>
              </div>
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="payment">
              <div className="flex items-center gap-2">
                <Icon icon="solar:card-bold-duotone" width={18} />
                <span>Payment Fees</span>
              </div>
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="operating">
              <div className="flex items-center gap-2">
                <Icon icon="solar:wallet-bold-duotone" width={18} />
                <span>Operating Costs</span>
              </div>
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="returns">
              <div className="flex items-center gap-2">
                <Icon icon="solar:refresh-circle-bold-duotone" width={18} />
                <span>RTO & Returns</span>
              </div>
                <Tabs.Indicator />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
          <Tabs.Panel id="products">
            <ProductCostTable />
          </Tabs.Panel>
          <Tabs.Panel id="shipping">
            <ShippingCostTable />
          </Tabs.Panel>
          <Tabs.Panel id="payment">
            <PaymentFeesTable />
          </Tabs.Panel>
          <Tabs.Panel id="operating">
            <OtherCostsTable />
          </Tabs.Panel>
          <Tabs.Panel id="returns">
            <ReturnRateSettings />
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
}
