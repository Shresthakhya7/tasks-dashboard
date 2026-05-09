"use client";

import React, { useCallback, useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    SortingState,
    ColumnFiltersState,
} from "@tanstack/react-table";
import { z } from "zod";
import { toast } from "sonner";
import { Trash2, Pencil, Check, X, ArrowUpDown, ArrowUp, ArrowDown, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DataTableProps, TableColumnDef } from "@/lib/types";
import { useTableStore } from "@/store/table-store";
import { EditableCell } from "./edit-cell";
import { emailSchema, nameSchema, phoneSchema, salarySchema } from "@/lib/schemas";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink } from "../ui/pagination";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";

export function DataTable<TData extends { id: string }>({
    data,
    columns,
    editMode = "both",
    onEdit,
    onSave,
    onDelete,
    caption,
    showRowNumbers = false,
    emptyMessage = "No data available.",
    enableColumnVisibility = true,
}: DataTableProps<TData>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [savingRows, setSavingRows] = useState<Set<string>>(new Set());
    const [deletingRows, setDeletingRows] = useState<Set<string>>(new Set());

    const {
        startRowEdit,
        startCellEdit,
        updateDraft,
        setValidationError,
        clearValidationError,
        cancelEdit,
        isRowEditing,
        getDraft,
        getErrors,
        activeCell,
        editingRows,
    } = useTableStore();

    //single field validation
    const validateField = useCallback(
        (
            rowId: string,
            field: string,
            value: unknown,
            meta?: TableColumnDef<TData>["meta"]
        ) => {
            let error: string | null = null;

            // Existing custom validation
            if (meta?.validate) {
                error = meta.validate(value) ?? null;
            }

            // Zod validation
            if (!error) {
                try {
                    if (field === "name") {
                        nameSchema.parse(value);
                    }

                    if (field === "email") {
                        emailSchema.parse(value);
                    }
                    if (field === "phone") {
                        phoneSchema.parse(String(value));
                    }
                    if (field === "salary") {
                        salarySchema.parse(value);
                    }

                } catch (err) {
                    if (err instanceof z.ZodError) {
                        error = err.issues[0]?.message || "Invalid value";
                    }
                }
            }

            if (error) {
                setValidationError(rowId, field, error);
                return false;
            }

            clearValidationError(rowId, field);
            return true;
        },
        [setValidationError, clearValidationError]
    );

    // save function
    const handleSave = useCallback(
        async (rowId: string) => {
            const draft = getDraft(rowId);
            if (!draft) return;

            const original = data.find((d) => d.id === rowId);
            if (!original) return;

            const errors = getErrors(rowId);
            const hasErrors = errors && Object.keys(errors).length > 0;

            if (hasErrors) {
                toast.error("Cannot save row", {
                    description: "Please fix validation errors before saving.",
                });
                return;
            }

            setSavingRows((s) => new Set(s).add(rowId));

            try {
                await onSave?.(rowId, draft as TData, original);

                cancelEdit(rowId);

                toast.success("Row saved successfully.", {
                    description: `Changes to row #${rowId} have been applied.`,
                });
            } catch (err) {
                toast.error("Failed to save row.", {
                    description: err instanceof Error ? err.message : "Unknown error",
                });
            } finally {
                setSavingRows((s) => {
                    const next = new Set(s);
                    next.delete(rowId);
                    return next;
                });
            }
        },
        [getDraft, data, onSave, cancelEdit, getErrors]
    );

    //delete
    const handleDelete = useCallback(
        async (rowId: string, rowData: TData) => {
            setDeletingRows((s) => new Set(s).add(rowId));
            try {
                await onDelete?.(rowId, rowData);
                cancelEdit(rowId);
                toast.success("Row deleted.", {
                    description: `Row #${rowId} has been removed.`,
                });
            } catch (err) {
                toast.error("Failed to delete row.", {
                    description: err instanceof Error ? err.message : "Unknown error",
                });
            } finally {
                setDeletingRows((s) => {
                    const next = new Set(s);
                    next.delete(rowId);
                    return next;
                });
            }
        },
        [onDelete, cancelEdit]
    );

    //action column
    const actionColumn: TableColumnDef<TData> = {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => {
            const rowId = row.original.id;
            const isEditing = isRowEditing(rowId);
            const isSaving = savingRows.has(rowId);
            const isDeleting = deletingRows.has(rowId);

            if (isEditing) {
                return (
                    <div className="flex items-center gap-1">
                        <Button
                            size="sm"
                            variant="default"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleSave(rowId)}
                            disabled={isSaving}
                            title="Save changes"
                        >
                            <Check className="h-3 w-3" />
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                cancelEdit(rowId);
                                toast.info("Edit cancelled. Changes discarded.");
                            }}
                            disabled={isSaving}
                            title="Cancel edit"
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                );
            }

            return (
                <div className="flex items-center gap-1">
                    {(editMode === "row" || editMode === "both") && (
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                                startRowEdit(rowId, row.original as Record<string, unknown>);
                                onEdit?.(rowId, row.original);
                            }}
                            title="Edit row"
                        >
                            <Pencil className="h-3.5 w-3.5" />
                        </Button>
                    )}
                    <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(rowId, row.original)}
                        disabled={isDeleting}
                        title="Delete row"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            );
        },
    };

    const allColumns = [...columns, actionColumn];

    const table = useReactTable({
        data,
        columns: allColumns,
        state: { sorting, columnFilters, globalFilter },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getRowId: (row) => row.id,
    });

    return (
        <div className="w-full space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Left Side - Search */}
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                    <Input
                        placeholder="Search all columns..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="pl-9 h-9 rounded-lg border-muted bg-background shadow-sm"
                    />
                </div>

                {/* Right Side */}
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                        <span className="font-medium text-foreground">
                            {table.getFilteredRowModel().rows.length}
                        </span>{" "}
                        row
                        {table.getFilteredRowModel().rows.length !== 1 ? "s" : ""}

                        {Object.keys(editingRows).length > 0 && (
                            <span className="ml-2 text-amber-500 font-medium">
                                • {Object.keys(editingRows).length} unsaved
                            </span>
                        )}
                    </div>

                    {enableColumnVisibility && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 rounded-lg gap-2 shadow-sm"
                                >
                                    <ChevronDown className="h-4 w-4" />
                                    Columns
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="end"
                                className="w-56 rounded-xl"
                            >
                                {table.getAllLeafColumns().map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>

            {/* ── Table ── */}
            <div className="rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                <ScrollArea className="w-full whitespace-nowrap">
                    <table className="w-full xl:table-fixed text-sm">
                        {caption && (
                            <caption className="px-3 py-2 text-left text-xs text-muted-foreground border-b border-slate-100">
                                {caption}
                            </caption>
                        )}
                        <thead>
                            {table.getHeaderGroups().map((hg) => (
                                <tr key={hg.id} className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200">
                                    {showRowNumbers && (
                                        <th className="w-10 px-3 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                                            #
                                        </th>
                                    )}
                                    {hg.headers.map((header) => {
                                        const canSort = header.column.getCanSort();
                                        const sorted = header.column.getIsSorted();
                                        return (
                                            <th
                                                key={header.id}
                                                className={cn(
                                                    "px-3 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap select-none",
                                                    canSort && "cursor-pointer hover:text-slate-800 transition-colors"
                                                )}
                                                onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                                            >
                                                <div className="flex items-center gap-1.5">
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {canSort && (
                                                        <span className="text-muted-foreground">
                                                            {sorted === "asc" ? (
                                                                <ArrowUp className="h-3 w-3" />
                                                            ) : sorted === "desc" ? (
                                                                <ArrowDown className="h-3 w-3" />
                                                            ) : (
                                                                <ArrowUpDown className="h-3 w-3" />
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white dark:bg-slate-800">
                            {table.getRowModel().rows.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={allColumns.length + (showRowNumbers ? 1 : 0)}
                                        className="px-3 py-12 text-center text-sm text-foreground"
                                    >
                                        {emptyMessage}
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map((row, index) => {
                                    const rowId = row.original.id;
                                    const isEditing = isRowEditing(rowId);
                                    const draft = getDraft(rowId) ?? {};
                                    const errors = getErrors(rowId);
                                    const isSaving = savingRows.has(rowId);
                                    const isDeleting = deletingRows.has(rowId);

                                    return (
                                        <tr
                                            key={row.id}
                                            className={cn(
                                                "transition-colors group",
                                                isEditing
                                                    ? "bg-amber-50/60 border-l-2 border-l-amber-400"
                                                    : "hover:bg-slate-50/70",
                                                (isSaving || isDeleting) && "opacity-60 pointer-events-none"
                                            )}
                                        >
                                            {showRowNumbers && (
                                                <td className="w-10 px-3 py-2.5 text-xs text-foreground font-mono">
                                                    {index + 1}
                                                </td>
                                            )}
                                            {row.getVisibleCells().map((cell) => {
                                                const colDef = cell.column.columnDef as TableColumnDef<TData>;
                                                const accessorKey = (colDef as { accessorKey?: string }).accessorKey;
                                                const meta = colDef.meta;
                                                const isActionCol = cell.column.id === "actions";
                                                const isCellActive =
                                                    activeCell?.rowId === rowId &&
                                                    activeCell?.columnId === accessorKey;

                                                if (isActionCol) {
                                                    return (
                                                        <td key={cell.id} className="px-4 py-2.5 whitespace-nowrap">
                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                        </td>
                                                    );
                                                }

                                                return (
                                                    <td
                                                        key={cell.id}
                                                        className={cn(
                                                            "px-3 py-2 group/cell text-foreground",
                                                            isEditing && meta?.editable !== false && "min-w-[140px]"
                                                        )}
                                                    >
                                                        {accessorKey ? (
                                                            <EditableCell
                                                                value={cell.getValue()}
                                                                field={accessorKey}
                                                                rowId={rowId}
                                                                meta={meta}
                                                                isEditing={isEditing}
                                                                isCellActive={isCellActive}
                                                                draftValue={isEditing ? (draft[accessorKey] ?? cell.getValue()) : cell.getValue()}
                                                                error={errors[accessorKey]}
                                                                onCellClick={
                                                                    (editMode === "cell" || editMode === "both") && meta?.editable !== false
                                                                        ? () => {
                                                                            startCellEdit(
                                                                                rowId,
                                                                                accessorKey,
                                                                                row.original as Record<string, unknown>
                                                                            );
                                                                            onEdit?.(rowId, row.original);
                                                                        }
                                                                        : undefined
                                                                }
                                                                onChange={(value) => {
                                                                    updateDraft(rowId, accessorKey, value);
                                                                    validateField(rowId, accessorKey, value, meta);
                                                                }}
                                                            />
                                                        ) : (
                                                            flexRender(cell.column.columnDef.cell, cell.getContext())
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>


            {/* ── Pagination ── */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="text-center text-sm text-muted-foreground md:text-left">
                    Showing{" "}
                    <span className="font-semibold">
                        {table.getState().pagination.pageIndex *
                            table.getState().pagination.pageSize +
                            1}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold">
                        {Math.min(
                            (table.getState().pagination.pageIndex + 1) *
                            table.getState().pagination.pageSize,
                            table.getFilteredRowModel().rows.length
                        )}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold">
                        {table.getFilteredRowModel().rows.length}
                    </span>{" "}
                    rows
                </div>

                <div className="overflow-x-auto">
                    <Pagination>
                        <PaginationContent className="flex-nowrap gap-1">
                            <PaginationItem>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    className="h-8 px-2"
                                >
                                    <span className="hidden sm:inline">Previous</span>
                                    <span className="sm:hidden">&larr;</span>
                                </Button>
                            </PaginationItem>

                            {Array.from({ length: table.getPageCount() }, (_, i) => {
                                const pageNumber = i + 1;
                                const currentPage =
                                    table.getState().pagination.pageIndex + 1;
                                const totalPages = table.getPageCount();

                                if (
                                    pageNumber === 1 ||
                                    pageNumber === totalPages ||
                                    (pageNumber >= currentPage - 1 &&
                                        pageNumber <= currentPage + 1)
                                ) {
                                    return (
                                        <PaginationItem key={pageNumber}>
                                            <PaginationLink
                                                onClick={() =>
                                                    table.setPageIndex(pageNumber - 1)
                                                }
                                                isActive={currentPage === pageNumber}
                                                className="h-8 w-8"
                                            >
                                                {pageNumber}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                }

                                if (
                                    (pageNumber === 2 && currentPage > 3) ||
                                    (pageNumber === totalPages - 1 &&
                                        currentPage < totalPages - 2)
                                ) {
                                    return (
                                        <PaginationItem
                                            key={`ellipsis-${pageNumber}`}
                                        >
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    );
                                }

                                return null;
                            })}

                            <PaginationItem>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                    className="h-8 px-2"
                                >
                                    <span className="hidden sm:inline">Next</span>
                                    <span className="sm:hidden">&rarr;</span>
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>

                <div className="flex items-center justify-center gap-2 md:justify-end">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                        Page size:
                    </span>

                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => {
                            table.setPageSize(Number(e.target.value));
                        }}
                        className="h-8 rounded-md border border-slate-200 px-2 py-1 text-sm text-muted-foreground"
                    >
                        {[1, 3, 5, 10, 20].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}