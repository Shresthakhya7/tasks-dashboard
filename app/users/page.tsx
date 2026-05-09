"use client";

import { useState, useCallback } from "react";
import { Users, Info } from "lucide-react";
import { User, userColumns, initialUsers } from "@/lib/users-data";
import { DataTable } from "@/components/table/data-table";
import { LayoutWrapper } from "@/components/layout/layout-wrapper";
import { useUsersStore } from "@/store/table-store";

export default function Home() {

    const users = useUsersStore((s) => s.users);
    const updateUser = useUsersStore((s) => s.updateUser);
    const deleteUser = useUsersStore((s) => s.deleteUser);
    const handleSave = useCallback(
        async (rowId: string, updated: User) => {
            await new Promise((r) => setTimeout(r, 600));
            updateUser(rowId, updated);
        },
        [updateUser]
    );

    const handleDelete = useCallback(
        async (rowId: string) => {
            await new Promise((r) => setTimeout(r, 400));
            deleteUser(rowId);
        },
        [deleteUser]
    );

    const handleEdit = useCallback((rowId: string, rowData: User) => {
        console.info("[onEdit]", rowId, rowData);
    }, []);

    return (
        <LayoutWrapper>
            <div className="bg-white dark:bg-slate-900 p-2">
                <div className="mb-5">
                    <h2 className="text-base font-semibold text-foreground">Users Management</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">{users.length} team members</p>
                </div>

                <DataTable<User>
                    data={users}
                    columns={userColumns}
                    editMode="both"
                    onEdit={handleEdit}
                    onSave={handleSave}
                    onDelete={handleDelete}
                    showRowNumbers
                    emptyMessage="No users found. Try adjusting your search."
                />
            </div>
        </LayoutWrapper>
    );
}