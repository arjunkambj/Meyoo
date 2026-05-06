import { Spinner } from "@heroui/react";

export default function Loading() {
  return (
    <div className="flex h-full min-h-dvh w-full items-center justify-center">
      <Spinner color="accent" size="lg" />
    </div>
  );
}
