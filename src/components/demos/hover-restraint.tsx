"use client";

import { useDemoText } from "@/components/app/demo-messages";
import {
  ArchiveIcon,
  CalendarBlankIcon,
  CheckCircleIcon,
  FoldersIcon,
  LinkSimpleIcon,
  SidebarSimpleIcon,
  SunIcon,
  TextBIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
  TextUnderlineIcon,
  TrayIcon,
  XCircleIcon,
} from "@phosphor-icons/react";

import { useEffect, useState } from "react";

import { Compare, CompareItem } from "@/components/app/compare";
import { Demo } from "@/components/app/demo";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Inbox", Icon: TrayIcon },
  { label: "Today", Icon: SunIcon },
  { label: "Upcoming", Icon: CalendarBlankIcon },
  { label: "Projects", Icon: FoldersIcon },
  { label: "Archive", Icon: ArchiveIcon },
] as const;

const TOOLBAR_ACTIONS = [
  { label: "Bold", Icon: TextBIcon },
  { label: "Italic", Icon: TextItalicIcon },
  { label: "Underline", Icon: TextUnderlineIcon },
  { label: "Strikethrough", Icon: TextStrikethroughIcon },
  { label: "Link", Icon: LinkSimpleIcon },
] as const;

export function HoverRestraintDemo() {
  const t = useDemoText();
  const examples = [
    { label: "Wrong", detail: "300ms fade in", animated: true },
    { label: "Right", detail: "Instant", animated: false },
  ] as const;

  return (
    <Demo className="gap-12 px-4 sm:px-8">
      <div className="grid w-full max-w-lg grid-cols-2 gap-3 sm:gap-10">
        {examples.map((example) => (
          <div
            key={example.label}
            className="flex min-w-0 flex-col items-center gap-6"
          >
            <div
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium",
                example.animated ? "text-destructive" : "text-emerald-500"
              )}
            >
              {example.animated ? (
                <XCircleIcon
                  aria-hidden="true"
                  className="size-4"
                  weight="fill"
                />
              ) : (
                <CheckCircleIcon
                  aria-hidden="true"
                  className="size-4"
                  weight="fill"
                />
              )}
              {t(example.label)}
            </div>

            <div className="w-full rounded-xl bg-card p-1 shadow-(--custom-shadow)">
              <ul className="flex flex-col gap-0.5">
                {NAV_ITEMS.map((item) => (
                  <li
                    key={item.label}
                    className={cn(
                      "flex items-center gap-2 rounded-lg p-2 select-none text-xs cursor-pointer text-muted-foreground hover:bg-muted hover:text-foreground",
                      example.animated && "transition-colors duration-300"
                    )}
                  >
                    <item.Icon
                      aria-hidden="true"
                      className="size-3.5 mb-px shrink-0"
                    />
                    {t(item.label)}
                  </li>
                ))}
              </ul>
            </div>

            <span className="text-xs text-muted-foreground">
              {t(example.detail)}
            </span>
          </div>
        ))}
      </div>
    </Demo>
  );
}

function ToolbarButton({
  label,
  Icon,
}: {
  label: string;
  Icon: (typeof TOOLBAR_ACTIONS)[number]["Icon"];
}) {
  const t = useDemoText();
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            aria-label={t(label)}
            className="transition-none hover:dark:bg-muted"
            size="icon-sm"
            variant="ghost"
          >
            <Icon aria-hidden="true" className="size-4" />
          </Button>
        }
      />
      <TooltipContent>{t(label)}</TooltipContent>
    </Tooltip>
  );
}

export function HoverTooltipDemo() {
  const t = useDemoText();
  return (
    <Demo className="gap-12 px-4 sm:px-8">
      <div className="grid w-full max-w-lg grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-10">
        <div className="flex min-w-0 flex-col items-center gap-6">
          <div className="flex items-center gap-0.5 rounded-full bg-card p-0.5 shadow-(--custom-shadow)">
            {TOOLBAR_ACTIONS.map((action) => (
              <TooltipProvider key={action.label} delay={600}>
                <ToolbarButton label={action.label} Icon={action.Icon} />
              </TooltipProvider>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {t("Every tooltip waits")}
          </span>
        </div>

        <div className="flex min-w-0 flex-col items-center gap-6">
          <TooltipProvider delay={600}>
            <div className="flex items-center gap-0.5 rounded-full bg-card p-0.5 shadow-(--custom-shadow)">
              {TOOLBAR_ACTIONS.map((action) => (
                <ToolbarButton
                  key={action.label}
                  label={action.label}
                  Icon={action.Icon}
                />
              ))}
            </div>
          </TooltipProvider>
          <span className="text-xs text-muted-foreground">
            {t("Only the first waits")}
          </span>
        </div>
      </div>
    </Demo>
  );
}

function SidebarWindow({
  open,
  animated,
}: {
  open: boolean;
  animated: boolean;
}) {
  const t = useDemoText();
  return (
    <div className="flex w-full h-44 overflow-hidden rounded-lg bg-card shadow-(--custom-shadow)">
      <div
        className={cn(
          "w-28 shrink-0 border-r border-[#E7E7E7] p-1 dark:border-[#1E1E1E]",
          animated &&
            "transition-[margin,opacity] duration-250 ease-out motion-reduce:transition-none",
          !open && "-ml-28 opacity-0"
        )}
      >
        <ul className="flex flex-col">
          {NAV_ITEMS.map((item, index) => (
            <li
              key={item.label}
              className={cn(
                "flex items-center gap-1.5 rounded-sm px-2 py-1.5 text-xs",
                index === 0
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground"
              )}
            >
              <item.Icon aria-hidden="true" className="size-3 shrink-0" />
              {t(item.label)}
            </li>
          ))}
        </ul>
      </div>
      <div className="min-w-0 flex-1 p-3">
        <div className="mb-3 h-2.5 w-14 rounded-full bg-foreground/15" />
        <div className="flex flex-col gap-2">
          <div className="h-2 w-full rounded-full bg-foreground/8" />
          <div className="h-2 w-5/6 rounded-full bg-foreground/8" />
          <div className="h-2 w-2/3 rounded-full bg-foreground/8" />
        </div>
      </div>
    </div>
  );
}

export function KeyboardActionDemo() {
  const t = useDemoText();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        !(event.metaKey || event.ctrlKey) ||
        event.key.toLowerCase() !== "b"
      ) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, [contenteditable]")) return;
      event.preventDefault();
      setOpen((value) => !value);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <Demo className="gap-12 px-0">
      <Compare className="max-w-full">
        <CompareItem verdict="wrong" label={t("Animated")}>
          <SidebarWindow animated open={open} />
        </CompareItem>
        <CompareItem verdict="right" label={t("Instant")}>
          <SidebarWindow animated={false} open={open} />
        </CompareItem>
      </Compare>

      <Button onClick={() => setOpen((value) => !value)} variant="secondary">
        {t("Toggle sidebar")}
        <Kbd className="shadow-none bg-transparent dark:border-none dark:bg-transparent text-muted-foreground">
          ⌘B
        </Kbd>
      </Button>
    </Demo>
  );
}
