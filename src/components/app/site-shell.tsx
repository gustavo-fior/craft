"use client";

import { IconMenu2 } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { CommandMenu } from "@/components/app/command-menu";
import {
  CopyLinkButton,
  SoundToggle,
  ThemeSwitcher,
  ViewInRepoButton,
} from "@/components/app/header-actions";
import { SidebarNav } from "@/components/app/sidebar-nav";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  const repoUrl = githubSourceUrl(sourcePaths[slug]);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <div className="min-h-dvh">
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-4 sm:px-8">
        <div className="flex items-center gap-2">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Open navigation"
                  className="md:hidden"
                >
                  <IconMenu2 className="size-4" />
                </Button>
              }
            />
            <SheetContent side="left" className="w-64 px-6">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <SidebarNav sections={sections} />
            </SheetContent>
          </Sheet>
          <Link href="/" className="font-redaction text-[13px] text-foreground">
            Craftttt
          </Link>
        </div>
        <div className="flex items-center gap-1">
          <CopyLinkButton />
          <ViewInRepoButton href={repoUrl} />
          <ThemeSwitcher />
          <SoundToggle />
        </div>
      </header>

      <aside className="fixed top-1/2 left-0 hidden w-56 -translate-y-1/2 pl-8 md:block">
        <SidebarNav sections={sections} />
      </aside>

      <main className="mx-auto w-full max-w-160 px-5 pt-28 pb-24 sm:px-8">
        {children}
      </main>

      <CommandMenu sections={sections} />
    </div>
  );
}
