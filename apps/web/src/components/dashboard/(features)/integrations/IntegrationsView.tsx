"use client";

import { Button, Skeleton, Tabs } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useCallback, useState } from "react";
import { INTEGRATIONS } from "@/constants/features/integrations";
import { useIntegration } from "@/hooks";

import { IntegrationCard } from "./components/IntegrationCard";
import { RequestIntegrationModal } from "./components/RequestIntegrationModal";
import {
  UpcomingIntegrations,
  upcomingIntegrations,
} from "./components/UpcomingIntegrations";

type IntegrationItem = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  required?: boolean;
  features: string[];
  status: unknown;
  isConnected?: boolean;
  isUpcoming?: boolean;
  releaseDate?: string;
};

export function IntegrationsView() {
  const [selectedTab, setSelectedTab] = useState("all");
  // Settings modal is disabled for now; hide unused state
  const [showRequestModal, setShowRequestModal] = useState(false);

  const { shopify, meta, google, loading } = useIntegration();
  // const { requests, hasRequestedPlatform } = useIntegrationRequests();

  const integrationConfigByPlatform = {
    shopify: INTEGRATIONS.SHOPIFY,
    meta: INTEGRATIONS.META,
    google: INTEGRATIONS.GOOGLE,
  } as const;

  const integrationStatusByPlatform = {
    shopify,
    meta,
    google,
  } as const;

  const normalizedIntegrations: IntegrationItem[] = ([
    "shopify",
    "meta",
    "google",
  ] as const).map((platform) => {
    const config = integrationConfigByPlatform[platform];
    const status = integrationStatusByPlatform[platform];
    const isConnected = Boolean(status?.connected);
    const configComingSoon =
      typeof (config as { comingSoon?: boolean }).comingSoon === "boolean"
        ? Boolean((config as { comingSoon?: boolean }).comingSoon)
        : false;
    const statusComingSoon =
      status && typeof status === "object" && "comingSoon" in status
        ? Boolean((status as { comingSoon?: boolean }).comingSoon)
        : false;
    const isUpcoming = configComingSoon || statusComingSoon;
    const releaseDate =
      "releaseDate" in config
        ? (config as { releaseDate?: string }).releaseDate
        : undefined;

    return {
      ...config,
      status,
      id: config.id,
      isConnected,
      isUpcoming,
      releaseDate:
        releaseDate ?? (isUpcoming ? "Coming soon" : undefined),
    };
  });

  const upcomingIntegrationItems: IntegrationItem[] = upcomingIntegrations.map(
    (integration) => ({
      ...integration,
      status: null,
      isConnected: false,
      isUpcoming: true,
      releaseDate: integration.releaseDate ?? "Coming soon",
    }),
  );

  const connectedIntegrations = normalizedIntegrations.filter(
    (integration) => integration.isConnected,
  );

  const availableIntegrations = normalizedIntegrations.filter(
    (integration) => !integration.isConnected && !integration.isUpcoming,
  );

  const allIntegrations = [...normalizedIntegrations, ...upcomingIntegrationItems];

  const handleConnect = useCallback((platform: string) => {
    // Redirect to OAuth flow
    switch (platform) {
      case "shopify":
        window.location.href = "/api/v1/shopify/auth";
        break;
      case "meta":
        window.location.href = "/api/v1/meta/auth";
        break;
    }
  }, []);

  const handleDisconnect = useCallback(
    async (platform: string) => {
      // Handle disconnection
      switch (platform) {
        case "meta":
          await meta.disconnect();
          break;
        // Shopify disconnection handled differently
      }
    },
    [meta],
  );

  const handleRequestSuccess = useCallback(() => {
    // Optionally refresh requests or show success message
    setShowRequestModal(false);
  }, []);

  const renderLoadingState = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-surface-secondary rounded-2xl border border-surface-tertiary/50 p-5"
        >
          <div className="flex items-start gap-3 mb-4">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div className="flex-1">
              <Skeleton className="h-5 w-24 mb-2 rounded-lg" />
              <Skeleton className="h-4 w-full rounded-lg" />
            </div>
          </div>
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col space-y-6">
      {/* Header */}
      <div className="h-2" />
      {/* Integration Tabs */}
      <div>
        <Tabs
          selectedKey={selectedTab}
          variant="primary"
          onSelectionChange={(key) => setSelectedTab(String(key))}
        >
          <Tabs.ListContainer>
            <Tabs.List aria-label="Integrations sections">
              <Tabs.Tab id="all">
              <div className="flex items-center gap-2">
                <Icon icon="solar:widget-2-bold-duotone" width={18} />
                <span>All ({allIntegrations.length})</span>
              </div>
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="connected">
              <div className="flex items-center gap-2">
                <Icon icon="solar:link-circle-bold-duotone" width={18} />
                <span>Connected ({connectedIntegrations.length})</span>
              </div>
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="available">
              <div className="flex items-center gap-2">
                <Icon icon="solar:add-square-bold-duotone" width={18} />
                <span>Available ({availableIntegrations.length})</span>
              </div>
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="upcoming">
              <div className="flex items-center gap-2">
                <Icon icon="solar:hourglass-bold-duotone" width={18} />
                <span>Upcoming</span>
              </div>
                <Tabs.Indicator />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
          <Tabs.Panel id="all">
            {loading ? (
              renderLoadingState()
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {allIntegrations.map((integration) => (
                  <IntegrationCard
                    key={integration.id}
                    category={integration.category}
                    color={integration.color}
                    description={integration.description}
                                        features={integration.features}
                    icon={integration.icon}
                    isConnected={Boolean(integration.isConnected)}
                    isUpcoming={integration.isUpcoming}
                    name={integration.name}
                    platform={integration.id}
                    required={integration.required}
                    status={integration.status}
                    releaseDate={integration.releaseDate}
                    onConnect={
                      !integration.isConnected && !integration.isUpcoming
                        ? () => handleConnect(integration.id)
                        : undefined
                    }
                    onDisconnect={
                      integration.isConnected && !integration.isUpcoming
                        ? () => handleDisconnect(integration.id)
                        : undefined
                    }
                    // Settings modal disabled
                  />
                ))}
              </div>
            )}
          </Tabs.Panel>
          <Tabs.Panel id="connected">
            {loading ? (
              renderLoadingState()
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {connectedIntegrations.length > 0 ? (
                  connectedIntegrations.map((integration) => (
                    <IntegrationCard
                      key={integration.id}
                      category={integration.category}
                      color={integration.color}
                    description={integration.description}
                                            features={integration.features}
                      icon={integration.icon}
                      isConnected={true}
                      isUpcoming={integration.isUpcoming}
                      name={integration.name}
                      platform={integration.id}
                      status={integration.status}
                      releaseDate={integration.releaseDate}
                      onConnect={
                        !integration.isUpcoming
                          ? () => handleConnect(integration.id)
                          : undefined
                      }
                      onDisconnect={() => handleDisconnect(integration.id)}
                      // Settings modal disabled
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Icon
                      className="text-foreground mx-auto mb-4"
                      icon="solar:link-broken-bold-duotone"
                      width={64}
                    />
                    <p className="text-foreground mb-4">
                      No integrations connected yet
                    </p>
                    <Button
                     
                      variant="tertiary"
                      onPress={() => setSelectedTab("available")}
                    >
                      Browse Available Integrations
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Tabs.Panel>
          <Tabs.Panel id="available">
            {loading ? (
              renderLoadingState()
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {availableIntegrations.length > 0 ? (
                  availableIntegrations.map((integration) => (
                    <IntegrationCard
                      key={integration.id}
                      category={integration.category}
                      color={integration.color}
                    description={integration.description}
                                            features={integration.features}
                      icon={integration.icon}
                      isConnected={false}
                      isUpcoming={integration.isUpcoming}
                      name={integration.name}
                      platform={integration.id}
                      required={integration.required}
                      status={integration.status}
                      releaseDate={integration.releaseDate}
                      onConnect={
                        !integration.isUpcoming
                          ? () => handleConnect(integration.id)
                          : undefined
                      }
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Icon
                      className="text-success mx-auto mb-4"
                      icon="solar:check-circle-bold-duotone"
                      width={64}
                    />
                    <p className="text-foreground">
                      All available integrations are connected!
                    </p>
                    <p className="text-sm text-foreground mt-2">
                      Use the button below to request new integrations
                    </p>
                  </div>
                )}
              </div>
            )}
          </Tabs.Panel>
          <Tabs.Panel id="upcoming">
            <UpcomingIntegrations />
          </Tabs.Panel>
        </Tabs>

        {/* Request Integration Button */}
        <div className="md:mt-20 mt-8 flex flex-col items-center gap-3">
          <div className="text-center">
            <p className="text-sm text-foreground ">
              Can&apos;t find the integration you need?
            </p>
          </div>
          <Button
            size="lg"
           
            variant="primary"
            onPress={() => setShowRequestModal(true)}
          >
            Request New Integration
          </Button>
        </div>
      </div>

      {/* Integration Settings Modal removed */}

      {/* Request Integration Modal */}
      <RequestIntegrationModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onSuccess={handleRequestSuccess}
      />
    </div>
  );
}
