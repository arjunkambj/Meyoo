"use client";

import { Button, Chip, ScrollShadow } from "@heroui/react";
import React, { useCallback } from "react";

import { METRIC_CATEGORIES, METRICS } from "../../metrics/registry";

interface CategorySidebarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategorySidebar = React.memo(function CategorySidebar({
  activeCategory,
  onCategoryChange,
}: CategorySidebarProps) {
  // Memoize category handler
  const handleCategoryChange = useCallback(
    (category: string) => {
      onCategoryChange(category);
    },
    [onCategoryChange],
  );

  return (
    <div className="col-span-3 border-r pr-4 flex flex-col">
      <h3 className="text-sm font-semibold mb-3 text-muted">
        Categories
      </h3>
      <ScrollShadow hideScrollBar className="h-[400px]" visibility="none">
        <div className="space-y-1">
          {/* All Metrics */}
          <Button
            className="justify-start"
            size="sm"
           
            variant={activeCategory === "all" ? "secondary" : "tertiary"}
            onPress={() => handleCategoryChange("all")}
          >
            <span className="text-left flex-1 text-muted">All Metrics</span>
            <Chip className="h-5 text-xs" size="sm" variant="soft">
              {Object.keys(METRICS).length}
            </Chip>
          </Button>

          {Object.values(METRIC_CATEGORIES).map((category) => {
            const isActive = activeCategory === category.id;
            const count = Object.values(METRICS).filter(
              (m) => m.category === category.id,
            ).length;

            return (
              <Button
                key={category.id}
                className="justify-start"
                size="sm"
               
                variant={isActive ? "secondary" : "tertiary"}
                onPress={() => handleCategoryChange(category.id)}
              >
                <span className="text-left flex-1 text-muted">
                  {category.name}
                </span>
                <Chip className="h-5 text-xs" size="sm" variant="soft">
                  {count}
                </Chip>
              </Button>
            );
          })}
        </div>
      </ScrollShadow>
    </div>
  );
});
