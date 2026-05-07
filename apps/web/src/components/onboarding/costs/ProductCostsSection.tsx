"use client";

import { Button, Input, Skeleton, Table, Tooltip } from "@heroui/react";
import { Accordion } from "@heroui/react/accordion";
import { Icon } from "@iconify/react";
import Image from "next/image";
import React, { useMemo } from "react";
import { DATA_TABLE_TABLE_CLASS } from "@/components/shared/table/DataTableCard";

const TableBody = Table.Body;
const TableCell = Table.Cell;
const TableColumn = Table.Column;
const TableHeader = Table.Header;
const TableRow = Table.Row;

type Product = {
  id: string;
  shopifyId: string;
  title: string;
  price: number;
  imageUrl?: string;
  sku?: string;
};

interface ProductCostsSectionProps {
  products: Product[];
  productCosts: Record<string, number>;
  onChangeById: (id: string, value: number) => void;
  currencySymbol: string;
  isLoading: boolean;
  productsOpen: boolean;
  setProductsOpen: (open: boolean) => void;
  onApplyPercentageToAll: (pct: number) => void;
}

export default function ProductCostsSection({
  products,
  productCosts,
  onChangeById,
  currencySymbol,
  isLoading,
  productsOpen,
  setProductsOpen,
  onApplyPercentageToAll,
}: ProductCostsSectionProps) {
  const skeletonIndexes = useMemo(
    () => Array.from({ length: 8 }, (_, i) => i),
    [],
  );

  return (
    <Accordion
      className="border border-surface-tertiary px-4 py-2 mb-2 rounded-2xl"
      expandedKeys={productsOpen ? ["products"] : []}
      onExpandedChange={(keys) => {
        const open = Array.from(keys).includes("products");
        setProductsOpen(open);
      }}
    >
      <Accordion.Item key="products" id="products">
        <Accordion.Heading>
          <Accordion.Trigger className="flex w-full items-center justify-between py-2">
            <div>
              <div className="flex items-center gap-2">
                <Icon
                  className="text-accent text-base"
                  icon="solar:box-bold-duotone"
                />
                <span className="text-sm font-medium">
                  Product-level Overrides
                </span>
              </div>
              <span className="text-muted text-xs">
                Optional: fine-tune specific product costs
              </span>
            </div>
            <Accordion.Indicator>
              <Icon icon="solar:alt-arrow-down-linear" width={16} />
            </Accordion.Indicator>
          </Accordion.Trigger>
        </Accordion.Heading>
        <Accordion.Panel>
          <Accordion.Body>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted">
                  Set per-product cost to improve accuracy
                </div>
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <Tooltip.Trigger>
                      <Button
                        size="sm"
                        variant="tertiary"
                        onPress={() => onApplyPercentageToAll(30)}
                      >
                        Quick apply: 30%
                      </Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content placement="top">
                      Apply percentage of price as cost to all products
                    </Tooltip.Content>
                  </Tooltip>
                </div>
              </div>

              <div>
                <Table className={DATA_TABLE_TABLE_CLASS}>
                  <Table.ScrollContainer>
                    <Table.Content aria-label="Product costs">
                      <TableHeader>
                        <TableColumn id="product" isRowHeader>
                          Product
                        </TableColumn>
                        <TableColumn id="price">Price</TableColumn>
                        <TableColumn id="cost">Cost</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {isLoading
                          ? skeletonIndexes.map((i) => (
                              <TableRow key={`sk-${i}`} id={`sk-${i}`}>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Skeleton className="w-6 h-6 rounded" />
                                    <div className="space-y-1">
                                      <Skeleton className="h-3 w-40 rounded" />
                                      <Skeleton className="h-3 w-24 rounded" />
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Skeleton className="h-3 w-14 rounded" />
                                </TableCell>
                                <TableCell>
                                  <Skeleton className="h-8 w-28 rounded" />
                                </TableCell>
                              </TableRow>
                            ))
                          : products.map((product) => (
                              <TableRow key={product.id} id={product.id}>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    {product.imageUrl && (
                                      <Image
                                        alt={product.title}
                                        className="w-6 h-6 rounded object-cover"
                                        width={24}
                                        height={24}
                                        src={product.imageUrl}
                                      />
                                    )}
                                    <div>
                                      <p className="font-medium text-xs">
                                        {product.title}
                                      </p>
                                      {product.sku && (
                                        <p className="text-xs text-muted">
                                          SKU: {product.sku}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="text-xs font-medium">
                                    {currencySymbol}
                                    {product.price.toFixed(2)}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <Input
                                    variant="secondary"
                                    placeholder={`${(product.price * 0.3).toFixed(2)}`}
                                    value={
                                      productCosts[product.id]?.toString() || ""
                                    }
                                    onChange={(e) => {
                                      const parsed =
                                        parseFloat(e.target.value) || 0;
                                      onChangeById(product.id, parsed);
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                      </TableBody>
                    </Table.Content>
                  </Table.ScrollContainer>
                </Table>
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
