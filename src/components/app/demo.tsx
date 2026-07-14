import { cn } from "@/lib/utils";

export function Demo({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "my-8 flex min-h-48 flex-col items-center justify-center gap-6 rounded-2xl border bg-card px-6 py-10",
        className,
      )}
    >
      {children}
    </figure>
  );
}
