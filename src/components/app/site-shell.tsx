"use client";

import { Dialog } from "@base-ui/react/dialog";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { CommandMenu } from "@/components/app/command-menu";
import {
  CopyLinkButton,
  CopyMarkdownButton,
  SoundToggle,
  ThemeSwitcher,
  ViewInRepoButton,
} from "@/components/app/header-actions";
import { SidebarNav } from "@/components/app/sidebar-nav";
import { Wordmark } from "@/components/app/wordmark";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { NavSection } from "@/lib/sections";
import { githubSourceUrl } from "@/lib/site";

export function SiteShell({
  sections,
  sourcePaths,
  children,
}: {
  sections: NavSection[];
  /** slug -> content file path, for View-in-Repo deep links. */
  sourcePaths: Record<string, string>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const slug = pathname.slice(1);
  const isConcept = slug in sourcePaths;
  const repoUrl = githubSourceUrl(sourcePaths[slug]);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <div className="min-h-dvh">
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between p-5 sm:px-8 sm:py-6.5">
        {/* Mobile only: a progressive blur, like the menu's, strongest at the
            top and fading out a little below the header instead of a hard
            edge. Runs past the header's bottom so the fade has room. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[calc(100%+3rem)] sm:hidden"
        >
          {[1, 2, 4, 8].map((blur, i) => (
            <div
              key={blur}
              className="header-blur-layer"
              style={
                {
                  "--blur": `${blur}px`,
                  "--start": `${i * 20}%`,
                  "--end": `${i * 20 + 30}%`,
                } as React.CSSProperties
              }
            />
          ))}
          <div className="header-tint" />
        </div>
        <div className="flex items-center gap-1">
          {/* Experimental mobile menu: no sheet - the page blurs progressively
              towards the left and the links drift in over it. */}
          <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
            <Dialog.Trigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Open navigation"
                  className="lg:hidden"
                >
                  <ListIcon className="size-4 mt-px mb-0.75" />
                </Button>
              }
            />
            <Dialog.Portal>
              <Dialog.Backdrop className="nav-backdrop fixed inset-0 z-50 lg:hidden">
                {/* 8 overlapping bands, 8px on the right edge up to 16px
                    under the links, so the progression ends on half blur
                    instead of none. */}
                {Array.from({ length: 8 }, (_, i) => (
                  <div
                    key={i}
                    className="nav-blur-layer"
                    style={
                      {
                        "--blur": `${(8 * 2 ** (i / 7)).toFixed(1)}px`,
                        "--band": `${i * 12.5}%`,
                      } as React.CSSProperties
                    }
                  />
                ))}
                <div className="nav-tint" />
              </Dialog.Backdrop>
              {/* Full width so the list scrolls from anywhere on screen. That
                  covers the backdrop, so taps on empty space (anything but a
                  link, button or disabled row) close the menu instead. */}
              <Dialog.Popup
                onClick={(e) => {
                  if (
                    !(e.target as Element).closest(
                      "a, button, [aria-disabled]"
                    )
                  ) {
                    setMobileOpen(false);
                  }
                }}
                className="nav-reveal fixed inset-0 z-50 flex flex-col outline-none lg:hidden"
              >
                <Dialog.Title className="sr-only">Navigation</Dialog.Title>
                {/* Sits exactly where the menu button was, so it reads as the
                    same control flipping to close. Raised above the nav, which
                    is pulled up under it by -mt-12 and would eat the taps. */}
                <div className="relative z-10 self-start p-5">
                  <Dialog.Close
                    data-reveal
                    style={{ "--reveal-i": 0 } as React.CSSProperties}
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Close navigation"
                      />
                    }
                  >
                    <XIcon className="size-4" />
                  </Dialog.Close>
                </div>
                <SidebarNav
                  sections={sections}
                  className="-mt-12 min-h-0 flex-1 pl-17"
                />
              </Dialog.Popup>
            </Dialog.Portal>
          </Dialog.Root>
          <Wordmark />
        </div>
        {/* Grouped so moving between adjacent tooltips skips the open delay
            and animation - only the first one animates in. */}
        <TooltipProvider timeout={500}>
          <div className="flex items-center gap-1">
            {isConcept && <CopyMarkdownButton href={`/${slug}.md`} />}
            <CopyLinkButton />
            <ViewInRepoButton href={repoUrl} />
            <ThemeSwitcher />
            <SoundToggle />
          </div>
        </TooltipProvider>
      </header>

      <aside className="fixed top-1/2 left-0 hidden w-56 -translate-y-[calc(50%-1rem)] pl-8 lg:block">
        {/* 62vh of list + py-16 on both ends, so the fade gradients sit at
            the edges instead of eating into the resting list. */}
        <SidebarNav sections={sections} className="h-[calc(62vh+8rem)]" />
      </aside>

      {/* px-7 on mobile lines the content up with the header icon glyphs,
          which sit 8px inside their size-8 ghost buttons (20px pad + 8px). */}
      <main className="mx-auto w-full max-w-160 px-7 pt-28 pb-24 sm:px-8">
        {children}
      </main>

      <CommandMenu sections={sections} />
    </div>
  );
}
