"use client";

import { Tabs } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState, type Key, type ReactNode } from "react";

import SettingsLayoutClient from "./SettingsLayoutClient";
import BillingSettingsView from "./billing/BillingSettingsView";
import GeneralSettingsView from "./general/GeneralSettingsView";
import HelpSettingsView from "./help/HelpSettingsView";
import TeamSettingsView from "./team/TeamSettingsView";

type SettingsTabKey = "general" | "billing" | "team" | "support";

const isSettingsTabKey = (key: Key): key is SettingsTabKey =>
  ["general", "billing", "team", "support"].includes(String(key));

const VisitedPanel = ({
  children,
  isVisited,
}: {
  children: ReactNode;
  isVisited: boolean;
}) => (isVisited ? children : null);

export default function SettingsView() {
  const [selectedTab, setSelectedTab] = useState<SettingsTabKey>("general");
  const [visitedTabs, setVisitedTabs] = useState<Set<SettingsTabKey>>(
    () => new Set(["general"]),
  );

  const handleSelectionChange = (key: Key) => {
    if (!isSettingsTabKey(key)) return;
    setSelectedTab(key);
    setVisitedTabs((tabs) => new Set(tabs).add(key));
  };

  return (
    <SettingsLayoutClient>
      <div className="flex flex-col space-y-6 pb-20">
        <div className="h-2" />

        <Tabs
          destroyInactiveTabPanel={false}
          selectedKey={selectedTab}
          variant="primary"
          onSelectionChange={handleSelectionChange}
        >
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
            <VisitedPanel isVisited={visitedTabs.has("general")}>
              <GeneralSettingsView />
            </VisitedPanel>
          </Tabs.Panel>
          <Tabs.Panel id="billing">
            <VisitedPanel isVisited={visitedTabs.has("billing")}>
              <BillingSettingsView />
            </VisitedPanel>
          </Tabs.Panel>
          <Tabs.Panel id="team">
            <VisitedPanel isVisited={visitedTabs.has("team")}>
              <TeamSettingsView />
            </VisitedPanel>
          </Tabs.Panel>
          <Tabs.Panel id="support">
            <VisitedPanel isVisited={visitedTabs.has("support")}>
              <HelpSettingsView />
            </VisitedPanel>
          </Tabs.Panel>
        </Tabs>
      </div>
    </SettingsLayoutClient>
  );
}
