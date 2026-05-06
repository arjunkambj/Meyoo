// Design System Constants for Landing Page
export const designSystem = {
  // Section spacing
  spacing: {
    section: "py-20 sm:py-24 lg:py-28", // Consistent section padding
    container: "container mx-auto px-4 sm:px-6 lg:px-8", // Standard container
    gap: {
      sm: "gap-4",
      md: "gap-6",
      lg: "gap-8",
      xl: "gap-12",
    },
  },

  // Typography
  typography: {
    sectionLabel:
      "text-center mb-4 text-xs uppercase tracking-[0.15em] font-medium text-accent/70",
    sectionChip:
      "inline-flex items-center gap-2 mb-1 sm:mb-2 px-0 py-0 text-accent/80",
    sectionTitle:
      "text-center text-2xl sm:text-3xl lg:text-5xl font-semibold tracking-tight leading-tight",
    sectionSubtitle:
      "mt-1 sm:mt-2 max-w-2xl mx-auto text-center text-base sm:text-lg text-muted-foreground",
    cardTitle: "text-xl font-semibold tracking-tight",
    cardDescription: "text-muted-foreground text-sm leading-relaxed",
  },

  // Card styling
  card: {
    base: "bg-surface border border-surface-tertiary/20",
  },

  // Background patterns
  background: {
    gradient: " ",
    mesh: "",
    pattern: `
    `,
  },

  // Animation
  animation: {
    fadeInUp: "animate-fade-in-up",
    fadeIn: "animate-fade-in",
    duration: "transition-all duration-300",
  },

  // Colors (consistent opacity)
  colors: {
    mutedBg: "bg-muted/40",
    primaryAccent: "text-accent",
    borderLight: "border-surface-tertiary/20",
  },
} as const;
