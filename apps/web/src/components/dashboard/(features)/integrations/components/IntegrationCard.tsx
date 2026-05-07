"use client";

import { Button, Card } from "@heroui/react";
import { Icon } from "@iconify/react";

interface IntegrationCardProps {
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  platform: string;
  isConnected: boolean;
  required?: boolean;
  features?: string[];
  isUpcoming?: boolean;
  releaseDate?: string;
  status?: unknown;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onSettings?: () => void;
  onNotifyMe?: () => void;
}

export function IntegrationCard({
  name,
  description,
  icon,
  color,
  isConnected,
  isUpcoming = false,
  releaseDate,
  onConnect,
  onSettings: _onSettings,
  onNotifyMe,
}: IntegrationCardProps) {
  return (
    <Card
      className="relative shadow-none overflow-hidden bg-surface-secondary rounded-2xl border border-surface-tertiary/50 transition-colors hover:border-accent/30"
    >
      {/* Connection Status Indicator */}
      {isConnected && (
        <div className="absolute top-3 right-3">
          <div className="w-2 h-2 bg-success rounded-full" />
        </div>
      )}

      <Card.Content className="px-2 py-1">
        {/* Header with icon and title */}
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor: `${color}15`,
              borderWidth: "1px",
              borderColor: `${color}30`,
            }}
          >
            <Icon icon={icon} style={{ color }} width={26} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base text-foreground truncate">
                {name}
              </h3>
            </div>
            <p className="text-xs text-foreground line-clamp-2 mt-1.5 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-2">
          {isUpcoming ? (
            <Button
              className="w-full bg-surface text-foreground font-medium"
              size="sm"
              variant="tertiary"
              onPress={onNotifyMe}
            >
              {releaseDate}
            </Button>
          ) : isConnected ? (
            <Button
              className="w-full bg-success text-success-foreground font-medium"
              size="sm"
              variant="tertiary"
            >
              Connected
            </Button>
          ) : (
            <Button
              className="w-full font-medium"
              size="sm"
              variant="primary"
              onPress={onConnect}
            >
              Connect
            </Button>
          )}
        </div>
      </Card.Content>
    </Card>
  );
}
