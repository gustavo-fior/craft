"use client";

import {
  IconBrandGithub,
  IconDeviceDesktop,
  IconLink,
  IconMoon,
  IconSun,
  IconVolume,
  IconVolumeOff,
} from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { CopyIcon } from "@/components/app/copy-icon";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { isMuted, playSound, setMuted } from "@/lib/sounds";

function Action({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={label}
            onClick={onClick}
          >
            {children}
          </Button>
        }
      />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const copy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    playSound("confirm");
    toast("Link copied");
    setCopied(true);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Action label="Copy link" onClick={copy}>
      <CopyIcon copied={copied} icon={<IconLink className="size-4" />} className="size-4" />
    </Action>
  );
}

export function ViewInRepoButton({ href }: { href: string }) {
  return (
    <Action
      label="View in repo"
      onClick={() => {
        playSound("pop");
        window.open(href, "_blank", "noopener,noreferrer");
      }}
    >
      <IconBrandGithub className="size-4" />
    </Action>
  );
}

const THEME_CYCLE = ["system", "light", "dark"] as const;

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const current = THEME_CYCLE.includes(theme as (typeof THEME_CYCLE)[number])
    ? (theme as (typeof THEME_CYCLE)[number])
    : "system";
  const next = THEME_CYCLE[(THEME_CYCLE.indexOf(current) + 1) % 3];

  return (
    <Action
      label={mounted ? `Theme: ${current}` : "Theme"}
      onClick={() => {
        playSound("toggle");
        setTheme(next);
      }}
    >
      {!mounted || current === "system" ? (
        <IconDeviceDesktop className="size-4" />
      ) : current === "light" ? (
        <IconSun className="size-4" />
      ) : (
        <IconMoon className="size-4" />
      )}
    </Action>
  );
}

export function SoundToggle() {
  const [muted, setMutedState] = useState(true);
  useEffect(() => setMutedState(isMuted()), []);

  return (
    <Action
      label={muted ? "Unmute sounds" : "Mute sounds"}
      onClick={() => {
        const next = !muted;
        setMuted(next);
        setMutedState(next);
        if (!next) playSound("pop");
      }}
    >
      {muted ? (
        <IconVolumeOff className="size-4" />
      ) : (
        <IconVolume className="size-4" />
      )}
    </Action>
  );
}
