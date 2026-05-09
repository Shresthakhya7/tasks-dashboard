import { Menu } from "@/lib/types";
import { LayoutDashboard, User } from "lucide-react";

export interface Group {
    groupLabel: string;
    menus: Menu[];
}

export const dashboardMenu = (
    pathname: string
): Group => ({
    groupLabel: "Main",

    menus: [
        {
            href: "/dashboard",
            label: "Dashboard",
            active: pathname.includes("/dashboard"),
            icon: LayoutDashboard,
        },
    ],
});

export const tableMenu = (
    pathname: string
): Group => ({
    groupLabel: "Management",

    menus: [
        {
            href: "/users",
            label: "Users",
            active: pathname.includes("/users"),
            icon: User,
        },
    ],
});