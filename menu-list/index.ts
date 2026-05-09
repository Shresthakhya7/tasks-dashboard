import { dashboardMenu, tableMenu } from "./menu";

export const sidebarMenus = (pathname: string) =>[
    dashboardMenu(pathname),
    tableMenu(pathname),
];