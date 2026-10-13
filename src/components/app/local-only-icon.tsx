import { EyeSlashIcon, PencilSimpleLineIcon } from "@phosphor-icons/react/dist/ssr";

import { getConceptLocalStatus } from "@/lib/concepts";
import { cn } from "@/lib/utils";

/**
 * Small marker shown in development next to concepts not yet live in prod.
 * Drafts get a muted eye-slash; concepts being actively worked on get an
 * amber pencil so they stand out in the nav.
 */
export function LocalOnlyIcon({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const status = getConceptLocalStatus(slug);
  if (status === "launched") return null;

  const wip = status === "wip";
  const label = wip ? "In progress" : "Not published yet";
  const Icon = wip ? PencilSimpleLineIcon : EyeSlashIcon;

  return (
    <span title={label} className="inline-flex shrink-0">
      <Icon
        aria-label={label}
        weight="bold"
        className={cn(
          "size-3",
          wip ? "text-amber-500 dark:text-amber-400" : "text-muted-foreground/60",
          className
        )}
      />
    </span>
  );
}
