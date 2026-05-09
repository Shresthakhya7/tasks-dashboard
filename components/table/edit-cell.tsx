"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ColumnMeta } from "@/lib/types";
import { Pencil } from "lucide-react";

interface EditableCellProps {
    value: unknown;
    field: string;
    rowId: string;
    meta?: ColumnMeta;
    isEditing: boolean;
    isCellActive?: boolean;
    draftValue: unknown;
    error?: string;
    onCellClick?: () => void;
    onChange: (value: unknown) => void;
}

export function EditableCell({
    value,
    field,
    rowId,
    meta,
    isEditing,
    isCellActive,
    draftValue,
    error,
    onCellClick,
    onChange,
}: EditableCellProps) {
    const type = meta?.type ?? "text";
    const editable = meta?.editable !== false;
    const displayValue = isEditing ? draftValue : value;

    if (!isEditing || !editable) {
        if (type === "badge" && meta?.options) {
            const opt = meta.options.find((o) => o.value === value);

            const className =
                meta.badgeClass?.(String(value)) ?? "bg-gray-100 text-gray-800";

            return (
                <div
                    className="flex items-center"
                    onClick={editable ? onCellClick : undefined}
                >
                    <Badge className={className}>
                        {opt?.label ?? String(value ?? "—")}
                    </Badge>
                </div>
            );
        }
        return (
            <div
                className={cn(
                    "flex items-center min-h-[28px]",
                    editable &&
                    "group-hover/cell:bg-muted-foreground rounded cursor-pointer transition-colors px-1 -mx-1"
                )}
                onClick={editable ? onCellClick : undefined}
            >
                <span className="text-sm text-foreground truncate">
                    {value != null && value !== "" ? String(value) : (
                        <span className="text-slate-400 italic text-xs">—</span>
                    )}
                </span>
                {editable && (
                    <span className="ml-1.5 opacity-0 group-hover/cell:opacity-100 transition-opacity text-slate-300">
                        <Pencil className="w-3 h-3" />
                    </span>
                )}
            </div>
        );
    }

    if (type === "select" || type === "badge") {
        return (
            <Select
                value={String(draftValue ?? "")}
                onValueChange={(v) => onChange(v)}
            >
                <SelectTrigger className={cn(error && "border-red-400")}>
                    <SelectValue placeholder={meta?.placeholder ?? "Select..."} />
                </SelectTrigger>
                <SelectContent>
                    {meta?.options?.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
                {error && <p className="mt-0.5 text-xs text-red-500">{error}</p>}
            </Select>
        );
    }

    return (
        <div className="space-y-1">

            <Input
                type={type === "number" ? "number" : type === "email" ? "email" : "text"}
                value={String(draftValue ?? "")}
                placeholder={meta?.placeholder}
                autoFocus={isCellActive}
                className={cn(
                    error &&
                    "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500"
                )}
                onChange={(e) => {
                    const raw = e.target.value;
                    onChange(type === "number" ? (raw === "" ? "" : Number(raw)) : raw);
                }}
            />
            {error && (
                <p className="text-xs text-red-500 px-1">
                    {error}
                </p>
            )}
        </div>
    );
}