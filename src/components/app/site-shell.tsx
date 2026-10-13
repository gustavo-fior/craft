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
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between bg-background/80 sm:bg-transparent p-5 backdrop-blur-sm sm:backdrop-blur-none sm:px-8 sm:py-6.5">
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
                  <ListIcon className="size-4 mb-0.75" />
                </Button>
              }
            />
            <Dialog.Portal>
              <Dialog.Backdrop className="nav-backdrop fixed inset-0 z-50 lg:hidden">
                {[1, 2, 4, 8, 16].map((blur, i) => (
                  <div
                    key={blur}
                    className="nav-blur-layer"
                    style={
                      {
                        "--blur": `${blur}px`,
                        "--start": `${i * 16}%`,
                        "--end": `${i * 16 + 20}%`,
                      } as React.CSSProperties
                    }
                  />
                ))}
                <div className="nav-tint" />
              </Dialog.Backdrop>
              <Dialog.Popup className="nav-reveal fixed inset-y-0 left-0 z-50 flex w-72 max-w-full flex-col outline-none lg:hidden">
                <Dialog.Title className="sr-only">Navigation</Dialog.Title>
                {/* Sits exactly where the menu button was, so it reads as the
                    same control flipping to close. */}
                <div className="p-5">
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
                  className="-mt-8 min-h-0 flex-1 pl-17"
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

      <aside className="fixed top-1/2 left-0 hidden w-56 -translate-y-1/2 pl-8 lg:block">
        {/* 65vh of list + py-12 on both ends, so the fade gradients sit at
            the edges instead of eating into the resting list. */}
        <SidebarNav sections={sections} className="h-[calc(65vh+6rem)]" />
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
