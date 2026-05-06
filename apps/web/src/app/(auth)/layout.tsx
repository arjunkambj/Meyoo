import type React from "react";
import { redirect } from "next/navigation";

import { Logo } from "@/components/shared/Logo";
import { stackServerApp } from "@/stack/server";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const user = await stackServerApp.getUser();

  if (user) {
    redirect("/overview");
  }

  return (
    <div className="h-dvh bg-background p-4 lg:grid lg:grid-cols-2">
      <aside className="relative hidden bg-foreground/3 h-full rounded-3xl text-foreground lg:flex">
        <div className="relative flex w-full flex-col justify-between p-8">
          <HomeLink />
          <div />

          <footer className="flex items-center justify-between border-t border-foreground/10 pt-6">
            <p className="text-sm text-foreground/56">
              #1 Net Profit Analytics For Shopify
            </p>
            <div className="flex items-end gap-2 text-foreground/44"></div>
          </footer>
        </div>
      </aside>

      <main className="relative flex h-full items-center justify-center bg-background px-6 py-10 sm:px-8 lg:px-12">
        <div className="absolute left-6 top-6 lg:hidden">
          <HomeLink />
        </div>

        <div className="flex w-full justify-center pt-14 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
}

function HomeLink() {
  return <Logo href="/" />;
}
