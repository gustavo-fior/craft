"use client";

import { useDemoText } from "@/components/app/demo-messages";
import { ArrowsClockwiseIcon } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { useState } from "react";

import { Compare, CompareItem } from "@/components/app/compare";
import { Demo } from "@/components/app/demo";
import { SegmentedControl } from "@/components/app/segmented-control";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const ITEM_MS = 360;

const INBOX = [
  { from: "Linear", domain: "linear.app", subject: "Cycle 42 starts Monday", time: "9:12" },
  { from: "Vercel", domain: "vercel.com", subject: "Deployment ready for review", time: "8:47" },
  { from: "Raycast", domain: "raycast.com", subject: "Your extension was approved", time: "8:20" },
  { from: "Notion", domain: "notion.so", subject: "Weekly digest for Design", time: "7:55" },
  { from: "Figma", domain: "figma.com", subject: "Ana left 3 comments", time: "7:31" },
] as const;

const LONG_LIST = [
  ...INBOX,
  { from: "GitHub", domain: "github.com", subject: "PR #812 approved", time: "7:04" },
  { from: "Stripe", domain: "stripe.com", subject: "Payout of $4,210 sent", time: "6:48" },
  { from: "Slack", domain: "slack.com", subject: "New message in #design", time: "6:30" },
  { from: "Loom", domain: "loom.com", subject: "Sam shared a recording", time: "6:02" },
  { from: "Resend", domain: "resend.com", subject: "Domain verified", time: "5:40" },
] as const;

type Mail = (typeof LONG_LIST)[number];

function getSliderValue(value: number | readonly number[]) {
  return Array.isArray(value) ? value[0] : (value as number);
}

function StaggerStyles() {
  return (
    <style>{`
      @keyframes craft-stagger-in {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  );
}

function MailRow({
  mail,
  delay,
  duration,
  compact,
}: {
  mail: Mail;
  delay: number;
  duration: number;
  compact?: boolean;
}) {
  const t = useDemoText();
  return (
    <li
      className={cn(
        "flex items-center gap-2.5 px-3",
        compact ? "py-1.5" : "py-2"
      )}
      style={{
        animation: `craft-stagger-in ${duration}ms ${EASE_OUT} ${delay}ms both`,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        className="size-4 shrink-0 rounded-sm"
        height={16}
        src={`https://www.google.com/s2/favicons?domain=${mail.domain}&sz=64`}
        width={16}
      />
      <span className="flex min-w-0 flex-1 flex-col leading-tight">
        <span className="truncate text-xs font-medium text-foreground">
          {mail.from}
        </span>
        {!compact && (
          <span className="truncate text-[11px] text-muted-foreground">
            {t(mail.subject)}
          </span>
        )}
      </span>
      <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
        {mail.time}
      </span>
    </li>
  );
}

function MailList({
  items,
  step,
  duration,
  run,
  compact,
  className,
}: {
  items: readonly Mail[];
  step: number;
  duration: number;
  run: number;
  compact?: boolean;
  className?: string;
}) {
  return (
    <ul
      key={run}
      className={cn(
        "w-full divide-y divide-[#E7E7E7] rounded-xl bg-card py-1 shadow-(--custom-shadow) dark:divide-[#1E1E1E]",
        className
      )}
    >
      {items.map((mail, index) => (
        <MailRow
          key={mail.from}
          compact={compact}
          delay={index * step}
          duration={duration}
          mail={mail}
        />
      ))}
    </ul>
  );
}

function ReplayButton({ onClick }: { onClick: () => void }) {
  const t = useDemoText();
  return (
    <Button onClick={onClick} variant="secondary">
      <ArrowsClockwiseIcon weight="bold" />
      {t("Replay")}
    </Button>
  );
}

export function StaggerDemo() {
  const t = useDemoText();
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(40);
  const [run, setRun] = useState(0);
  const duration = reduceMotion ? 0 : ITEM_MS;

  return (
    <Demo className="gap-8">
      <StaggerStyles />
      <MailList
        className="max-w-xs"
        duration={duration}
        items={INBOX}
        run={run}
        step={reduceMotion ? 0 : step}
      />

      <div className="flex w-full max-w-xs flex-col items-center gap-5">
        <label className="grid w-full gap-2.5">
          <span className="flex justify-between text-xs text-muted-foreground">
            {t("Delay between items")}
            <span className="tabular-nums text-foreground">{step}ms</span>
          </span>
          <Slider
            aria-label={t("Delay between items")}
            max={120}
            min={0}
            onValueChange={(value) => {
              setStep(getSliderValue(value));
              setRun((n) => n + 1);
            }}
            step={10}
            value={[step]}
          />
        </label>
        <ReplayButton onClick={() => setRun((n) => n + 1)} />
      </div>
    </Demo>
  );
}

export function StaggerCompareDemo() {
  const reduceMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const duration = reduceMotion ? 0 : ITEM_MS;

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <StaggerStyles />
      <Compare>
        <CompareItem verdict="wrong">
          <MailList
            compact
            duration={duration}
            items={INBOX}
            run={run}
            step={0}
          />
        </CompareItem>
        <CompareItem verdict="right">
          <MailList
            compact
            duration={duration}
            items={INBOX}
            run={run}
            step={reduceMotion ? 0 : 40}
          />
        </CompareItem>
      </Compare>
      <ReplayButton onClick={() => setRun((n) => n + 1)} />
    </Demo>
  );
}

const CAP_MODES = [
  { value: "fixed", label: "Fixed step" },
  { value: "capped", label: "Capped total" },
] as const;
type CapMode = (typeof CAP_MODES)[number]["value"];

const FIXED_STEP = 60;
const TOTAL_CAP = 300;

export function StaggerCapDemo() {
  const t = useDemoText();
  const reduceMotion = useReducedMotion();
  const [mode, setMode] = useState<CapMode>("fixed");
  const [run, setRun] = useState(0);
  const duration = reduceMotion ? 0 : ITEM_MS;
  const step =
    mode === "fixed" ? FIXED_STEP : TOTAL_CAP / (LONG_LIST.length - 1);
  const lastStart = Math.round(step * (LONG_LIST.length - 1));

  return (
    <Demo className="gap-8">
      <StaggerStyles />
      <div className="flex w-full max-w-xs flex-col items-end gap-2">
        <MailList
          compact
          duration={duration}
          items={LONG_LIST}
          run={run}
          step={reduceMotion ? 0 : step}
        />
        <span className="text-[10px] tabular-nums text-muted-foreground">
          {t("Last item starts at {time}ms", { time: lastStart })}
        </span>
      </div>

      <div className="flex flex-col items-center gap-5">
        <SegmentedControl
          ariaLabel={t("Stagger strategy")}
          onChange={(value) => {
            setMode(value);
            setRun((n) => n + 1);
          }}
          options={CAP_MODES.map((option) => ({ ...option, label: t(option.label) }))}
          value={mode}
        />
        <ReplayButton onClick={() => setRun((n) => n + 1)} />
      </div>
    </Demo>
  );
}
