"use client";

import { Button, Card, Chip, cn } from "@heroui/react";
import { Icon } from "@iconify/react";
import React from "react";

interface SimpleIntegrationCardProps {
  name: string;
  description: string;
  icon: string;
  isConnected?: boolean;
  isLoading?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  required?: boolean;
  showDisconnect?: boolean;
  comingSoon?: boolean;
  comingSoonLabel?: string;
}

const SimpleIntegrationCard = React.memo(function SimpleIntegrationCard({
  name,
  description,
  icon,
  isConnected = false,
  isLoading = false,
  onConnect,
  onDisconnect,
  required = false,
  showDisconnect = false,
  comingSoon = false,
  comingSoonLabel,
}: SimpleIntegrationCardProps) {
  return (
    <Card
      className={cn(
        "bg-surface-secondary dark:bg-surface-secondary/50 border border-surface-tertiary rounded-xl shadow-none transition-all duration-200",
        !isConnected && "hover:border-accent/20"
      )}
    >
      <Card.Content className="px-5 py-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          {/* Logo */}
          <div className="rounded-lg border border-surface-tertiary bg-surface-secondary p-3">
            <Icon className="text-foreground" icon={icon} width={20} />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-0.5">
            <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
              <h3 className="font-medium text-muted">{name}</h3>
              {required && (
                <Chip color="danger" size="sm" className="px-3">
                  Required
                </Chip>
              )}
              {comingSoon && (
                <Chip color="warning" size="sm">
                  Coming soon
                </Chip>
              )}
            </div>
            <p className="text-sm mt-0.5 text-muted">{description}</p>
          </div>

          {/* Action Button */}
          <div className="shrink-0">
            {isLoading ? (
              <Button
               
                variant="tertiary"
                size="md"
                isDisabled
               
              >
                Connecting...
              </Button>
            ) : isConnected ? (
              <div className="flex items-center gap-2">
                <Button variant="tertiary"
                 
                  size="md"
                 
                >
                  Connected
                </Button>
                {showDisconnect && onDisconnect && (
                  <Button
                   
                    variant="tertiary"
                    size="md"
                   
                    onPress={onDisconnect}
                  >
                    Disconnect
                  </Button>
                )}
              </div>
            ) : comingSoon ? (
              <Button
               
                size="md"
                isDisabled
                variant="tertiary"
              >
                {comingSoonLabel ?? "Coming soon"}
              </Button>
            ) : (
              <Button variant="primary"
               
                size="md"
               
                onPress={onConnect}
              >
                Connect
              </Button>
            )}
          </div>
        </div>
      </Card.Content>
    </Card>
  );
});

export default SimpleIntegrationCard;
