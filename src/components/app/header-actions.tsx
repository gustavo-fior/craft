"use client";

import {
  DesktopIcon,
  GithubLogoIcon,
  LinkIcon,
  MarkdownLogoIcon,
  MoonIcon,
  SpeakerHighIcon,
  SpeakerSlashIcon,
  SunIcon,
} from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { CopyIcon } from "@/components/app/copy-icon";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUiLanguage } from "./ui-language";
import { isMuted, playSound, setMuted } from "@/lib/sounds";

function Action({
  label,
  onClick,
  onPrefetch,
  children,
}: {
  label: string;
  onClick: () => void;
  /** Fired on hover/focus so a click can complete without waiting on the network. */
  onPrefetch?: () => void;
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
            onPointerEnter={onPrefetch}
            onFocus={onPrefetch}
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
  const { messages } = useUiLanguage();
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const copy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    playSound("success", { volume: 0.35 });
    setCopied(true);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Action label={messages.copyLink} onClick={copy}>
      <CopyIcon
        copied={copied}
        icon={<LinkIcon className="size-4" />}
        className="size-4"
      />
    </Action>
  );
}

// Copies the agent-friendly Markdown version of the current concept. The text
// is fetched on hover so the clipboard write still happens inside the click's
// user activation, which Safari requires.
export function CopyMarkdownButton({ href }: { href: string }) {
  const { messages } = useUiLanguage();
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const markdown = useRef<Promise<string> | undefined>(undefined);

  useEffect(() => {
    markdown.current = undefined;
  }, [href]);

  const load = () => {
    markdown.current ??= fetch(href).then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    });
    return markdown.current;
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(await load());
    } catch {
      markdown.current = undefined;
      return;
    }
    playSound("success", { volume: 0.35 });
    setCopied(true);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Action label={messages.copyMarkdown} onClick={copy} onPrefetch={load}>
      <CopyIcon
        copied={copied}
        icon={<MarkdownLogoIcon className="size-4" />}
        className="size-4"
      />
    </Action>
  );
}

export function ViewInRepoButton({ href }: { href: string }) {
  const { messages } = useUiLanguage();
  return (
    <Action
      label={messages.viewRepo}
      onClick={() => {
        playSound("pop");
        window.open(href, "_blank", "noopener,noreferrer");
      }}
    >
      <GithubLogoIcon className="size-4" />
    </Action>
  );
}

const THEME_CYCLE = ["system", "light", "dark"] as const;

export function ThemeSwitcher() {
  const { messages } = useUiLanguage();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const current = THEME_CYCLE.includes(theme as (typeof THEME_CYCLE)[number])
    ? (theme as (typeof THEME_CYCLE)[number])
    : "system";
  const next = THEME_CYCLE[(THEME_CYCLE.indexOf(current) + 1) % 3];

  return (
    <Action
      label={mounted ? `${messages.theme}: ${messages[current]}` : messages.theme}
      onClick={() => {
        playSound("toggle");
        setTheme(next);
      }}
    >
      {!mounted || current === "system" ? (
        <DesktopIcon className="size-4" />
      ) : current === "light" ? (
        <SunIcon className="size-4" />
      ) : (
        <MoonIcon className="size-4" />
      )}
    </Action>
  );
}

export function SoundToggle() {
  const { messages } = useUiLanguage();
  const [muted, setMutedState] = useState(true);
  useEffect(() => setMutedState(isMuted()), []);

  return (
    <Action
      label={muted ? messages.unmute : messages.mute}
      onClick={() => {
        const next = !muted;
        setMuted(next);
        setMutedState(next);
        if (!next) playSound("pop");
      }}
    >
      {muted ? (
        <SpeakerSlashIcon className="size-4" />
      ) : (
        <SpeakerHighIcon className="size-4" />
      )}
    </Action>
  );
}
