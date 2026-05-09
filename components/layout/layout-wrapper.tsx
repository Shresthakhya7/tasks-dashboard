"use client";

import { useState } from "react";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";

interface LayoutWrapperProps {
    children: React.ReactNode;
    showSidebar?: boolean;
}

export function LayoutWrapper({
    children,
    showSidebar = true,
}: LayoutWrapperProps) {

    const [isOpen, setIsOpen] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="flex h-screen bg-white dark:bg-slate-900">
            {/* Sidebar - Left column */}
            {showSidebar && (
                <Sidebar
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    isMobileOpen={isMobileOpen}
                    setIsMobileOpen={setIsMobileOpen}
                />
            )}
            {/* Main Content - Right side */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Navbar */}
                <Navbar onMenuClick={() => setIsMobileOpen(true)} />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-3 md:p-6 lg:p-8 bg-white dark:bg-slate-900">
                    {children}
                </main>
            </div>
        </div>
    );
}
