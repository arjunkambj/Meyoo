export const revealContainerVariants = {
  animate: {
    transition: { staggerChildren: 0.045 },
  },
  initial: {},
};

export const revealItemVariants = {
  animate: {
    opacity: 1,
    transition: { duration: 0.42, ease: "easeOut" as const },
    y: 0,
  },
  initial: { opacity: 0, y: 14 },
};

export const revealCardVariants = {
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.42, ease: "easeOut" as const },
    y: 0,
  },
  initial: { opacity: 0, scale: 0.98, y: 14 },
};

export const interactiveCardVariants = {
  ...revealCardVariants,
  hover: {
    scale: 1.02,
    transition: { duration: 0.28, ease: "easeOut" as const },
    y: -8,
  },
};

export const interactiveImageVariants = {
  hover: {
    scale: 1.025,
    transition: { duration: 0.28, ease: "easeOut" as const },
  },
  initial: { scale: 1 },
};

export const revealViewport = {
  amount: 0.2,
  margin: "0px 0px -12% 0px",
  once: true,
} as const;
