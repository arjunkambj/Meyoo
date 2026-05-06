import { Spinner } from "@heroui/spinner";

export default function Loading() {
  return (
    <div className="flex h-dvh w-full items-center justify-center">
      <Spinner color="primary" size="lg" />
    </div>
  );
}
