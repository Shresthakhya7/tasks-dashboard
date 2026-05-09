"use client";

import { sidebarMenus } from "@/menu-list";
import { usePathname } from "next/navigation";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { SidebarGroup } from "./sidebar-group";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (val: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen, isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const groups = sidebarMenus(pathname);

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`${isMobileOpen
            ? "fixed left-0 top-0 bottom-0 z-60 w-72"
            : "hidden lg:flex lg:flex-col"
          } dark:border-r dark:border-gray-200 bg-gray-100 dark:bg-slate-900 overflow-y-auto transition-all duration-300 ease-in-out ${isOpen ? "md:w-72" : "md:w-20"
          }`}
      >
        <div className="flex h-20 items-center px-6 flex-shrink-0 gap-3">
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden rounded-lg border p-1.5 hover:bg-muted flex-shrink-0"
          >
            <X className="h-5 w-5" />
          </button>

          <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "flex-1 opacity-100" : "w-0 opacity-0"}`}>
            <h2 className="text-xl font-bold text-foreground whitespace-nowrap">Demo Tasks</h2>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden lg:flex ml-auto rounded-lg p-1.5 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors flex-shrink-0"
          >
            {isOpen
              ? <ChevronLeft className="h-5 w-5 text-muted-foreground" />
              : <ChevronRight className="h-5 w-5 text-muted-foreground" />}
          </button>
        </div>

        <nav className={`flex-1 space-y-4 overflow-y-auto py-6 ${isOpen ? "px-4" : "px-2"}`}>
          {groups.map((group) => (
            <SidebarGroup key={group.groupLabel} group={group} isCollapsed={!isOpen} />
          ))}
        </nav>
      </aside>
    </>
  );
}