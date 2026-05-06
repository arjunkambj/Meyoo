"use client";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import type { Route } from "next";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  const dashboardRoute: Route = "/overview";
  const contactRoute: Route = "/contact";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="relative text-center max-w-lg mx-auto">
        {/* Decorative accent */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-10 -top-10 h-32 bg-linear-to-b from-accent/10 to-transparent rounded-3xl blur-2xl"
        />

        {/* 404 header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-surface-secondary px-3 py-1 text-xs text-muted">
            Not Found
          </div>
          <h1 className="mt-3 text-7xl sm:text-8xl font-extrabold tracking-tight">
            <span className="text-accent">404</span>
          </h1>
        </div>

        {/* Message Card */}
        <div className="bg-surface-secondary rounded-2xl p-6 mb-8  text-left">
          <div className="flex items-start gap-3">
            <div className="shrink-0">
              <div className="w-10 h-10 bg-warning-100 rounded-xl flex items-center justify-center">
                <Icon
                  className="text-warning-600"
                  icon="solar:danger-triangle-outline"
                  width={24}
                />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-muted mb-1">
                Page not found
              </h2>
              <p className="text-sm text-muted">
                The page you&apos;re looking for doesn&apos;t exist or may have
                been moved. If you typed the URL manually, please check your
                spelling.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="primary"
           
            size="lg"
           
            onPress={() => router.back()}
          >
            Go Back
          </Button>

          <Button
            size="lg"
           
            variant="outline"
            onPress={() => router.push(dashboardRoute)}
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Help & Report */}
        <div className="mt-8 space-y-2 text-sm text-muted">
          <p>
            Need help?{" "}
            <button
              type="button"
              className="text-accent hover:underline transition-all duration-200"
              onClick={() => router.push(contactRoute)}
            >
              Contact Support
            </button>
          </p>
          <p>
            Think this is a bug?{" "}
            <button
              type="button"
              className="text-muted hover:underline transition-all duration-200"
              onClick={() => router.push(dashboardRoute)}
            >
              Report an issue
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
