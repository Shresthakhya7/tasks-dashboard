"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu } from "@/lib/types";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
    menu: Menu;
    isCollapsed?: boolean;
}

export function SidebarMenuItem({ menu, isCollapsed = false }: Props) {
    const Icon = menu.icon;

    const linkContent = (
        <Link
            href={menu.href}
            className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                menu.active
                    ? "bg-primary text-primary-foreground shadow-sm dark:bg-slate-700 dark:text-white"
                    : "text-foreground hover:bg-muted dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            )}
        >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span className="truncate">{menu.label}</span>}
        </Link>
    );

    if (isCollapsed) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right">{menu.label}</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return linkContent;
}
