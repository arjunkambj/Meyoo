"use client";

import { Button, Modal } from "@heroui/react";
import { Icon } from "@iconify/react";
import { m } from "motion/react";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo } from "@/components/shared/Logo";
import { designSystem } from "@/libs/design-system";
import { cn } from "@/libs/utils";

const navItems: { name: string; href: Route }[] = [
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Pricing", href: "/pricing" },
];

const navVariants = {
  animate: {
    opacity: 1,
    transition: { duration: 0.36, ease: "easeOut" as const },
    y: 0,
  },
  initial: { opacity: 0, y: -20 },
};

const navItemVariants = {
  animate: {
    opacity: 1,
    transition: { duration: 0.28, ease: "easeOut" as const },
    y: 0,
  },
  initial: { opacity: 0, y: -10 },
};

export default function CenteredNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const currentPath = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    if (currentPath !== "/") {
      setIsPastHero(true);
      return;
    }

    const hero = document.querySelector<HTMLElement>("[data-home-hero]");

    if (!hero) {
      throw new Error("Home hero marker is required for navbar state");
    }

    const updateNavState = () => {
      setIsPastHero(hero.getBoundingClientRect().bottom <= 88);
    };
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];

      if (!entry) {
        throw new Error("Navbar hero observer did not receive an entry");
      }

      setIsPastHero(!entry.isIntersecting);
    }, { rootMargin: "-88px 0px 0px 0px" });

    updateNavState();
    observer.observe(hero);
    window.addEventListener("resize", updateNavState, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateNavState);
    };
  }, [currentPath, isClient]);

  // Lock body scroll when mobile menu is open to reduce paint cost
  useEffect(() => {
    if (!isClient) return;
    const original = document.body.style.overflow;
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = original || "";
    }
    return () => {
      document.body.style.overflow = original || "";
    };
  }, [isClient, isMenuOpen]);

  return (
    <div className="sticky top-0 z-50 w-full">
      <m.div
        className={cn(
          designSystem.spacing.container,
          "flex w-full transition-all duration-700 ease-out",
          isPastHero && "mt-2 max-w-5xl"
        )}
        animate="animate"
        initial="initial"
        variants={navVariants}
      >
        <m.nav
          className={cn(
            "flex w-full items-center gap-2 px-2 transition-all duration-700 ease-out sm:gap-4 sm:px-4 md:px-6",
            isPastHero
              ? "rounded-2xl bg-surface py-1.5 sm:py-1.5 md:py-2"
              : "rounded-none bg-background py-2.5 sm:py-2.5 md:py-4"
          )}
        >
          {/* Left side - Logo */}
          <m.div className="shrink-0" variants={navItemVariants}>
            <Logo href="/" />
          </m.div>

          {/* Center - Navigation Items */}
          <div className="hidden flex-1 justify-center md:flex">
            <m.div
              className="flex items-center gap-10"
              variants={{
                animate: { transition: { staggerChildren: 0.045 } },
                initial: {},
              }}
            >
              {navItems.map((item) => (
                <m.div key={item.name} variants={navItemVariants}>
                  <Button
                    className={`relative px-3 py-2 transition-all bg-transparent hover:bg-transparent duration-300 font-medium text-sm group h-auto min-w-0 ${
                      currentPath === item.href
                        ? "text-accent"
                        : "text-muted hover:text-accent"
                    }`}
                    onPress={() => router.push(item.href)}
                  >
                    {item.name}
                    <span
                      className={`absolute bottom-0 left-0 w-full h-0.5 bg-accent/60 rounded-full transition-transform duration-300 origin-left ${
                        currentPath === item.href
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Button>
                </m.div>
              ))}
            </m.div>
          </div>

          {/* Right side - CTA (Meyoo) */}
          <m.div
            className="hidden shrink-0 grow-0 md:flex"
            variants={navItemVariants}
          >
            <Button
              variant="primary"
              className="w-full font-semibold"
              onPress={() => router.push("/sign-in")}
            >
              Get started
              <Icon className="ml-1" icon="solar:alt-arrow-right-linear" />
            </Button>
          </m.div>

          {/* Mobile Menu Toggle */}
          <div className="ml-auto shrink-0 grow-0 md:hidden">
            <Button
              isIconOnly
              className="text-muted-foreground hover:bg-muted/50 backdrop-blur-sm transition-all duration-300 w-9 h-9 min-w-9 rounded-full"
              size="sm"
              variant="tertiary"
              onPress={() => setIsMenuOpen(true)}
            >
              <Icon className="text-lg" icon="mdi:menu" />
            </Button>
          </div>

          {/* Mobile Modal */}
          <Modal>
            <Modal.Backdrop
              isOpen={isMenuOpen}
              onOpenChange={setIsMenuOpen}
              variant="blur"
            >
              <Modal.Container placement="top" size="full">
                <Modal.Dialog className="m-4 rounded-2xl bg-background/95 p-4 backdrop-blur-md sm:p-6">
                  {({ close }) => (
                    <Modal.Body className="py-4 sm:py-6">
                      <div className="flex min-h-[calc(100vh-4rem)] flex-col">
                        {/* Mobile Header */}
                        <div className="flex items-center justify-between pb-4 sm:pb-6">
                          <Logo href="/" />
                          <Button
                            isIconOnly
                            className="text-muted-foreground hover:bg-muted/50 transition-all duration-300 w-9 h-9 min-w-9 rounded-full"
                            size="sm"
                            variant="tertiary"
                            onPress={close}
                          >
                            <Icon className="text-lg" icon="mdi:close" />
                          </Button>
                        </div>

                        {/* Mobile Navigation */}
                        <div className="flex flex-1 flex-col justify-center space-y-6 py-8 sm:space-y-8">
                          {navItems.map((item) => (
                            <Button
                              key={item.name}
                              variant="tertiary"
                              className="text-lg sm:text-xl font-medium text-muted-foreground hover:text-accent transition-colors duration-300 text-left justify-start p-0 h-auto min-w-0"
                              onPress={() => {
                                router.push(item.href);
                                close();
                              }}
                            >
                              {item.name}
                            </Button>
                          ))}

                          {/* CTA buttons */}
                          <div className="pt-6 sm:pt-8">
                            <Button
                              variant="primary"
                              className="w-full rounded-full font-semibold text-sm sm:text-base"
                              size="lg"
                              onPress={() => {
                                router.push("/sign-in");
                                close();
                              }}
                            >
                              Start 28-day trial
                              <Icon
                                className="ml-1"
                                icon="solar:alt-arrow-right-linear"
                              />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Modal.Body>
                  )}
                </Modal.Dialog>
              </Modal.Container>
            </Modal.Backdrop>
          </Modal>
        </m.nav>
      </m.div>
    </div>
  );
}
