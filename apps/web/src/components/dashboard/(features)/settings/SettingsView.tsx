"use client";

import { Tabs } from "@heroui/react";
import { Icon } from "@iconify/react";

import SettingsLayoutClient from "./SettingsLayoutClient";
import BillingSettingsView from "./billing/BillingSettingsView";
import GeneralSettingsView from "./general/GeneralSettingsView";
import HelpSettingsView from "./help/HelpSettingsView";
import TeamSettingsView from "./team/TeamSettingsView";

export default function SettingsView() {
  return (
    <SettingsLayoutClient>
      <div className="flex flex-col space-y-6 pb-20">
        <div className="h-2" />

        <Tabs variant="primary">
          <Tabs.ListContainer>
            <Tabs.List aria-label="Settings sections">
              <Tabs.Tab id="general">
              <div className="flex items-center gap-2">
                <Icon icon="solar:user-bold-duotone" width={18} />
                <span>General</span>
              </div>
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="billing">
              <div className="flex items-center gap-2">
                <Icon icon="solar:card-bold-duotone" width={18} />
                <span>Billing &amp; Invoices</span>
              </div>
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="team">
              <div className="flex items-center gap-2">
                <Icon icon="solar:users-group-rounded-bold-duotone" width={18} />
                <span>Team</span>
              </div>
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="support">
              <div className="flex items-center gap-2">
                <Icon icon="solar:question-circle-bold-duotone" width={18} />
                <span>Help &amp; Support</span>
              </div>
                <Tabs.Indicator />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
          <Tabs.Panel id="general">
            <GeneralSettingsView />
          </Tabs.Panel>
          <Tabs.Panel id="billing">
            <BillingSettingsView />
          </Tabs.Panel>
          <Tabs.Panel id="team">
            <TeamSettingsView />
          </Tabs.Panel>
          <Tabs.Panel id="support">
            <HelpSettingsView />
          </Tabs.Panel>
        </Tabs>
      </div>
    </SettingsLayoutClient>
  );
}
