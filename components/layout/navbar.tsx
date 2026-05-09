"use client";

import { Search, Bell, Settings, Menu } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";

interface NavbarProps {
    onMenuClick: () => void
}


export function Navbar({ onMenuClick }: NavbarProps) {
    const [searchFocus, setSearchFocus] = useState(false);

    return (
        <header className="sticky top-0 z-20 h-20 border-b border-gray-200 bg-white/95 dark:bg-slate-900 backdrop-blur-sm px-6 flex items-center justify-between">
            <div className="pr-2">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden rounded-lg border p-1.5 hover:bg-muted flex-shrink-0"
                >
                    <Menu className="h-5 w-5" />
                </button>
            </div>

            <div className="flex items-center gap-4 ml-auto">
                <ThemeToggle />

                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-medium text-foreground">Shreejan</p>
                        <p className="text-xs text-muted-foreground">Admin</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-black to-gray-700 text-white dark:from-slate-700 dark:to-slate-900 flex items-center justify-center text-sm font-semibold">
                        S
                    </div>
                </div>
            </div>
        </header>
    );
}
