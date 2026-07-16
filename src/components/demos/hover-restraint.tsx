"use client";

import { Demo } from "@/components/app/demo";

const ITEMS = ["Inbox", "Today", "Upcoming", "Projects", "Archive"];

export function HoverRestraintDemo() {
  return (
    <Demo>
      <div className="grid w-full max-w-96 grid-cols-2 gap-6">
        <div>
          <p className="mb-2 font-mono text-[10px] text-muted-foreground">
            300ms transition
          </p>
          <ul className="flex flex-col gap-0.5">
            {ITEMS.map((item) => (
              <li
                key={item}
                className="cursor-default rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors duration-300 hover:bg-muted hover:text-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 font-mono text-[10px] text-muted-foreground">
            instant
          </p>
          <ul className="flex flex-col gap-0.5">
            {ITEMS.map((item) => (
              <li
                key={item}
                className="cursor-default rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="max-w-sm text-center text-xs text-muted-foreground text-pretty">
        Move quickly across both lists. The animated one always feels a step
        behind your cursor; the instant one feels like the app is fast.
      </p>
    </Demo>
  );
}
