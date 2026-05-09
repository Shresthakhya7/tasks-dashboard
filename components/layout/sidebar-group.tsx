"use client";

import { Group } from "@/menu-list/menu";
import { SidebarMenuItem } from "./sidebar-menu-items";

interface Props {
  group: Group;
  isCollapsed?: boolean;
}

export function SidebarGroup({ group, isCollapsed = false }: Props) {
  return (
    <div className="space-y-2">
      {!isCollapsed && (
        <h4 className="px-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground mt-4 first:mt-0 dark:text-slate-500">
          {group.groupLabel}
        </h4>
      )}

      <div className="space-y-1">
        {group.menus.map((menu) => (
          <SidebarMenuItem
            key={menu.href}
            menu={menu}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>
    </div>
  );
}
